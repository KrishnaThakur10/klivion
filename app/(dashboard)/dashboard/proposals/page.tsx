import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { ProposalsClient } from "@/components/proposals-client"

export default async function ProposalsPage() {
  const session = await auth()
  if (!session?.user?.id) return null

  const [proposals, clients] = await Promise.all([
    db.proposal.findMany({
      where: { userId: session.user.id },
      include: { client: true },
      orderBy: { createdAt: "desc" },
    }),
    db.client.findMany({
      where: { userId: session.user.id },
      orderBy: { name: "asc" },
    }),
  ])

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Proposals</h1>
        <p className="text-muted-foreground mt-1">
          Create and manage your client proposals
        </p>
      </div>
      <ProposalsClient proposals={proposals} clients={clients} />
    </div>
  )
}