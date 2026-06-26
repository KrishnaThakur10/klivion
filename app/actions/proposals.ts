"use server"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { getPlanLimits, getMonthStart } from "@/lib/plans"

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

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { plan: true },
  })

  if (!user) throw new Error("User not found")

  const limits = getPlanLimits(user.plan)

  // Count proposals created THIS month only
  const monthStart = getMonthStart()
  const proposalsThisMonth = await db.proposal.count({
    where: {
      userId: session.user.id,
      createdAt: { gte: monthStart },
    },
  })

  if (proposalsThisMonth >= limits.proposalsPerMonth) {
    return {
      error: user.plan === "free"
        ? `You've used all ${limits.proposalsPerMonth} proposals for this month. Upgrade to Pro for unlimited proposals.`
        : `You've reached the monthly proposal limit. Please contact support.`,
      limitReached: true,
    }
  }

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

  const existingProposal = await db.proposal.findFirst({
    where: { id: proposalId, userId: session.user.id },
    select: { id: true, token: true },
  })

  if (!existingProposal) {
    throw new Error("Proposal not found")
  }

  await db.proposal.update({
    where: { id: existingProposal.id },
    data: { status },
  })

  revalidatePath("/dashboard/proposals")
  return { token: existingProposal.token }
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