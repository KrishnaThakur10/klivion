import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { InvoicesPage } from "@/components/invoices-page"

export default async function Page() {
  const session = await auth()
  if (!session?.user?.id) return null

  const [invoices, clients, settings] = await Promise.all([
    db.invoice.findMany({
      where: { userId: session.user.id },
      include: { client: true, lineItems: true },
      orderBy: { createdAt: "desc" },
    }),
    db.client.findMany({
      where: { userId: session.user.id },
      orderBy: { name: "asc" },
    }),
    db.userSettings.findUnique({
      where: { userId: session.user.id },
      select: {
        paymentProvider: true,
        razorpayKeyId: true,
        cashfreeAppId: true,
      },
    }),
  ])

  // Determine if the freelancer has a payment provider connected
  const hasPaymentProvider =
    (settings?.paymentProvider === "cashfree" && !!settings?.cashfreeAppId) ||
    (settings?.paymentProvider !== "cashfree" && !!settings?.razorpayKeyId) ||
    (!!settings?.razorpayKeyId || !!settings?.cashfreeAppId)

  return (
    <InvoicesPage
      invoices={invoices.map(inv => ({
        id: inv.id,
        number: inv.number,
        status: inv.status,
        dueDate: inv.dueDate.toISOString(),
        total: inv.total,
        clientName: inv.client?.name ?? null,
        clientPhone: inv.client?.phone ?? null,
        lineItems: inv.lineItems.map(li => ({
          id: li.id,
          description: li.description,
          quantity: li.quantity,
          rate: li.rate,
        })),
      }))}
      clients={clients.map(c => ({ id: c.id, name: c.name }))}
      paymentProvider={settings?.paymentProvider ?? "razorpay"}
      hasPaymentProvider={hasPaymentProvider}
    />
  )
}