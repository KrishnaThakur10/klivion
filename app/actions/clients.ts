"use server"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { z } from "zod"

// Validation schema
const ClientSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  company: z.string().optional(),
  phone: z.string().optional(),
})

export async function createClient(formData: FormData) {
  // 1. Check user is logged in
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  // 2. Validate the input
  const validated = ClientSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    company: formData.get("company"),
    phone: formData.get("phone"),
  })

  if (!validated.success) {
    return { error: validated.error.issues[0].message }
  }

  // 3. Save to database
  await db.client.create({
    data: {
      ...validated.data,
      userId: session.user.id,
    },
  })

  // 4. Refresh the clients page
  revalidatePath("/dashboard/clients")
  return { success: true }
}

export async function deleteClient(clientId: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  // Make sure this client belongs to this user
  await db.client.deleteMany({
    where: { id: clientId, userId: session.user.id },
  })

  revalidatePath("/dashboard/clients")
}