import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { ProposalsPage } from "@/components/proposals-page"

export default async function Page() {
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
    <ProposalsPage
      proposals={proposals.map(p => ({
        id: p.id,
        title: p.title,
        status: p.status,
        token: p.token,
        createdAt: p.createdAt.toISOString(),
        clientName: p.client?.name ?? null,
      }))}
      clients={clients.map(c => ({ id: c.id, name: c.name }))}
    />
  )
}