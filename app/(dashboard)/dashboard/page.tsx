import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { TrendingUp, FileText, Receipt, Users, Clock, Plus } from "lucide-react"
import Link from "next/link"

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.id) return null

  const userId = session.user.id

  // Fetch all data in parallel
  const [proposals, invoices, clients] = await Promise.all([
    db.proposal.findMany({ where: { userId } }),
    db.invoice.findMany({ where: { userId } }),
    db.client.findMany({ where: { userId } }),
  ])

  // Calculate stats
  const totalEarned = invoices
    .filter((i) => i.status === "paid")
    .reduce((sum, i) => sum + i.total, 0)

  const totalOutstanding = invoices
    .filter((i) => i.status === "sent")
    .reduce((sum, i) => sum + i.total, 0)

  const overdueInvoices = invoices.filter(
    (i) => i.status === "sent" && new Date(i.dueDate) < new Date()
  )

  const proposalsSent = proposals.filter((p) => p.status !== "draft").length
  const proposalsSigned = proposals.filter((p) => p.status === "signed").length
  const winRate = proposalsSent > 0
    ? Math.round((proposalsSigned / proposalsSent) * 100)
    : 0

  // Recent activity — last 5 items combined
  const recentProposals = proposals
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3)
    .map((p) => ({
      text: `Proposal "${p.title}" — ${p.status}`,
      time: new Date(p.createdAt).toLocaleDateString("en-IN"),
      type: "proposal",
    }))

  const recentInvoices = invoices
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3)
    .map((i) => ({
      text: `Invoice ${i.number} — ₹${i.total.toLocaleString("en-IN")} — ${i.status}`,
      time: new Date(i.createdAt).toLocaleDateString("en-IN"),
      type: "invoice",
    }))

  const recentActivity = [...recentProposals, ...recentInvoices]
    .sort((a, b) => (a.time > b.time ? -1 : 1))
    .slice(0, 5)

  const stats = [
    {
      label: "Total Earned",
      value: `₹${totalEarned.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`,
      sub: `₹${totalOutstanding.toLocaleString("en-IN")} outstanding`,
      icon: TrendingUp,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Proposals Sent",
      value: proposalsSent.toString(),
      sub: `${proposalsSigned} signed · ${winRate}% win rate`,
      icon: FileText,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Invoices Out",
      value: `₹${totalOutstanding.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`,
      sub: `${overdueInvoices.length} overdue`,
      icon: Receipt,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      label: "Active Clients",
      value: clients.length.toString(),
      sub: `${clients.length} total clients`,
      icon: Users,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ]

  const hour = new Date().getHours()
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening"

  return (
    <div className="max-w-6xl mx-auto">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">
          {greeting}, {session.user.name?.split(" ")[0]} 👋
        </h1>
        <p className="text-muted-foreground mt-1">
          Here's what's happening with your business today.
        </p>
      </div>

      {/* Stats Grid */}
{/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.label}
              className="bg-card border border-border rounded-xl p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} strokeWidth={1.5} />
                </div>
                <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-full">
                  {stat.label}
                </span>
              </div>
              <div
                className="text-2xl font-semibold mb-1"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {stat.value}
              </div>
              <div className="text-xs text-muted-foreground">{stat.sub}</div>
            </div>
          )
        })}
      </div>

      {/* Two column section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Recent Activity */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            Recent Activity
          </h2>
          {recentActivity.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No activity yet — create your first proposal!
            </p>
          ) : (
            <div className="space-y-3">
              {recentActivity.map((item, i) => (
                <div key={i} className="flex items-start gap-3 text-sm">
                  <div className={`w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 ${
                    item.type === "proposal" ? "bg-blue-500" : "bg-orange-500"
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-foreground truncate">{item.text}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <Plus className="w-4 h-4 text-muted-foreground" />
            Quick Actions
          </h2>
          <div className="space-y-2">
            <Link
              href="/dashboard/proposals"
              className="w-full flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-accent transition-colors text-sm font-medium"
            >
              <FileText className="w-4 h-4 text-blue-600" />
              Create New Proposal
            </Link>
            <Link
              href="/dashboard/invoices"
              className="w-full flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-accent transition-colors text-sm font-medium"
            >
              <Receipt className="w-4 h-4 text-orange-600" />
              Create New Invoice
            </Link>
            <Link
              href="/dashboard/clients"
              className="w-full flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-accent transition-colors text-sm font-medium"
            >
              <Users className="w-4 h-4 text-purple-600" />
              Add New Client
            </Link>
          </div>

          {/* Summary */}
          {invoices.length > 0 && (
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wide">
                This month
              </p>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">
                    {proposals.filter(p => {
                      const d = new Date(p.createdAt)
                      const now = new Date()
                      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
                    }).length}
                  </div>
                  <div className="text-xs text-muted-foreground">Proposals</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-orange-600">
                    {invoices.filter(i => {
                      const d = new Date(i.createdAt)
                      const now = new Date()
                      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
                    }).length}
                  </div>
                  <div className="text-xs text-muted-foreground">Invoices</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">{winRate}%</div>
                  <div className="text-xs text-muted-foreground">Win Rate</div>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}