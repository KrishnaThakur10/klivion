"use client"

import { useState, useTransition } from "react"
import { createInvoice, deleteInvoice, updateInvoiceStatus } from "@/app/actions/invoices"
import {
  Receipt, Plus, Trash2, ArrowLeft,
  Clock, CheckCircle, AlertCircle, Send
} from "lucide-react"

type Client = { id: string; name: string }
type LineItem = { id: string; description: string; quantity: number; rate: number }
type Invoice = {
  id: string
  number: string
  status: string
  dueDate: Date
  total: number
  createdAt: Date
  client: Client | null
  lineItems: LineItem[]
}

const statusStyles: Record<string, { style: string; icon: React.ReactNode }> = {
  draft:   { style: "bg-gray-100 text-gray-600",   icon: <Clock className="w-3 h-3" /> },
  sent:    { style: "bg-blue-100 text-blue-600",   icon: <Send className="w-3 h-3" /> },
  paid:    { style: "bg-green-100 text-green-600", icon: <CheckCircle className="w-3 h-3" /> },
  overdue: { style: "bg-red-100 text-red-600",     icon: <AlertCircle className="w-3 h-3" /> },
}

type NewLineItem = { description: string; quantity: string; rate: string }

export function InvoicesClient({
  invoices,
  clients,
}: {
  invoices: Invoice[]
  clients: Client[]
}) {
  const [view, setView] = useState<"list" | "new">("list")
  const [clientId, setClientId] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [taxRate, setTaxRate] = useState("0")
  const [lineItems, setLineItems] = useState<NewLineItem[]>([
    { description: "", quantity: "1", rate: "" }
  ])
  const [error, setError] = useState("")
  const [isPending, startTransition] = useTransition()
  const [shareLink, setShareLink] = useState("")
  const [showShare, setShowShare] = useState(false)

  // Calculations
  const subtotal = lineItems.reduce((sum, item) => {
    return sum + (parseFloat(item.quantity) || 0) * (parseFloat(item.rate) || 0)
  }, 0)
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
    setError("")
    startTransition(async () => {
      const result = await createInvoice({
        clientId: clientId || undefined,
        dueDate,
        taxRate: parseFloat(taxRate) || 0,
        lineItems: lineItems.map((item) => ({
          description: item.description,
          quantity: parseFloat(item.quantity) || 0,
          rate: parseFloat(item.rate) || 0,
        })),
      })
      if (result?.error) {
        setError(result.error)
      } else {
        setView("list")
        resetForm()
      }
    })
  }

  function handleDelete(id: string) {
    startTransition(async () => { await deleteInvoice(id) })
  }

