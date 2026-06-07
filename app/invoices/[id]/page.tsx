import { db } from "@/lib/db"
import { notFound } from "next/navigation"
import {  PayNowButton } from "@/components/pay-now-button"

export default async function PublicInvoicePage(props: {
  params: Promise<{ id: string }>
}) {
  const { id } = await props.params

  const invoice = await db.invoice.findFirst({
    where: { id },
    include: { client: true, user: true, lineItems: true },
  })

  if (!invoice) notFound()

  const subtotal = invoice.lineItems.reduce(
    (sum, item) => sum + item.quantity * item.rate, 0
  )
  const tax = invoice.total - subtotal

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-border">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground text-xs font-bold">P</span>
            </div>
            <span className="font-semibold">Proposely</span>
          </div>
          <span className={`text-xs px-3 py-1 rounded-full font-medium ${
            invoice.status === "paid" ? "bg-green-100 text-green-700"
            : invoice.status === "overdue" ? "bg-red-100 text-red-700"
            : "bg-blue-100 text-blue-700"
          }`}>
            {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
          </span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Invoice Header */}
        <div className="bg-white border border-border rounded-2xl p-8 mb-6 shadow-sm">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold mb-1">{invoice.number}</h1>
              <p className="text-sm text-muted-foreground">
                Issued by <strong className="text-foreground">{invoice.user.name}</strong>
              </p>
              {invoice.client && (
                <p className="text-sm text-muted-foreground mt-0.5">
                  Billed to <strong className="text-foreground">{invoice.client.name}</strong>
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Due Date</p>
              <p className="font-semibold">
                {new Date(invoice.dueDate).toLocaleDateString("en-IN", {
                  day: "numeric", month: "long", year: "numeric"
                })}
              </p>
            </div>
          </div>

          {/* Line Items Table */}
          <table className="w-full mb-6">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs text-muted-foreground font-medium pb-2">Description</th>
                <th className="text-right text-xs text-muted-foreground font-medium pb-2">Qty</th>
                <th className="text-right text-xs text-muted-foreground font-medium pb-2">Rate</th>
                <th className="text-right text-xs text-muted-foreground font-medium pb-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.lineItems.map((item) => (
                <tr key={item.id} className="border-b border-border/50">
                  <td className="py-3 text-sm">{item.description}</td>
                  <td className="py-3 text-sm text-right">{item.quantity}</td>
                  <td className="py-3 text-sm text-right">
                    ₹{item.rate.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 text-sm text-right font-medium">
                    ₹{(item.quantity * item.rate).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-56 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>₹{subtotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
              </div>
              {tax > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span>₹{tax.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg border-t border-border pt-2">
                <span>Total Due</span>
                <span>₹{invoice.total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pay Now / Paid */}
        {invoice.status === "paid" ? (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center shadow-sm">
            <div className="text-3xl mb-2">✅</div>
            <h2 className="font-semibold text-green-800 text-lg">Invoice Paid</h2>
            <p className="text-sm text-green-700 mt-1">Thank you for your payment!</p>
          </div>
        ) : (
          <div className="bg-white border border-border rounded-2xl p-8 shadow-sm text-center">
            <h2 className="font-semibold text-lg mb-1">Pay This Invoice</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Total amount due: <strong className="text-foreground text-base">
                ₹{invoice.total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </strong>
            </p>
            <div className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium opacity-60 cursor-not-allowed">
              <PayNowButton
                invoiceId={invoice.id}
                amount={invoice.total}
                invoiceNumber={invoice.number}
                />
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Online payment coming soon. Please contact the sender for payment details.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}