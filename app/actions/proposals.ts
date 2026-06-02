"use server"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const ProposalSchema = z.object({
  title: z.string().min(1, "Title is required"),
  clientId: z.string().optional(),
  content: z.string().min(1, "Content is required"),
})

export async function createProposal(data: {
  title: string
  clientId?: string
  content: string
}) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const validated = ProposalSchema.safeParse(data)
  if (!validated.success) {
    return { error: validated.error.issues[0].message }
  }

  const proposal = await db.proposal.create({
    data: {
      title: validated.data.title,
      content: validated.data.content,
      clientId: validated.data.clientId || null,
      userId: session.user.id,
    },
  })

  revalidatePath("/dashboard/proposals")
  return { success: true, id: proposal.id }
}

export async function updateProposalStatus(
  proposalId: string,
  status: string
) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const proposal = await db.proposal.update({
    where: { id: proposalId, userId: session.user.id },
    data: { status },
  })

  revalidatePath("/dashboard/proposals")
  return { token: proposal.token }
}

export async function deleteProposal(proposalId: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  await db.proposal.deleteMany({
    where: { id: proposalId, userId: session.user.id },
  })

  revalidatePath("/dashboard/proposals")
}

export async function approveProposal(proposalId: string, signerName: string) {
  await db.proposal.update({
    where: { id: proposalId },
    data: { status: "signed" },
  })
  revalidatePath("/dashboard/proposals")
}