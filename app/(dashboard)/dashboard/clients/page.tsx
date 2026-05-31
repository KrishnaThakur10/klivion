import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { ClientsClient } from "@/components/clients-client"

export default async function ClientsPage() {
  const session = await auth()
  if (!session?.user?.id) return null

  // Fetch all clients for this user directly in Server Component
  const clients = await db.client.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Clients</h1>
          <p className="text-muted-foreground mt-1">
            Manage your clients here
          </p>
        </div>
      </div>
      <ClientsClient clients={clients} />
    </div>
  )
}