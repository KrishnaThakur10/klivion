import { Sidebar } from "@/components/sidebar"
import { auth } from "@/lib/auth"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar
        userName={session?.user?.name ?? "User"}
        userEmail={session?.user?.email ?? ""}
        userImage={session?.user?.image ?? null}
      />
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  )
}