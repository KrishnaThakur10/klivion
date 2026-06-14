"use client"

import { useRef } from "react"
import Link from "next/link"
import {
  TrendingUp, FileText, Receipt, Users,
  ArrowRight, CheckCircle2, Clock,
  AlertCircle, Plus
} from "lucide-react"

const ICONS: Record<string, React.ElementType> = {
  TrendingUp,
  FileText,
  Receipt,
  Users,
}

type Stat = {
  label: string
  value: string
  sub: string
  dot: string
  icon: string
}

type Invoice = {
  id: string
  number: string
  status: string
  dueDate: string
  total: number
  clientName: string | null
}

type Proposal = {
  id: string
  title: string
  status: string
}

function MagicCard({
  children,
  className = "",
  style = {},
}: {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}) {
  const ref = useRef<HTMLDivElement>(null)

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`)
    el.style.setProperty("--my", `${e.clientY - rect.top}px`)
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      className={`magic-card ${className}`}
      style={style}
    >
      {children}
    </div>
  )
}

export function DashboardContent({
  greeting,
  firstName,
  stats,
  invoices,
  proposals,
}: {
  greeting: string
  firstName: string
  stats: Stat[]
  invoices: Invoice[]
  proposals: Proposal[]
}) {
  return (
    <div
      className="flex flex-col min-h-full"
      style={{ background: "var(--bg)", fontFamily: "var(--font-ui)" }}
    >
      {/* Header */}
        <header
          className="h-14 flex items-center justify-between px-4 md:px-8 shrink-0"
          style={{ borderBottom: "0.5px solid var(--hairline)" }}
        >
        <span
          className="text-[12px]"
          style={{ color: "var(--text-3)", fontFamily: "var(--font-mono)" }}
        >
          {new Date().toLocaleDateString("en-IN", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}
        </span>
        <Link href="/dashboard/proposals" className="btn-primary">
          <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
          New Proposal
        </Link>
      </header>

      <div className="flex-1 p-4 md:p-8 w-full space-y-6 md:space-y-8">

        {/* Greeting */}
        <div style={{ animation: "float-in 560ms var(--ease-apple) both" }}>
          <h1
            className="text-[26px] font-semibold leading-tight"
            style={{
              color: "var(--text)",
              letterSpacing: "-0.03em",
            }}
          >
            {greeting}, {firstName}
          </h1>
          <p className="text-[13px] mt-1" style={{ color: "var(--text-3)" }}>
            Overview of your freelance business
          </p>
        </div>

        {/* Stat Cards with magic hover */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {stats.map((stat) => {
            const Icon = ICONS[stat.icon] ?? FileText
            return (
              <MagicCard
                key={stat.label}
                className="rounded-2xl p-5 cursor-default select-none reveal"
                style={{
                  background: "var(--bg-grid)",
                  border: "0.5px solid var(--hairline)",
                  boxShadow: "var(--shadow-panel)",
                }}
              >
                <div className="flex items-center justify-between mb-5">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ background: "var(--inset-fill)" }}
                  >
                    <Icon
                      className="w-[14px] h-[14px]"
                      style={{ color: "var(--text-3)" }}
                      strokeWidth={1.5}
                    />
                  </div>
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{
                      background: stat.dot,
                      boxShadow: `0 0 8px ${stat.dot}`,
                    }}
                  />
                </div>
                <p
                  className="text-[22px] font-semibold leading-none mb-1.5"
                  style={{ color: "var(--text)", letterSpacing: "-0.03em" }}
                >
                  {stat.value}
                </p>
                <p
                  className="text-[11px] font-semibold uppercase tracking-wider mb-0.5"
                  style={{
                    color: "var(--text-3)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {stat.label}
                </p>
                <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.2)" }}>
                  {stat.sub}
                </p>
              </MagicCard>
            )
          })}
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

          {/* Invoice table */}
          <div
            className="lg:col-span-3 rounded-2xl overflow-hidden reveal"
            style={{
              background: "var(--bg-grid)",
              border: "0.5px solid var(--hairline)",
              boxShadow: "var(--shadow-panel)",
            }}
          >
            <div
              className="flex items-center justify-between px-5 py-4"
              style={{ borderBottom: "0.5px solid var(--hairline)" }}
            >
              <p
                className="text-[13px] font-semibold"
                style={{ color: "var(--text)" }}
              >
                Invoices
              </p>
              <Link
                href="/dashboard/invoices"
                className="btn-ghost text-[12px] py-1 px-2.5"
              >
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {invoices.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-14 gap-2">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{
                    background: "var(--inset-fill)",
                    border: "0.5px solid var(--hairline)",
                  }}
                >
                  <Receipt
                    className="w-4 h-4"
                    style={{ color: "var(--text-3)" }}
                  />
                </div>
                <p className="text-[12px]" style={{ color: "var(--text-3)" }}>
                  No invoices yet
                </p>
                <Link
                  href="/dashboard/invoices"
                  className="text-[11px]"
                  style={{ color: "var(--text-3)" }}
                >
                  Create your first →
                </Link>
              </div>
            ) : (
              <>
                <div
                  className="grid grid-cols-4 px-5 py-2.5"
                  style={{
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
                  <span className="text-right">Amount</span>
                </div>
                {invoices.map((inv, i) => (
                  <div
                    key={inv.id}
                    className="grid grid-cols-4 items-center px-5 py-3 transition-colors"
                    style={{
                      borderBottom:
                        i < invoices.length - 1
                          ? "0.5px solid rgba(255,255,255,0.04)"
                          : "none",
                      cursor: "default",
                    }}
                    onMouseEnter={e =>
                      ((e.currentTarget as HTMLElement).style.background =
                        "var(--atmo-1)")
                    }
                    onMouseLeave={e =>
                      ((e.currentTarget as HTMLElement).style.background =
                        "transparent")
                    }
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-1.5 h-1.5 rounded-full shrink-0"
                        style={{
                          background:
                            inv.status === "paid"
                              ? "var(--status-success)"
                              : inv.status === "sent"
                              ? "rgba(255,255,255,0.4)"
                              : "rgba(255,255,255,0.15)",
                        }}
                      />
                      <span
                        className="text-[12px] font-medium"
                        style={{
                          color: "var(--text)",
                          fontFamily: "var(--font-mono)",
                        }}
                      >
                        {inv.number}
                      </span>
                    </div>
                    <span
                      className="text-[12px] truncate pr-2"
                      style={{ color: "var(--text-2)" }}
                    >
                      {inv.clientName ?? "—"}
                    </span>
                    <span
                      className="text-[12px]"
                      style={{ color: "var(--text-3)" }}
                    >
                      {new Date(inv.dueDate).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                    <div className="flex items-center justify-end gap-2">
                      <span
                        className="text-[12px] font-semibold"
                        style={{ color: "var(--text)" }}
                      >
                        ₹{inv.total.toLocaleString("en-IN")}
                      </span>
                      <span
                        className="text-[10px] font-medium px-1.5 py-0.5 rounded-md"
                        style={{
                          fontFamily: "var(--font-mono)",
                          background:
                            inv.status === "paid"
                              ? "var(--status-success-bg)"
                              : "var(--inset-fill)",
                          color:
                            inv.status === "paid"
                              ? "var(--status-success)"
                              : "var(--text-3)",
                        }}
                      >
                        {inv.status}
                      </span>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Right column */}
          <div className="lg:col-span-2 flex flex-col gap-4">

            {/* Proposals */}
            <div
              className="rounded-2xl overflow-hidden flex-1 reveal"
              style={{
                background: "var(--bg-grid)",
                border: "0.5px solid var(--hairline)",
                boxShadow: "var(--shadow-panel)",
              }}
            >
              <div
                className="flex items-center justify-between px-5 py-4"
                style={{ borderBottom: "0.5px solid var(--hairline)" }}
              >
                <p
                  className="text-[13px] font-semibold"
                  style={{ color: "var(--text)" }}
                >
                  Proposals
                </p>
                <Link
                  href="/dashboard/proposals"
                  className="btn-ghost text-[12px] py-1 px-2.5"
                >
                  View all <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              {proposals.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 gap-1.5">
                  <FileText
                    className="w-5 h-5"
                    style={{ color: "rgba(255,255,255,0.1)" }}
                  />
                  <p
                    className="text-[12px]"
                    style={{ color: "var(--text-3)" }}
                  >
                    No proposals yet
                  </p>
                </div>
              ) : (
                proposals.map((p, i) => (
                  <div
                    key={p.id}
                    className="flex items-center gap-3 px-5 py-3 transition-colors"
                    style={{
                      borderBottom:
                        i < proposals.length - 1
                          ? "0.5px solid rgba(255,255,255,0.04)"
                          : "none",
                    }}
                    onMouseEnter={e =>
                      ((e.currentTarget as HTMLElement).style.background =
                        "var(--atmo-1)")
                    }
                    onMouseLeave={e =>
                      ((e.currentTarget as HTMLElement).style.background =
                        "transparent")
                    }
                  >
                    <div
                      className="w-5 h-5 rounded-md flex items-center justify-center shrink-0"
                      style={{
                        background:
                          p.status === "signed"
                            ? "var(--status-success-bg)"
                            : "var(--inset-fill)",
                      }}
                    >
                      {p.status === "signed" ? (
                        <CheckCircle2
                          className="w-3 h-3"
                          style={{ color: "var(--status-success)" }}
                        />
                      ) : p.status === "sent" ? (
                        <Clock
                          className="w-3 h-3"
                          style={{ color: "var(--text-3)" }}
                        />
                      ) : (
                        <AlertCircle
                          className="w-3 h-3"
                          style={{ color: "rgba(255,255,255,0.2)" }}
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-[12px] font-medium truncate"
                        style={{ color: "var(--text)" }}
                      >
                        {p.title}
                      </p>
                      <p
                        className="text-[11px] capitalize mt-0.5"
                        style={{
                          color: "var(--text-3)",
                          fontFamily: "var(--font-mono)",
                        }}
                      >
                        {p.status}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Quick actions */}
            <div
              className="rounded-2xl p-4 reveal"
              style={{
                background: "var(--bg-grid)",
                border: "0.5px solid var(--hairline)",
                boxShadow: "var(--shadow-panel)",
              }}
            >
              <p
                className="text-[10px] font-semibold uppercase tracking-[0.1em] mb-3"
                style={{
                  color: "var(--text-3)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                Quick actions
              </p>
              <div className="space-y-1.5">
                {[
                  { href: "/dashboard/proposals", label: "New Proposal", icon: FileText },
                  { href: "/dashboard/invoices", label: "New Invoice", icon: Receipt },
                  { href: "/dashboard/clients", label: "Add Client", icon: Users },
                ].map((action) => {
                  const Icon = action.icon
                  return (
                    <Link
                      key={action.href}
                      href={action.href}
                      className="flex items-center justify-between w-full px-3 py-2.5 rounded-lg transition-all group"
                      style={{
                        background: "var(--inset-fill)",
                        border: "0.5px solid var(--hairline)",
                      }}
                      onMouseEnter={e => {
                        const el = e.currentTarget as HTMLElement
                        el.style.background = "rgba(255,255,255,0.06)"
                        el.style.borderColor = "var(--hairline-strong)"
                      }}
                      onMouseLeave={e => {
                        const el = e.currentTarget as HTMLElement
                        el.style.background = "var(--inset-fill)"
                        el.style.borderColor = "var(--hairline)"
                      }}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon
                          className="w-3.5 h-3.5 shrink-0"
                          style={{ color: "var(--text-3)" }}
                          strokeWidth={1.5}
                        />
                        <span
                          className="text-[12px] font-medium"
                          style={{ color: "var(--text-2)" }}
                        >
                          {action.label}
                        </span>
                      </div>
                      <ArrowRight
                        className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ color: "var(--text-3)" }}
                      />
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
