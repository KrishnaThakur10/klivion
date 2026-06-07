"use server"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const LineItemSchema = z.object({
  description: z.string().min(1),
  quantity: z.number().min(0),
  rate: z.number().min(0),
})

const InvoiceSchema = z.object({
  clientId: z.string().optional(),
  dueDate: z.string().min(1, "Due date is required"),
  taxRate: z.number().min(0).max(100).default(0),
  lineItems: z.array(LineItemSchema).min(1, "Add at least one item"),
})

export async function createInvoice(data: {
  clientId?: string
  dueDate: string
  taxRate: number
  lineItems: { description: string; quantity: number; rate: number }[]
}) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const validated = InvoiceSchema.safeParse(data)
  if (!validated.success) {
    return { error: validated.error.issues[0].message }
  }

  // Calculate total
  const subtotal = data.lineItems.reduce(
    (sum, item) => sum + item.quantity * item.rate, 0
  )
  const tax = subtotal * (data.taxRate / 100)
  const total = subtotal + tax

  // Generate invoice number
  const count = await db.invoice.count({
    where: { userId: session.user.id }
  })
  const number = `INV-${String(count + 1).padStart(4, "0")}`

  const invoice = await db.invoice.create({
    data: {
      number,
      status: "draft",
      dueDate: new Date(data.dueDate),
      total,
      userId: session.user.id,
      clientId: data.clientId || null,
      lineItems: {
        create: data.lineItems.map((item) => ({
          description: item.description,
          quantity: item.quantity,
          rate: item.rate,
        })),
      },
    },
  })

  revalidatePath("/dashboard/invoices")
  return { success: true, id: invoice.id }
}

export async function updateInvoiceStatus(invoiceId: string, status: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  await db.invoice.update({
    where: { id: invoiceId, userId: session.user.id },
    data: { status },
  })

  revalidatePath("/dashboard/invoices")
}

export async function deleteInvoice(invoiceId: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  await db.invoice.delete({
    where: { id: invoiceId, userId: session.user.id },
  })

  revalidatePath("/dashboard/invoices")
}