function handleStatus(id: string, status: string) {
  startTransition(async () => {
    await updateInvoiceStatus(id, status)
    if (status === "sent") {
      setShareLink(`${window.location.origin}/invoices/${id}`)
      setShowShare(true)
    }
  })
}

  // ── NEW INVOICE FORM ──
  if (view === "new") {
    return (
      <div>
        {showShare && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-card border border-border rounded-2xl p-6 max-w-md w-full shadow-xl">
              <div className="text-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Send className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-semibold text-lg">Invoice Ready to Send!</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Copy this link and send it to your client
                </p>
              </div>
              <div className="flex gap-2 mb-4">
                <input
                  readOnly
                  value={shareLink}
                  className="flex-1 border border-border rounded-lg px-3 py-2 text-sm bg-muted focus:outline-none"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(shareLink)
                    alert("Link copied!")
                  }}
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shrink-0"
                >
                  Copy
                </button>
              </div>
              <p className="text-xs text-muted-foreground text-center mb-4">
                Stripe payment integration coming in the next phase
              </p>
              <button
                onClick={() => setShowShare(false)}
                className="w-full border border-border py-2 rounded-lg text-sm hover:bg-accent transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        )}
        <button
          onClick={() => { setView("list"); resetForm() }}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to invoices
        </button>

        <div className="bg-card border border-border rounded-xl p-6 mb-4">
          <h2 className="font-semibold mb-6">New Invoice</h2>

          {/* Client + Due Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="text-sm font-medium mb-1 block">Client</label>
              <select
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select a client (optional)</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">
                Due Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Line Items */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium">Line Items</label>
              <button
                onClick={addLineItem}
                className="flex items-center gap-1 text-xs text-primary hover:underline"
              >
                <Plus className="w-3 h-3" /> Add Item
              </button>
            </div>

            {/* Header */}
            <div className="grid grid-cols-12 gap-2 mb-2 px-1">
              <div className="col-span-6 text-xs text-muted-foreground font-medium">Description</div>
              <div className="col-span-2 text-xs text-muted-foreground font-medium">Qty</div>
              <div className="col-span-2 text-xs text-muted-foreground font-medium">Rate (₹)</div>
              <div className="col-span-2 text-xs text-muted-foreground font-medium">Amount</div>
            </div>

            <div className="flex flex-col gap-2">
              {lineItems.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-6">
                    <input
                      value={item.description}
                      onChange={(e) => updateLineItem(index, "description", e.target.value)}
                      placeholder="Web design services"
                      className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateLineItem(index, "quantity", e.target.value)}
                      min="0"
                      className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      value={item.rate}
                      onChange={(e) => updateLineItem(index, "rate", e.target.value)}
                      placeholder="0"
                      min="0"
                      className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="col-span-2 flex items-center justify-between">
                    <span className="text-sm font-medium">
                      ₹{((parseFloat(item.quantity) || 0) * (parseFloat(item.rate) || 0)).toLocaleString("en-IN")}
                    </span>
                    {lineItems.length > 1 && (
                      <button
                        onClick={() => removeLineItem(index)}
                        className="text-muted-foreground hover:text-red-500 transition-colors ml-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="border-t border-border pt-4 flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>₹{subtotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-sm items-center">
                <span className="text-muted-foreground">Tax (%)</span>
                <input
                  type="number"
                  value={taxRate}
                  onChange={(e) => setTaxRate(e.target.value)}
                  min="0"
                  max="100"
                  className="w-16 border border-border rounded px-2 py-1 text-sm text-right bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              {parseFloat(taxRate) > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax Amount</span>
                  <span>₹{tax.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-base border-t border-border pt-2">
                <span>Total</span>
                <span>₹{total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>

          {error && <p className="text-sm text-red-500 mt-4">{error}</p>}

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleCreate}
              disabled={isPending}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              {isPending ? "Creating..." : "Create Invoice"}
            </button>
            <button
              onClick={() => { setView("list"); resetForm() }}
              className="border border-border px-4 py-2 rounded-lg text-sm font-medium hover:bg-accent transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── INVOICE LIST ──
  return (
    <div>
      {/* Summary Stats */}
      {invoices.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            {
              label: "Total Invoiced",
              value: `₹${invoices.reduce((s, i) => s + i.total, 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`,
              color: "text-foreground"
            },
            {
              label: "Paid",
              value: `₹${invoices.filter(i => i.status === "paid").reduce((s, i) => s + i.total, 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`,
              color: "text-green-600"
            },
            {
              label: "Pending",
              value: `₹${invoices.filter(i => i.status === "sent").reduce((s, i) => s + i.total, 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`,
              color: "text-blue-600"
            },
            {
              label: "Overdue",
              value: `₹${invoices.filter(i => i.status === "overdue").reduce((s, i) => s + i.total, 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`,
              color: "text-red-600"
            },
          ].map((stat) => (
            <div key={stat.label} className="bg-card border border-border rounded-xl p-4">
              <div className="text-xs text-muted-foreground mb-1">{stat.label}</div>
              <div className={`font-bold text-base ${stat.color}`}>{stat.value}</div>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={() => setView("new")}
        className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors mb-6"
      >
        <Plus className="w-4 h-4" /> New Invoice
      </button>

      {invoices.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border rounded-xl">
          <Receipt className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <h3 className="font-medium mb-1">No invoices yet</h3>
          <p className="text-sm text-muted-foreground">Create your first invoice to get started</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {invoices.map((inv) => {
            const s = statusStyles[inv.status] || statusStyles.draft
            const isOverdue = inv.status === "sent" && new Date(inv.dueDate) < new Date()
            return (
              <div
                key={inv.id}
                className="bg-card border border-border rounded-xl p-5 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
                    <Receipt className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{inv.number}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1 ${s.style}`}>
                        {s.icon}
                        {isOverdue ? "Overdue" : inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      {inv.client && (
                        <span className="text-xs text-muted-foreground">{inv.client.name}</span>
                      )}
                      <span className="text-xs text-muted-foreground">
                        Due: {new Date(inv.dueDate).toLocaleDateString("en-IN")}
                      </span>
                      <span className="text-xs font-semibold text-foreground">
                        ₹{inv.total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {inv.status === "draft" && (
                    <button
                      onClick={() => handleStatus(inv.id, "sent")}
                      disabled={isPending}
                      className="flex items-center gap-1 text-xs border border-border px-3 py-1.5 rounded-lg hover:bg-accent transition-colors"
                    >
                      <Send className="w-3 h-3" /> Send
                    </button>
                  )}
                  {inv.status === "sent" && (
                    <button
                      onClick={() => handleStatus(inv.id, "paid")}
                      disabled={isPending}
                      className="flex items-center gap-1 text-xs border border-green-200 text-green-600 px-3 py-1.5 rounded-lg hover:bg-green-50 transition-colors"
                    >
                      <CheckCircle className="w-3 h-3" /> Mark Paid
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(inv.id)}
                    disabled={isPending}
                    className="text-muted-foreground hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}