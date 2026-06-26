"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard, FileText, Receipt,
  Users, Settings, Sparkles, Menu, X, Zap
} from "lucide-react"
import { PLANS } from "@/lib/plans"

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Proposals", href: "/dashboard/proposals", icon: FileText },
  { label: "Invoices", href: "/dashboard/invoices", icon: Receipt },
  { label: "Clients", href: "/dashboard/clients", icon: Users },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
]

export function MobileSidebar({
  userName,
  userEmail,
  userImage,
  plan = "free",
  counts = { proposals: 0, invoices: 0, clients: 0 },
}: {
  userName: string
  userEmail: string
  userImage: string | null
  plan?: string
  counts?: { proposals: number; invoices: number; clients: number }
}) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const isPro = plan === "pro"
  const freeLimits = PLANS.free.limits

  return (
    <>
      {/* Top bar */}
      <div
        className="h-14 flex items-center justify-between px-4"
        style={{ borderBottom: "0.5px solid rgba(255,255,255,0.08)", background: "#0a0a0c" }}
      >
        <Link href="/" className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg flex items-center justify-center"
            style={{ background: "#ffffff" }}>
            <Sparkles className="w-3 h-3" style={{ color: "#0a0a0c" }} strokeWidth={2.5} />
          </div>
          <span className="text-[13px] font-semibold" style={{ color: "#f5f5f7" }}>Klivion</span>
        </Link>
        <button
          onClick={() => setOpen(true)}
          className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors hover:bg-[rgba(255,255,255,0.06)]"
          style={{ color: "#a1a1a6" }}
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-50"
          style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className="fixed top-0 left-0 h-full z-50 flex flex-col w-64 transition-transform duration-300"
        style={{
          background: "#0a0a0c",
          borderRight: "0.5px solid rgba(255,255,255,0.08)",
          transform: open ? "translateX(0)" : "translateX(-100%)",
          boxShadow: open ? "var(--shadow-panel)" : "none",
        }}
      >
        {/* Drawer header */}
        <div
          className="h-14 flex items-center justify-between px-4 shrink-0"
          style={{ borderBottom: "0.5px solid rgba(255,255,255,0.08)" }}
        >
          <Link href="/" onClick={() => setOpen(false)} className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg flex items-center justify-center"
              style={{ background: "#ffffff" }}>
              <Sparkles className="w-3 h-3" style={{ color: "#0a0a0c" }} strokeWidth={2.5} />
            </div>
            <span className="text-[13px] font-semibold" style={{ color: "#f5f5f7" }}>Klivion</span>
          </Link>
          <button
            onClick={() => setOpen(false)}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[rgba(255,255,255,0.06)]"
            style={{ color: "#6e6e73" }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] font-medium transition-all"
                style={
                  isActive
                    ? { background: "rgba(255,255,255,0.07)", color: "#f5f5f7" }
                    : { color: "#6e6e73" }
                }
              >
                <Icon className="w-4 h-4 shrink-0" strokeWidth={isActive ? 2 : 1.75} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Plan section */}
        <div className="px-3 pb-2">
          {isPro ? (
            <div
              className="rounded-xl px-3 py-2.5 flex items-center gap-2"
              style={{ background: "var(--inset-fill)", border: "0.5px solid var(--hairline)" }}
            >
              <Zap className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--status-warning)" }} />
              <div>
                <p className="text-[11px] font-semibold" style={{ color: "var(--text-2)" }}>Pro Plan</p>
                <p className="text-[10px]" style={{ color: "var(--text-3)" }}>Increased limits active</p>
              </div>
            </div>
          ) : (
            <div
              className="rounded-xl p-3"
              style={{ background: "var(--inset-fill)", border: "0.5px solid var(--hairline)" }}
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] font-semibold uppercase tracking-wider"
                  style={{ color: "var(--text-3)", fontFamily: "var(--font-mono)" }}>
                  Free Plan
                </p>
                <Link
                  href="/dashboard/settings?upgrade=true"
                  onClick={() => setOpen(false)}
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: "rgba(255,255,255,0.08)", color: "var(--text-2)" }}
                >
                  Upgrade
                </Link>
              </div>
              {[
                { label: "Proposals", used: counts.proposals, limit: freeLimits.proposals },
                { label: "Invoices",  used: counts.invoices,  limit: freeLimits.invoices },
                { label: "Clients",   used: counts.clients,   limit: freeLimits.clients },
              ].map(item => (
                <div key={item.label} className="mb-2 last:mb-0">
                  <div className="flex justify-between mb-1">
                    <span className="text-[10px]" style={{ color: "var(--text-3)" }}>{item.label}</span>
                    <span className="text-[10px]"
                      style={{ color: item.used >= item.limit ? "var(--status-error)" : "var(--text-3)" }}>
                      {item.used}/{item.limit}
                    </span>
                  </div>
                  <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${Math.min((item.used / item.limit) * 100, 100)}%`,
                        background: item.used >= item.limit ? "var(--status-error)" : "rgba(255,255,255,0.3)",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* User */}
        <div
          className="px-3 pb-4 pt-2 shrink-0"
          style={{ borderTop: "0.5px solid rgba(255,255,255,0.08)" }}
        >
          <div className="flex items-center gap-3 px-1 py-2">
            {userImage ? (
              <img src={userImage} alt={userName}
                className="w-7 h-7 rounded-full object-cover shrink-0" />
            ) : (
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0"
                style={{ background: "rgba(255,255,255,0.08)", color: "#a1a1a6" }}
              >
                {userName.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium truncate" style={{ color: "#a1a1a6" }}>
                {userName}
              </p>
              <p className="text-[11px] truncate mt-0.5" style={{ color: "#6e6e73" }}>
                {isPro ? "Pro plan" : "Free plan"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}