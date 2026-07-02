"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import {
  createInvoice,
  deleteInvoice,
  updateInvoiceStatus,
} from "@/app/actions/invoices"
import {
  Plus, ArrowLeft, Trash2, Send,
  CheckCircle2, Clock, AlertCircle,
  Receipt, Copy, Check, ExternalLink,
  MoreHorizontal, Link as LinkIcon, X,
  Download
} from "lucide-react"
import { DatePicker } from "@/components/date-picker"
import { UpgradeModal } from "@/components/upgrade-modal"

type Client = { id: string; name: string }
type LineItem = { id: string; description: string; quantity: number; rate: number }
type Invoice = {
  id: string
  number: string
  status: string
  dueDate: string
  total: number
  clientName: string | null
  clientPhone: string | null
  lineItems: LineItem[]
}

type NewLineItem = { description: string; quantity: string; rate: string }

const statusConfig: Record<string, {
  label: string; color: string; bg: string; icon: React.ElementType
}> = {
  draft:   { label: "Draft",   color: "#6e6e73", bg: "rgba(255,255,255,0.06)", icon: AlertCircle },
  sent:    { label: "Sent",    color: "#a1a1a6", bg: "rgba(255,255,255,0.08)", icon: Clock },
  paid:    { label: "Paid",    color: "#30d158", bg: "rgba(48,209,88,0.14)",   icon: CheckCircle2 },
  overdue: { label: "Overdue", color: "#ff453a", bg: "rgba(255,69,58,0.14)",   icon: AlertCircle },
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  function copy() {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button
      onClick={copy}
      className="flex items-center gap-1.5 w-full px-3 py-2 rounded-lg text-[13px] transition-colors hover:bg-[rgba(255,255,255,0.06)]"
      style={{ color: "var(--text-2)" }}
    >
      {copied
        ? <Check className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--status-success)" }} />
        : <Copy className="w-3.5 h-3.5 shrink-0" />}
      {copied ? "Copied!" : "Copy link"}
    </button>
  )
}

