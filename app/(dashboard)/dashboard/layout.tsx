import { Sidebar } from "@/components/sidebar"
import { MobileSidebar } from "@/components/mobile-sidebar"
import { auth } from "@/lib/auth"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  return (
    <div className="flex h-screen" style={{ background: "var(--bg)" }}>
      {/* Desktop sidebar */}
      <div className="hidden md:flex">
        <Sidebar
          userName={session?.user?.name ?? "User"}
          userEmail={session?.user?.email ?? ""}
          userImage={session?.user?.image ?? null}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Mobile top bar */}
        <div className="md:hidden">
          <MobileSidebar
            userName={session?.user?.name ?? "User"}
            userEmail={session?.user?.email ?? ""}
            userImage={session?.user?.image ?? null}
          />
        </div>

        <main className="flex-1 overflow-y-auto min-h-0">
          {children}
        </main>
      </div>
    </div>
  )
}