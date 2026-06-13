import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { ClientsPage } from "@/components/clients-page"

export default async function Page() {
  const session = await auth()
  if (!session?.user?.id) return null

  const clients = await db.client.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  })

  return (
    <ClientsPage
      clients={clients.map(c => ({
        id: c.id,
        name: c.name,
        email: c.email,
        company: c.company,
        phone: c.phone,
      }))}
    />
  )
}