"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { createClient, deleteClient } from "@/app/actions/clients"
import {
  Plus, ArrowLeft, Trash2, Users,
  Mail, Building2, Phone, MoreHorizontal
} from "lucide-react"
import { UpgradeModal } from "@/components/upgrade-modal"

type Client = {
  id: string
  name: string
  email: string
  company: string | null
  phone: string | null
}

function ClientMenu({
  onDelete,
  isPending,
}: {
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
            className="absolute right-0 top-8 z-20 w-36 rounded-xl py-1 overflow-hidden"
            style={{ background: "var(--bg-grid)", border: "0.5px solid var(--hairline-strong)", boxShadow: "var(--shadow-panel)" }}
          >
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

export function ClientsPage({ clients: initial }: { clients: Client[] }) {
  const router = useRouter()
  const [view, setView] = useState<"list" | "new">("list")
  const [clients, setClients] = useState(initial)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [company, setCompany] = useState("")
  const [phone, setPhone] = useState("")
  const [error, setError] = useState("")
  const [isPending, startTransition] = useTransition()
  const [showUpgrade, setShowUpgrade] = useState(false)
  const [upgradeReason, setUpgradeReason] = useState("")

  function resetForm() {
    setName("")
    setEmail("")
    setCompany("")
    setPhone("")
    setError("")
  }

  function handleCreate() {
    if (!name.trim()) { setError("Name is required"); return }
    if (!email.trim()) { setError("Email is required"); return }
    setError("")
    startTransition(async () => {
      const result = await createClient({
        name, email,
        company: company || undefined,
        phone: phone || undefined,
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
        router.refresh()
      }
    })
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteClient(id)
      setClients(prev => prev.filter(c => c.id !== id))
    })
  }

  // ── NEW CLIENT VIEW ──
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
            Clients
          </button>
          <button onClick={handleCreate} disabled={isPending} className="btn-primary">
            {isPending ? "Saving..." : "Save Client"}
          </button>
        </header>

        <div className="flex-1 p-4 md:p-8 max-w-[560px] w-full mx-auto space-y-4">
          {error && (
            <p className="text-[12px] px-3 py-2 rounded-lg"
              style={{ color: "var(--status-error)", background: "var(--status-error-bg)", border: "0.5px solid var(--status-error)" }}>
              {error}
            </p>
          )}

          <div>
            <label className="block mb-1.5 text-[11px] font-semibold uppercase tracking-wider"
              style={{ color: "var(--text-3)", fontFamily: "var(--font-mono)" }}>
              Name *
            </label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Acme Corporation"
              className="ui-input"
            />
          </div>

          <div>
            <label className="block mb-1.5 text-[11px] font-semibold uppercase tracking-wider"
              style={{ color: "var(--text-3)", fontFamily: "var(--font-mono)" }}>
              Email *
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="contact@acme.com"
              className="ui-input"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block mb-1.5 text-[11px] font-semibold uppercase tracking-wider"
                style={{ color: "var(--text-3)", fontFamily: "var(--font-mono)" }}>
                Company
              </label>
              <input
                value={company}
                onChange={e => setCompany(e.target.value)}
                placeholder="Acme Inc."
                className="ui-input"
              />
            </div>
            <div>
              <label className="block mb-1.5 text-[11px] font-semibold uppercase tracking-wider"
                style={{ color: "var(--text-3)", fontFamily: "var(--font-mono)" }}>
                Phone
              </label>
              <input
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="ui-input"
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── LIST VIEW ──
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
        <div className="flex items-center gap-2">
          <span className="text-[15px] font-semibold" style={{ color: "var(--text)" }}>Clients</span>
          <span
            className="text-[11px] px-1.5 py-0.5 rounded-md"
            style={{ background: "var(--inset-fill)", color: "var(--text-3)", fontFamily: "var(--font-mono)", border: "0.5px solid var(--hairline)" }}
          >
            {clients.length}
          </span>
        </div>
        <button onClick={() => setView("new")} className="btn-primary">
          <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
          <span className="hidden sm:inline">New Client</span>
          <span className="sm:hidden">New</span>
        </button>
      </header>

      <div className="flex-1 p-4 md:p-8 max-w-[1080px] w-full mx-auto overflow-x-hidden">

        {clients.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ background: "var(--inset-fill)", border: "0.5px solid var(--hairline)", boxShadow: "var(--shadow-panel)" }}>
              <Users className="w-6 h-6" style={{ color: "var(--text-3)" }} />
            </div>
            <div className="text-center">
              <p className="text-[15px] font-semibold" style={{ color: "var(--text)" }}>No clients yet</p>
              <p className="text-[13px] mt-1" style={{ color: "var(--text-3)" }}>Add your first client to get started</p>
            </div>
            <button onClick={() => setView("new")} className="btn-primary">
              <Plus className="w-3.5 h-3.5" /> Add Client
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {clients.map((client) => (
              <div
                key={client.id}
                className="rounded-xl p-5 transition-all duration-150"
                style={{
                  background: "var(--bg-grid)",
                  border: "0.5px solid var(--hairline)",
                  boxShadow: "var(--shadow-panel)",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--hairline-strong)"
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--hairline)"
                }}
              >
                {/* Card header */}
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-[17px] shrink-0"
                    style={{
                      background: "rgba(255,255,255,0.07)",
                      color: "var(--text-2)",
                      border: "0.5px solid var(--hairline-strong)",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {client.name.charAt(0).toUpperCase()}
                  </div>
                  <ClientMenu
                    onDelete={() => handleDelete(client.id)}
                    isPending={isPending}
                  />
                </div>

                {/* Name */}
                <p className="text-[15px] font-semibold mb-3 truncate" style={{ color: "var(--text)", letterSpacing: "-0.01em" }}>
                  {client.name}
                </p>

                {/* Divider */}
                <div style={{ height: "0.5px", background: "var(--hairline)", marginBottom: "12px" }} />

                {/* Details */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5 text-[12px]" style={{ color: "var(--text-2)" }}>
                    <Mail className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--text-3)" }} />
                    <span className="truncate">{client.email}</span>
                  </div>
                  {client.company && (
                    <div className="flex items-center gap-2.5 text-[12px]" style={{ color: "var(--text-2)" }}>
                      <Building2 className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--text-3)" }} />
                      <span className="truncate">{client.company}</span>
                    </div>
                  )}
                  {client.phone && (
                    <div className="flex items-center gap-2.5 text-[12px]" style={{ color: "var(--text-2)" }}>
                      <Phone className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--text-3)" }} />
                      <span className="truncate">{client.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}