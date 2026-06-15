import { db } from "@/lib/db"
import { notFound } from "next/navigation"
import { PayNowButton } from "@/components/pay-now-button"
import {
  Sparkles, CheckCircle2, Clock,
  AlertCircle, Receipt
} from "lucide-react"

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
  const isPaid = invoice.status === "paid"
  const isOverdue = invoice.status === "sent" && new Date(invoice.dueDate) < new Date()

  const statusKey = isPaid ? "paid" : isOverdue ? "overdue" : invoice.status
  const statusMap: Record<string, { label: string; color: string; bg: string; icon: React.ElementType }> = {
    draft:   { label: "Draft",   color: "#6e6e73", bg: "rgba(255,255,255,0.06)", icon: AlertCircle },
    sent:    { label: "Sent",    color: "#a1a1a6", bg: "rgba(255,255,255,0.08)", icon: Clock },
    paid:    { label: "Paid",    color: "#30d158", bg: "rgba(48,209,88,0.14)",   icon: CheckCircle2 },
    overdue: { label: "Overdue", color: "#ff453a", bg: "rgba(255,69,58,0.14)",   icon: AlertCircle },
  }
  const sc = statusMap[statusKey] ?? statusMap.sent
  const StatusIcon = sc.icon

  return (
    <div
      className="min-h-screen"
      style={{
        background: "var(--bg)",
        color: "var(--text)",
        fontFamily: "var(--font-ui)",
      }}
    >
      {/* Nav */}
      <nav
        className="sticky top-0 z-10 backdrop-blur-xl"
        style={{
          background: "rgba(10,10,12,0.8)",
          borderBottom: "0.5px solid var(--hairline)",
        }}
      >
        <div className="max-w-3xl mx-auto px-5 md:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: "#ffffff", boxShadow: "var(--shadow-primary)" }}
            >
              <Sparkles className="w-3.5 h-3.5" style={{ color: "#0a0a0c" }} strokeWidth={2.5} />
            </div>
            <span className="text-[14px] font-semibold tracking-tight">Klivio</span>
          </div>

          <span
            className="flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-md"
            style={{
              background: sc.bg,
              color: sc.color,
              border: `0.5px solid ${sc.color}33`,
              fontFamily: "var(--font-mono)",
            }}
          >
            <StatusIcon className="w-3 h-3" />
            {sc.label}
          </span>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-5 md:px-8 py-10 space-y-4">

        {/* Invoice header card */}
        <div
          className="rounded-2xl p-6 md:p-8"
          style={{
            background: "var(--bg-grid)",
            border: "0.5px solid var(--hairline)",
            boxShadow: "var(--shadow-panel)",
          }}
        >
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: "var(--inset-fill)", border: "0.5px solid var(--hairline)" }}
                >
                  <Receipt className="w-4 h-4" style={{ color: "var(--text-3)" }} strokeWidth={1.5} />
                </div>
                <h1
                  className="text-[22px] md:text-[26px] font-bold tracking-tight"
                  style={{ color: "var(--text)", letterSpacing: "-0.02em", fontFamily: "var(--font-mono)" }}
                >
                  {invoice.number}
                </h1>
              </div>
              <p className="text-[13px]" style={{ color: "var(--text-3)" }}>
                Issued by{" "}
                <span className="font-medium" style={{ color: "var(--text-2)" }}>
                  {invoice.user.name}
                </span>
              </p>
              {invoice.client && (
                <p className="text-[13px]" style={{ color: "var(--text-3)" }}>
                  Billed to{" "}
                  <span className="font-medium" style={{ color: "var(--text-2)" }}>
                    {invoice.client.name}
                  </span>
                </p>
              )}
            </div>
            <div className="text-right shrink-0">
              <p
                className="text-[10px] font-semibold uppercase tracking-wider mb-1"
                style={{ color: "var(--text-3)", fontFamily: "var(--font-mono)" }}
              >
                Due Date
              </p>
              <p
                className="text-[14px] font-semibold"
                style={{ color: isOverdue ? "var(--status-error)" : "var(--text)" }}
              >
                {new Date(invoice.dueDate).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* Line items table */}
          <div
            className="rounded-xl overflow-hidden mb-5"
            style={{ border: "0.5px solid var(--hairline)" }}
          >
            {/* Table header */}
            <div
              className="grid px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider"
              style={{
                gridTemplateColumns: "1fr 60px 100px 100px",
                background: "var(--inset-fill)",
                color: "var(--text-3)",
                fontFamily: "var(--font-mono)",
                borderBottom: "0.5px solid var(--hairline)",
              }}
            >
              <span>Description</span>
              <span className="text-right">Qty</span>
              <span className="text-right">Rate</span>
              <span className="text-right">Amount</span>
            </div>

            {invoice.lineItems.map((item, i) => (
              <div
                key={item.id}
                className="grid items-center px-4 py-3"
                style={{
                  gridTemplateColumns: "1fr 60px 100px 100px",
                  borderBottom:
                    i < invoice.lineItems.length - 1
                      ? "0.5px solid rgba(255,255,255,0.04)"
                      : "none",
                }}
              >
                <span className="text-[13px]" style={{ color: "var(--text)" }}>
                  {item.description}
                </span>
                <span className="text-[12px] text-right" style={{ color: "var(--text-2)" }}>
                  {item.quantity}
                </span>
                <span className="text-[12px] text-right" style={{ color: "var(--text-2)" }}>
                  ₹{item.rate.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </span>
                <span
                  className="text-[13px] font-medium text-right"
                  style={{ color: "var(--text)" }}
                >
                  ₹{(item.quantity * item.rate).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </span>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-60 space-y-2">
              <div className="flex justify-between text-[13px]">
                <span style={{ color: "var(--text-3)" }}>Subtotal</span>
                <span style={{ color: "var(--text-2)" }}>
                  ₹{subtotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </span>
              </div>
              {tax > 0 && (
                <div className="flex justify-between text-[13px]">
                  <span style={{ color: "var(--text-3)" }}>Tax</span>
                  <span style={{ color: "var(--text-2)" }}>
                    ₹{tax.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              )}
              <div
                className="flex justify-between items-center pt-2"
                style={{ borderTop: "0.5px solid var(--hairline)" }}
              >
                <span className="text-[14px] font-semibold" style={{ color: "var(--text)" }}>
                  Total Due
                </span>
                <span
                  className="text-[20px] font-bold"
                  style={{ color: "var(--text)", letterSpacing: "-0.02em" }}
                >
                  ₹{invoice.total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Pay / Paid section */}
        {isPaid ? (
          <div
            className="rounded-2xl p-8 text-center"
            style={{
              background: "var(--status-success-bg)",
              border: "0.5px solid rgba(48,209,88,0.25)",
            }}
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: "rgba(48,209,88,0.2)" }}
            >
              <CheckCircle2 className="w-7 h-7" style={{ color: "var(--status-success)" }} />
            </div>
            <h2
              className="text-[18px] font-semibold mb-1"
              style={{ color: "var(--status-success)" }}
            >
              Invoice Paid
            </h2>
            <p className="text-[13px]" style={{ color: "rgba(48,209,88,0.7)" }}>
              Thank you for your payment!
            </p>
          </div>
        ) : (
          <div
            className="rounded-2xl p-6 md:p-8 text-center"
            style={{
              background: "var(--bg-grid)",
              border: "0.5px solid var(--hairline-strong)",
              boxShadow: "var(--shadow-panel)",
            }}
          >
            <h2
              className="text-[16px] font-semibold mb-1"
              style={{ color: "var(--text)" }}
            >
              Pay This Invoice
            </h2>
            <p className="text-[13px] mb-6" style={{ color: "var(--text-3)" }}>
              Total amount due:{" "}
              <span className="font-bold text-[15px]" style={{ color: "var(--text)" }}>
                ₹{invoice.total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </span>
            </p>
            <PayNowButton
              invoiceId={invoice.id}
              amount={invoice.total}
              invoiceNumber={invoice.number}
            />
            <p className="text-[11px] mt-4" style={{ color: "var(--text-3)" }}>
              🔒 Secured by Razorpay · UPI, Cards, Net Banking accepted
            </p>
          </div>
        )}

        {/* Footer */}
        <p
          className="text-center text-[11px] pb-6"
          style={{ color: "var(--text-3)", fontFamily: "var(--font-mono)" }}
        >
          Powered by Klivio · Secure proposal & payment platform
        </p>
      </div>
    </div>
  )
}