function InvoiceMenu({
  invoice,
  onSend,
  onMarkPaid,
  onCopyLink,
  onDelete,
  isPending,
}: {
  invoice: Invoice
  onSend: () => void
  onMarkPaid: () => void
  onCopyLink: () => void
  onDelete: () => void
  isPending: boolean
}) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(!open) }}
        className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors"
        style={{
          color: open ? "var(--text)" : "var(--text-3)",
          background: open ? "rgba(255,255,255,0.08)" : "transparent",
        }}
        onMouseEnter={e => { if (!open) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)" }}
        onMouseLeave={e => { if (!open) (e.currentTarget as HTMLElement).style.background = "transparent" }}
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div
            className="absolute right-0 top-8 z-20 w-44 rounded-xl py-1 overflow-hidden"
            style={{ background: "var(--bg-grid)", border: "0.5px solid var(--hairline-strong)", boxShadow: "var(--shadow-panel)" }}
          >
            {invoice.status === "draft" && (
              <button
                onClick={() => { onSend(); setOpen(false) }}
                disabled={isPending}
                className="flex items-center gap-2.5 w-full px-3 py-2 text-[13px] transition-colors hover:bg-[rgba(255,255,255,0.06)]"
                style={{ color: "var(--text-2)" }}
              >
                <Send className="w-3.5 h-3.5 shrink-0" />
                Send to client
              </button>
            )}
            {(invoice.status === "sent" || invoice.status === "overdue") && (
              <>
                <button
                  onClick={() => { onCopyLink(); setOpen(false) }}
                  className="flex items-center gap-2.5 w-full px-3 py-2 text-[13px] transition-colors hover:bg-[rgba(255,255,255,0.06)]"
                  style={{ color: "var(--text-2)" }}
                >
                  <LinkIcon className="w-3.5 h-3.5 shrink-0" />
                  Copy link
                </button>
                <button
                  onClick={() => { onMarkPaid(); setOpen(false) }}
                  disabled={isPending}
                  className="flex items-center gap-2.5 w-full px-3 py-2 text-[13px] transition-colors hover:bg-[rgba(255,255,255,0.06)]"
                  style={{ color: "var(--status-success)" }}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  Mark as paid
                </button>
              </>
            )}
            {invoice.status === "paid" && (
              <button
                onClick={() => { onCopyLink(); setOpen(false) }}
                className="flex items-center gap-2.5 w-full px-3 py-2 text-[13px] transition-colors hover:bg-[rgba(255,255,255,0.06)]"
                style={{ color: "var(--text-2)" }}
              >
                <LinkIcon className="w-3.5 h-3.5 shrink-0" />
                Copy link
              </button>
            )}

            <button
              onClick={() => {
                window.open(`/invoices/${invoice.id}`, '_blank')
                setOpen(false)
              }}
              className="flex items-center gap-2.5 w-full px-3 py-2 text-[13px] transition-colors hover:bg-[rgba(255,255,255,0.06)]"
              style={{ color: "var(--text-2)" }}
            >
              <Download className="w-3.5 h-3.5 shrink-0" />
              View & Download
            </button>

            <div style={{ height: "0.5px", background: "var(--hairline)", margin: "4px 0" }} />

            <button
              onClick={() => { onDelete(); setOpen(false) }}
              disabled={isPending}
              className="flex items-center gap-2.5 w-full px-3 py-2 text-[13px] transition-colors hover:bg-[rgba(255,255,255,0.06)]"
              style={{ color: "var(--status-error)" }}
            >
              <Trash2 className="w-3.5 h-3.5 shrink-0" />
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export function InvoicesPage({
  invoices: initial,
  clients,
  hasPaymentProvider = false,
  paymentProvider = "razorpay",
}: {
  invoices: Invoice[]
  clients: Client[]
  hasPaymentProvider?: boolean
  paymentProvider?: string
}) {
  const router = useRouter()
  const [view, setView] = useState<"list" | "new">("list")
  // ── FIXED: use prop directly, no useState for the list ──
  const invoices = initial
  const [clientId, setClientId] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [taxRate, setTaxRate] = useState("0")
  const [lineItems, setLineItems] = useState<NewLineItem[]>([
    { description: "", quantity: "1", rate: "" }
  ])
  const [error, setError] = useState("")
  const [shareLink, setShareLink] = useState("")
  const [showShare, setShowShare] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [showUpgrade, setShowUpgrade] = useState(false)
  const [upgradeReason, setUpgradeReason] = useState("")
  const [preflightIssues, setPreflightIssues] = useState<string[]>([])
  const [showPreflight, setShowPreflight] = useState(false)

  const subtotal = lineItems.reduce((sum, item) =>
    sum + (parseFloat(item.quantity) || 0) * (parseFloat(item.rate) || 0), 0)
  const tax = subtotal * ((parseFloat(taxRate) || 0) / 100)
  const total = subtotal + tax

  function addLineItem() {
    setLineItems([...lineItems, { description: "", quantity: "1", rate: "" }])
  }
  function removeLineItem(index: number) {
    if (lineItems.length === 1) return
    setLineItems(lineItems.filter((_, i) => i !== index))
  }
  function updateLineItem(index: number, field: keyof NewLineItem, value: string) {
    const updated = [...lineItems]
    updated[index] = { ...updated[index], [field]: value }
    setLineItems(updated)
  }
  function resetForm() {
    setClientId("")
    setDueDate("")
    setTaxRate("0")
    setLineItems([{ description: "", quantity: "1", rate: "" }])
    setError("")
  }

  function handleCreate() {
    if (!dueDate) { setError("Due date is required"); return }
    if (lineItems.some(i => !i.description.trim())) { setError("All line items need a description"); return }
    setError("")
    startTransition(async () => {
      const result = await createInvoice({
        clientId: clientId || undefined,
        dueDate,
        taxRate: parseFloat(taxRate) || 0,
        lineItems: lineItems.map(item => ({
          description: item.description,
          quantity: parseFloat(item.quantity) || 0,
          rate: parseFloat(item.rate) || 0,
        })),
      })
      if (result?.limitReached) {
      setUpgradeReason(result.error ?? "")
      setShowUpgrade(true)
      return
      }
      if (result?.error) {
        setError(result.error)
      } else {
        resetForm()
        setView("list")
        router.refresh() // ── FIXED: re-fetches from DB → new invoice appears
      }
    })
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteInvoice(id)
      router.refresh() // ── FIXED: re-fetches → deleted invoice disappears
    })
  }

  function handleStatus(id: string, status: string) {
    // Pre-flight checks before sending — catch issues before the payer ever sees the invoice
    if (status === "sent") {
      const inv = invoices.find(i => i.id === id)
      const issues: string[] = []

      if (!hasPaymentProvider) {
        issues.push(
          paymentProvider === "cashfree"
            ? "Connect your Cashfree account in Settings → Payment Provider"
            : "Connect your Razorpay account in Settings → Payment Provider"
        )
      }

      if (!inv?.clientName) {
        issues.push("Assign a client to this invoice so the payer knows who to pay")
      }

      if (paymentProvider === "cashfree" && inv?.clientName && !inv?.clientPhone) {
        issues.push("Add a phone number to this client — Cashfree requires it to process payment")
      }

      if ((inv?.total ?? 0) <= 0) {
        issues.push("Add at least one line item with an amount greater than ₹0")
      }

      if (issues.length > 0) {
        setPreflightIssues(issues)
        setShowPreflight(true)
        return
      }
    }

    startTransition(async () => {
      await updateInvoiceStatus(id, status)
      router.refresh()
      if (status === "sent") {
        setShareLink(`${window.location.origin}/invoices/${id}`)
        setShowShare(true)
      }
    })
  }

  function handleCopyLink(id: string) {
    setShareLink(`${window.location.origin}/invoices/${id}`)
    setShowShare(true)
  }

  // ── NEW INVOICE VIEW ──
  if (view === "new") {
    return (
      <div className="flex flex-col min-h-full" style={{ background: "var(--bg)" }}>
        {showUpgrade && (
          <UpgradeModal
            reason={upgradeReason}
            onClose={() => setShowUpgrade(false)}
          />
        )}
        <header
          className="h-14 flex items-center justify-between px-4 md:px-8 shrink-0"
          style={{ borderBottom: "0.5px solid var(--hairline)" }}
        >
          <button
            onClick={() => { setView("list"); resetForm() }}
            className="flex items-center gap-2 text-[13px] font-medium transition-colors"
            style={{ color: "var(--text-3)", background: "none", border: "none", cursor: "pointer", padding: 0 }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "var(--text-2)")}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = "var(--text-3)")}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Invoices
          </button>
          <button onClick={handleCreate} disabled={isPending} className="btn-primary">
            {isPending ? "Creating..." : "Create Invoice"}
          </button>
        </header>

        <div className="flex-1 p-4 md:p-8 max-w-[760px] w-full mx-auto space-y-5">

          {error && (
            <p className="text-[12px] px-3 py-2 rounded-lg"
              style={{ color: "var(--status-error)", background: "var(--status-error-bg)", border: "0.5px solid var(--status-error)" }}>
              {error}
            </p>
          )}

          {/* Client + due date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block mb-1.5 text-[11px] font-semibold uppercase tracking-wider"
                style={{ color: "var(--text-3)", fontFamily: "var(--font-mono)" }}>
                Client
              </label>
              <select
                value={clientId}
                onChange={e => setClientId(e.target.value)}
                className="ui-input"
              >
                <option value="">Select a client (optional)</option>
                {clients.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-1.5 text-[11px] font-semibold uppercase tracking-wider"
                style={{ color: "var(--text-3)", fontFamily: "var(--font-mono)" }}>
                Due date *
              </label>
              <DatePicker
                value={dueDate}
                onChange={setDueDate}
                placeholder="Select due date"
              />
            </div>
          </div>

          {/* Line items */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[11px] font-semibold uppercase tracking-wider"
                style={{ color: "var(--text-3)", fontFamily: "var(--font-mono)" }}>
                Line items
              </label>
              <button onClick={addLineItem} className="btn-ghost text-[12px] py-1 px-2">
                <Plus className="w-3 h-3" /> Add item
              </button>
            </div>

            <div className="space-y-2">
              {lineItems.map((item, index) => (
                <div
                  key={index}
                  className="rounded-xl p-3"
                  style={{ background: "var(--bg-grid)", border: "0.5px solid var(--hairline)" }}
                >
                  <input
                    value={item.description}
                    onChange={e => updateLineItem(index, "description", e.target.value)}
                    placeholder="Description (e.g. Web design services)"
                    className="ui-input mb-2"
                  />
                  <div className="grid grid-cols-3 gap-2 items-end">
                    <div>
                      <label className="block mb-1 text-[10px] font-medium uppercase tracking-wider" style={{ color: "var(--text-3)" }}>Qty</label>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={e => updateLineItem(index, "quantity", e.target.value)}
                        min="0"
                        className="ui-input"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-[10px] font-medium uppercase tracking-wider" style={{ color: "var(--text-3)" }}>Rate (₹)</label>
                      <input
                        type="number"
                        value={item.rate}
                        onChange={e => updateLineItem(index, "rate", e.target.value)}
                        placeholder="0"
                        min="0"
                        className="ui-input"
                      />
                    </div>
                    <div className="flex items-center justify-between h-[34px]">
                      <span className="text-[13px] font-semibold" style={{ color: "var(--text)" }}>
                        ₹{((parseFloat(item.quantity) || 0) * (parseFloat(item.rate) || 0)).toLocaleString("en-IN")}
                      </span>
                      {lineItems.length > 1 && (
                        <button
                          onClick={() => removeLineItem(index)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors"
                          style={{ color: "var(--text-3)" }}
                          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "var(--status-error)")}
                          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = "var(--text-3)")}
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div
            className="rounded-xl p-4 space-y-2"
            style={{ background: "var(--bg-grid)", border: "0.5px solid var(--hairline)" }}
          >
            <div className="flex justify-between text-[13px]">
              <span style={{ color: "var(--text-3)" }}>Subtotal</span>
              <span style={{ color: "var(--text-2)" }}>₹{subtotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between items-center text-[13px]">
              <span style={{ color: "var(--text-3)" }}>Tax (%)</span>
              <input
                type="number"
                value={taxRate}
                onChange={e => setTaxRate(e.target.value)}
                min="0"
                max="100"
                className="ui-input w-20 text-right"
                style={{ padding: "4px 8px" }}
              />
            </div>
            {parseFloat(taxRate) > 0 && (
              <div className="flex justify-between text-[13px]">
                <span style={{ color: "var(--text-3)" }}>Tax amount</span>
                <span style={{ color: "var(--text-2)" }}>₹{tax.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
              </div>
            )}
            <div
              className="flex justify-between items-center pt-2"
              style={{ borderTop: "0.5px solid var(--hairline)" }}
            >
              <span className="text-[14px] font-semibold" style={{ color: "var(--text)" }}>Total</span>
              <span className="text-[18px] font-bold" style={{ color: "var(--text)" }}>
                ₹{total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── LIST VIEW ──
  const totalInvoiced = invoices.reduce((s, i) => s + i.total, 0)
  const totalPaid = invoices.filter(i => i.status === "paid").reduce((s, i) => s + i.total, 0)
  const totalPending = invoices.filter(i => i.status === "sent").reduce((s, i) => s + i.total, 0)
  const totalOverdue = invoices.filter(i =>
    i.status === "sent" && new Date(i.dueDate) < new Date()
  ).reduce((s, i) => s + i.total, 0)

  return (
    <div className="flex flex-col min-h-full" style={{ background: "var(--bg)" }}>
      
      {showUpgrade && (
        <UpgradeModal
          reason={upgradeReason}
          onClose={() => setShowUpgrade(false)}
        />
      )}

      {/* Pre-flight checklist modal — shown when invoice isn't ready to send */}
      {showPreflight && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
          onClick={() => setShowPreflight(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl overflow-hidden"
            style={{
              background: "var(--bg-grid)",
              border: "0.5px solid var(--hairline-strong)",
              boxShadow: "var(--shadow-panel)",
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div
              className="px-6 py-5 flex items-center gap-3"
              style={{ borderBottom: "0.5px solid var(--hairline)" }}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "rgba(255,159,10,0.14)" }}
              >
                <AlertCircle className="w-4 h-4" style={{ color: "var(--status-warning)" }} />
              </div>
              <div>
                <p className="text-[14px] font-semibold" style={{ color: "var(--text)" }}>
                  Invoice can't be sent yet
                </p>
                <p className="text-[12px] mt-0.5" style={{ color: "var(--text-3)" }}>
                  Fix these before your client receives the payment link
                </p>
              </div>
            </div>

            {/* Issues list */}
            <div className="px-6 py-5 space-y-3">
              {preflightIssues.map((issue, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 px-4 py-3 rounded-xl"
                  style={{ background: "var(--inset-fill)", border: "0.5px solid var(--hairline)" }}
                >
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: "rgba(255,159,10,0.14)" }}
                  >
                    <span className="text-[10px] font-bold" style={{ color: "var(--status-warning)" }}>
                      {i + 1}
                    </span>
                  </div>
                  <p className="text-[13px] leading-relaxed" style={{ color: "var(--text-2)" }}>
                    {issue}
                  </p>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div
              className="px-6 py-4 flex gap-2"
              style={{ borderTop: "0.5px solid var(--hairline)" }}
            >
              <a
                href="/dashboard/settings"
                className="btn-primary flex-1 justify-center text-[13px]"
                onClick={() => setShowPreflight(false)}
              >
                Go to Settings
              </a>
              <button
                onClick={() => setShowPreflight(false)}
                className="btn-ghost flex-1 justify-center text-[13px]"
              >
                Fix later
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share modal */}
      {showShare && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
          onClick={() => setShowShare(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl p-6"
            style={{ background: "var(--bg-grid)", boxShadow: "var(--shadow-panel)", border: "0.5px solid var(--hairline-strong)" }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "var(--status-success-bg)" }}>
                <Send className="w-4 h-4" style={{ color: "var(--status-success)" }} />
              </div>
              <div>
                <p className="text-[14px] font-semibold" style={{ color: "var(--text)" }}>
                  Invoice ready to send
                </p>
                <p className="text-[12px] mt-0.5" style={{ color: "var(--text-3)" }}>
                  Share this link with your client
                </p>
              </div>
            </div>

            <div
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg mb-3"
              style={{ background: "var(--input-bg)", border: "0.5px solid var(--hairline-strong)" }}
            >
              <span className="flex-1 text-[12px] truncate"
                style={{ color: "var(--text-2)", fontFamily: "var(--font-mono)" }}>
                {shareLink}
              </span>
            </div>

            <div className="mb-4">
              <CopyButton text={shareLink} />
            </div>

            <div className="flex gap-2">
              <a href={shareLink} target="_blank" rel="noopener noreferrer" className="btn-ghost flex-1 justify-center text-[12px]">
                <ExternalLink className="w-3.5 h-3.5" />
                Preview
              </a>
              <button onClick={() => setShowShare(false)} className="btn-primary flex-1 justify-center text-[12px]">
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header
        className="h-14 flex items-center justify-between px-4 md:px-8 shrink-0"
        style={{ borderBottom: "0.5px solid var(--hairline)" }}
      >
        <div className="flex items-center gap-2">
          <span className="text-[15px] font-semibold" style={{ color: "var(--text)" }}>Invoices</span>
          <span
            className="text-[11px] px-1.5 py-0.5 rounded-md"
            style={{ background: "var(--inset-fill)", color: "var(--text-3)", fontFamily: "var(--font-mono)", border: "0.5px solid var(--hairline)" }}
          >
            {invoices.length}
          </span>
        </div>
        <button onClick={() => setView("new")} className="btn-primary">
          <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
          <span className="hidden sm:inline">New Invoice</span>
          <span className="sm:hidden">New</span>
        </button>
      </header>

      <div className="flex-1 p-4 md:p-8 max-w-[1080px] w-full mx-auto overflow-x-hidden space-y-6">

        {/* Stats */}
        {invoices.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Total Invoiced", value: totalInvoiced, color: "var(--text)", dot: "rgba(255,255,255,0.3)", bg: "var(--bg-grid)" },
              { label: "Paid",           value: totalPaid,     color: "var(--status-success)", dot: "var(--status-success)", bg: "var(--bg-grid)" },
              { label: "Pending",        value: totalPending,  color: "var(--text-2)",         dot: "rgba(255,255,255,0.2)", bg: "var(--bg-grid)" },
              { label: "Overdue",        value: totalOverdue,  color: totalOverdue > 0 ? "var(--status-error)" : "var(--text-3)", dot: totalOverdue > 0 ? "var(--status-error)" : "rgba(255,255,255,0.12)", bg: "var(--bg-grid)" },
            ].map(stat => (
              <div
                key={stat.label}
                className="rounded-xl p-4 flex flex-col gap-2"
                style={{ background: stat.bg, border: "0.5px solid var(--hairline)", boxShadow: "var(--shadow-panel)" }}
              >
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.08em]"
                    style={{ color: "rgba(255,255,255,0.22)", fontFamily: "var(--font-mono)" }}>
                    {stat.label}
                  </p>
                  <div
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ background: stat.dot, boxShadow: `0 0 6px ${stat.dot}` }}
                  />
                </div>
                <p className="text-[20px] font-bold leading-none" style={{ color: stat.color, letterSpacing: "-0.03em" }}>
                  ₹{stat.value.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {invoices.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ background: "var(--inset-fill)", border: "0.5px solid var(--hairline)", boxShadow: "var(--shadow-panel)" }}>
              <Receipt className="w-6 h-6" style={{ color: "var(--text-3)" }} />
            </div>
            <div className="text-center">
              <p className="text-[15px] font-semibold" style={{ color: "var(--text)" }}>No invoices yet</p>
              <p className="text-[13px] mt-1" style={{ color: "var(--text-3)" }}>Create your first invoice to get started</p>
            </div>
            <button onClick={() => setView("new")} className="btn-primary">
              <Plus className="w-3.5 h-3.5" /> Create Invoice
            </button>
          </div>
        )}

        {/* List */}
        {invoices.length > 0 && (
          <div className="space-y-1">
            {/* Desktop header */}
            <div
              className="hidden md:grid items-center px-4 py-2.5"
              style={{
                gridTemplateColumns: "1fr 130px 100px 110px 120px 40px",
                borderBottom: "0.5px solid var(--hairline)",
                color: "var(--text-3)",
                fontFamily: "var(--font-mono)",
                fontSize: "10px",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              <span>Invoice</span>
              <span>Client</span>
              <span>Due</span>
              <span>Amount</span>
              <span>Status</span>
              <span />
            </div>

            {invoices.map((inv) => {
              const isOverdue = inv.status === "sent" && new Date(inv.dueDate) < new Date()
              const statusKey = isOverdue ? "overdue" : inv.status
              const sc = statusConfig[statusKey] ?? statusConfig.draft
              const StatusIcon = sc.icon

              return (
                <div key={inv.id}>
                  {/* Desktop row */}
                  <div
                    className="hidden md:grid items-center px-4 py-3 rounded-xl transition-all duration-150"
                    style={{ gridTemplateColumns: "1fr 130px 100px 110px 120px 40px", border: "0.5px solid transparent" }}
                    onMouseEnter={e => {
                      const el = e.currentTarget as HTMLElement
                      el.style.background = "var(--bg-grid)"
                      el.style.borderColor = "var(--hairline)"
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget as HTMLElement
                      el.style.background = "transparent"
                      el.style.borderColor = "transparent"
                    }}
                  >
                    <div className="flex items-center gap-3 min-w-0 pr-4">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                        style={{ background: "var(--inset-fill)", border: "0.5px solid var(--hairline)" }}>
                        <Receipt className="w-3.5 h-3.5" style={{ color: "var(--text-3)" }} strokeWidth={1.5} />
                      </div>
                      <span className="text-[13px] font-medium truncate" style={{ color: "var(--text)", fontFamily: "var(--font-mono)" }}>
                        {inv.number}
                      </span>
                    </div>
                    <span className="text-[12px] truncate" style={{ color: "var(--text-2)" }}>
                      {inv.clientName ?? <span style={{ color: "var(--text-3)" }}>—</span>}
                    </span>
                    <span className="text-[12px]" style={{ color: "var(--text-3)", fontFamily: "var(--font-mono)" }}>
                      {new Date(inv.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    </span>
                    <span className="text-[13px] font-semibold" style={{ color: "var(--text)" }}>
                      ₹{inv.total.toLocaleString("en-IN")}
                    </span>
                    <span
                      className="flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-medium w-fit"
                      style={{ background: sc.bg, color: sc.color, fontFamily: "var(--font-mono)", border: `0.5px solid ${sc.color}22` }}
                    >
                      <StatusIcon className="w-3 h-3" />
                      {sc.label}
                    </span>
                    <div className="flex justify-end">
                      <InvoiceMenu
                        invoice={inv}
                        onSend={() => handleStatus(inv.id, "sent")}
                        onMarkPaid={() => handleStatus(inv.id, "paid")}
                        onCopyLink={() => handleCopyLink(inv.id)}
                        onDelete={() => handleDelete(inv.id)}
                        isPending={isPending}
                      />
                    </div>
                  </div>

                  {/* Mobile card */}
                  <div
                    className="md:hidden rounded-xl p-4 mb-2"
                    style={{ background: "var(--bg-grid)", border: "0.5px solid var(--hairline)" }}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                          style={{ background: "var(--inset-fill)", border: "0.5px solid var(--hairline)" }}>
                          <Receipt className="w-3.5 h-3.5" style={{ color: "var(--text-3)" }} strokeWidth={1.5} />
                        </div>
                        <span className="text-[14px] font-medium truncate" style={{ color: "var(--text)", fontFamily: "var(--font-mono)" }}>
                          {inv.number}
                        </span>
                      </div>
                      <InvoiceMenu
                        invoice={inv}
                        onSend={() => handleStatus(inv.id, "sent")}
                        onMarkPaid={() => handleStatus(inv.id, "paid")}
                        onCopyLink={() => handleCopyLink(inv.id)}
                        onDelete={() => handleDelete(inv.id)}
                        isPending={isPending}
                      />
                    </div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-3">
                        {inv.clientName && (
                          <span className="text-[12px]" style={{ color: "var(--text-2)" }}>{inv.clientName}</span>
                        )}
                        <span className="text-[11px]" style={{ color: "var(--text-3)", fontFamily: "var(--font-mono)" }}>
                          Due {new Date(inv.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                        </span>
                      </div>
                      <span className="text-[14px] font-bold" style={{ color: "var(--text)" }}>
                        ₹{inv.total.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <span
                      className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-medium mt-1"
                      style={{ background: sc.bg, color: sc.color, fontFamily: "var(--font-mono)", border: `0.5px solid ${sc.color}22` }}
                    >
                      <StatusIcon className="w-3 h-3" />
                      {sc.label}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}