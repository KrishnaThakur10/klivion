"use server"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const SettingsSchema = z.object({
  businessName: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  website: z.string().optional(),
  paymentProvider: z.enum(["razorpay", "cashfree"]).optional(),
  razorpayKeyId: z.string().optional(),
  razorpaySecret: z.string().optional(),
  cashfreeAppId: z.string().optional(),
  cashfreeSecretKey: z.string().optional(),
})

export async function updateSettings(data: {
  businessName?: string
  phone?: string
  address?: string
  website?: string
  paymentProvider?: string
  razorpayKeyId?: string
  razorpaySecret?: string
  cashfreeAppId?: string
  cashfreeSecretKey?: string
}) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const validated = SettingsSchema.safeParse(data)
  if (!validated.success) {
    return { error: validated.error.issues[0].message }
  }

  await db.userSettings.upsert({
    where: { userId: session.user.id },
    create: {
      userId: session.user.id,
      ...validated.data,
    },
    update: validated.data,
  })

  revalidatePath("/dashboard/settings")
  return { success: true }
}