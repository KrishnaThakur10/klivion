"use server"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { getPlanLimits } from "@/lib/plans"

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

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: {
      plan: true,
      _count: { select: { clients: true } },
    },
  })

  if (!user) throw new Error("User not found")

  const limits = getPlanLimits(user.plan)

  // Clients = total limit, not monthly
  if (user._count.clients >= limits.clientsTotal) {
    return {
      error: user.plan === "free"
        ? `You've reached the limit of ${limits.clientsTotal} clients on the free plan. Upgrade to Pro for unlimited clients.`
        : `You've reached the client limit. Please contact support.`,
      limitReached: true,
    }
  }     

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