"use server"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const ClientSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  company: z.string().optional(),
  phone: z.string().optional(),
})

export async function createClient(data: {
  name: string
  email: string
  company?: string
  phone?: string
}) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const validated = ClientSchema.safeParse(data)
  if (!validated.success) {
    return { error: validated.error.issues[0].message }
  }

  await db.client.create({
    data: {
      name: validated.data.name,
      email: validated.data.email,
      company: validated.data.company || null,
      phone: validated.data.phone || null,
      userId: session.user.id,
    },
  })

  revalidatePath("/dashboard/clients")
  return { success: true }
}

export async function deleteClient(clientId: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  await db.client.delete({
    where: { id: clientId, userId: session.user.id },
  })

  revalidatePath("/dashboard/clients")
}