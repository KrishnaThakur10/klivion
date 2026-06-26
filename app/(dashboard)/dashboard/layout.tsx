import { Sidebar } from "@/components/sidebar"
import { MobileSidebar } from "@/components/mobile-sidebar"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { getMonthStart } from "@/lib/plans"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  const userId = session?.user?.id ?? ""
  const monthStart = getMonthStart()

  const [user, proposalsThisMonth, invoicesThisMonth, clientsTotal] =
    await Promise.all([
      db.user.findUnique({
        where: { id: userId },
        select: { plan: true },
      }),
      db.proposal.count({
        where: { userId, createdAt: { gte: monthStart } },
      }),
      db.invoice.count({
        where: { userId, createdAt: { gte: monthStart } },
      }),
      db.client.count({ where: { userId } }),
    ])

  const plan = user?.plan ?? "free"
  const counts = {
    proposals: proposalsThisMonth,
    invoices: invoicesThisMonth,
    clients: clientsTotal,
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--bg)" }}>
      <div className="hidden md:flex">
        <Sidebar
          userName={session?.user?.name ?? "User"}
          userEmail={session?.user?.email ?? ""}
          userImage={session?.user?.image ?? null}
          plan={plan}
          counts={counts}
        />
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="md:hidden">
          <MobileSidebar
            userName={session?.user?.name ?? "User"}
            userEmail={session?.user?.email ?? ""}
            userImage={session?.user?.image ?? null}
            plan={plan}
            counts={counts}
          />
        </div>
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}