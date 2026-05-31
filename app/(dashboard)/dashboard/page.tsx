import { TrendingUp, FileText, Receipt, Users, Clock } from "lucide-react"

// These are hardcoded for now — later we'll replace with real DB data
const stats = [
  {
    label: "Total Earned",
    value: "$0.00",
    sub: "All time revenue",
    icon: TrendingUp,
    color: "text-green-600",
    bg: "bg-green-50",
  },
  {
    label: "Proposals Sent",
    value: "0",
    sub: "0 awaiting response",
    icon: FileText,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    label: "Invoices Out",
    value: "$0.00",
    sub: "0 unpaid invoices",
    icon: Receipt,
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
  {
    label: "Active Clients",
    value: "0",
    sub: "clients total",
    icon: Users,
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
]

const recentActivity = [
  { text: "No activity yet — create your first proposal!", time: "now" },
]

export default function DashboardPage() {
  return (
    <div className="max-w-6xl mx-auto">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Good morning 👋</h1>
        <p className="text-muted-foreground mt-1">
          Here's what's happening with your business today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.label}
              className="bg-card border border-border rounded-xl p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-muted-foreground font-medium">
                  {stat.label}
                </span>
                <div className={`w-9 h-9 rounded-lg ${stat.bg} flex items-center justify-center`}>
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                </div>
              </div>
              <div className="text-2xl font-bold mb-1">{stat.value}</div>
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
          <div className="space-y-3">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex items-start gap-3 text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-muted-foreground">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <button className="w-full flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-accent transition-colors text-sm font-medium">
              <FileText className="w-4 h-4 text-blue-600" />
              Create New Proposal
            </button>
            <button className="w-full flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-accent transition-colors text-sm font-medium">
              <Receipt className="w-4 h-4 text-orange-600" />
              Create New Invoice
            </button>
            <button className="w-full flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-accent transition-colors text-sm font-medium">
              <Users className="w-4 h-4 text-purple-600" />
              Add New Client
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}