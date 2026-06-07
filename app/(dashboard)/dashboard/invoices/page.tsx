import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { InvoicesClient } from "@/components/invoices-client"

export default async function InvoicesPage() {
  const session = await auth()
  if (!session?.user?.id) return null

  const [invoices, clients] = await Promise.all([
    db.invoice.findMany({
      where: { userId: session.user.id },
      include: { client: true, lineItems: true },
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
        <h1 className="text-2xl font-bold">Invoices</h1>
        <p className="text-muted-foreground mt-1">
          Create and track your invoices
        </p>
      </div>
      <InvoicesClient invoices={invoices} clients={clients} />
    </div>
  )
}