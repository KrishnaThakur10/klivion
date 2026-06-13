import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

// Magic card — needs client for mouse tracking
import { DashboardContent } from "@/components/dashboard-content"

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.id) return null
  const userId = session.user.id

  const [proposals, invoices, clients] = await Promise.all([
    db.proposal.findMany({ where: { userId }, orderBy: { createdAt: "desc" } }),
    db.invoice.findMany({
      where: { userId },
      include: { client: true },
      orderBy: { createdAt: "desc" },
    }),
    db.client.findMany({ where: { userId } }),
  ])

  const totalEarned = invoices
    .filter(i => i.status === "paid")
    .reduce((s, i) => s + i.total, 0)
  const totalOutstanding = invoices
    .filter(i => i.status === "sent")
    .reduce((s, i) => s + i.total, 0)
  const overdueCount = invoices.filter(
    i => i.status === "sent" && new Date(i.dueDate) < new Date()
  ).length
  const proposalsSent = proposals.filter(p => p.status !== "draft").length
  const proposalsSigned = proposals.filter(p => p.status === "signed").length
  const winRate =
    proposalsSent > 0 ? Math.round((proposalsSigned / proposalsSent) * 100) : 0

  const hour = new Date().getHours()
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening"
  const firstName = session.user.name?.split(" ")[0] ?? "there"

  const stats = [
    {
      label: "Total Earned",
      value: `₹${totalEarned.toLocaleString("en-IN")}`,
      sub: totalOutstanding > 0
        ? `₹${totalOutstanding.toLocaleString("en-IN")} pending`
        : "All cleared",
      dot: "var(--status-success)",
      icon: "TrendingUp",
    },
    {
      label: "Proposals",
      value: proposalsSent.toString(),
      sub: proposalsSent > 0 ? `${winRate}% win rate` : "None sent yet",
      dot: "rgba(255,255,255,0.3)",
      icon: "FileText",
    },
    {
      label: "Outstanding",
      value: `₹${totalOutstanding.toLocaleString("en-IN")}`,
      sub: overdueCount > 0 ? `${overdueCount} overdue` : "No overdue",
      dot: overdueCount > 0 ? "var(--status-error)" : "rgba(255,255,255,0.15)",
      icon: "Receipt",
    },
    {
      label: "Clients",
      value: clients.length.toString(),
      sub: `${invoices.filter(i => i.status === "paid").length} paid invoices`,
      dot: "rgba(255,255,255,0.2)",
      icon: "Users",
    },
  ]

  return (
    <DashboardContent
      greeting={greeting}
      firstName={firstName}
      stats={stats}
      invoices={invoices.slice(0, 6).map(inv => ({
        id: inv.id,
        number: inv.number,
        status: inv.status,
        dueDate: inv.dueDate.toISOString(),
        total: inv.total,
        clientName: inv.client?.name ?? null,
      }))}
      proposals={proposals.slice(0, 5).map(p => ({
        id: p.id,
        title: p.title,
        status: p.status,
      }))}
    />
  )
}