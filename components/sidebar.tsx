"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard, FileText, Receipt,
  Users, Settings, Zap, LogOut, ChevronUp
} from "lucide-react"
import { cn } from "@/lib/utils"
import { PLANS } from "@/lib/plans"
import { UpgradeModal } from "@/components/upgrade-modal"

const navSections = [
  {
    label: null,
    items: [{ label: "Dashboard", href: "/dashboard", icon: LayoutDashboard }],
  },
  {
    label: "Workspace",
    items: [
      { label: "Proposals", href: "/dashboard/proposals", icon: FileText },
      { label: "Invoices",  href: "/dashboard/invoices",  icon: Receipt },
      { label: "Clients",   href: "/dashboard/clients",   icon: Users },
    ],
  },
  {
    label: "Account",
    items: [{ label: "Settings", href: "/dashboard/settings", icon: Settings }],
  },
]

export function Sidebar({
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
  const isPro = plan === "pro"
  const pathname = usePathname()
  const freeLimits = PLANS.free.limits
  const [showMenu, setShowMenu] = useState(false)
  const [showUpgrade, setShowUpgrade] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleLogout() {
    startTransition(async () => {
      await fetch("/api/auth/signout", { method: "POST" })
      window.location.href = "/"
    })
  }

  return (
    <>
      {/* Upgrade modal — rendered at root level to avoid stacking context issues */}
      {showUpgrade && (
        <UpgradeModal
          onClose={() => setShowUpgrade(false)}
          reason="Unlock unlimited proposals, invoices, clients, online payments, and AI generation."
        />
      )}

      <aside
        className="w-52 shrink-0 flex flex-col h-full"
        style={{
          background: "#0a0a0c",
          borderRight: "0.5px solid rgba(255,255,255,0.08)",
        }}
      >
        {/* Logo */}
        <div
          className="h-14 flex items-center px-4 shrink-0"
          style={{ borderBottom: "0.5px solid rgba(255,255,255,0.08)" }}
        >
          <Link href="/" className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
              style={{
                background: "#ffffff",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.4), 0 4px 12px -4px rgba(0,0,0,0.6)",
              }}
            >
              <Zap className="w-3 h-3" style={{ color: "#0a0a0c" }} strokeWidth={2.5} />
            </div>
            <span className="text-[13px] font-semibold tracking-tight" style={{ color: "#f5f5f7" }}>
              Klivion
            </span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-3 overflow-y-auto">
          <div className="space-y-5">
            {navSections.map((section, i) => (
              <div key={i}>
                {section.label && (
                  <p
                    className="px-2.5 mb-1.5 text-[10px] font-semibold tracking-[0.1em] uppercase select-none"
                    style={{ color: "rgba(255,255,255,0.18)", fontFamily: "var(--font-mono)" }}
                  >
                    {section.label}
                  </p>
                )}
                <div className="space-y-px">
                  {section.items.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "flex items-center gap-2.5 px-2.5 py-[7px] rounded-lg text-[13px] font-medium transition-all duration-150",
                          isActive
                            ? "text-[#f5f5f7]"
                            : "text-[#6e6e73] hover:text-[#a1a1a6] hover:bg-[rgba(255,255,255,0.04)]"
                        )}
                        style={isActive ? { background: "rgba(255,255,255,0.07)" } : {}}
                      >
                        <Icon className="w-[14px] h-[14px] shrink-0" strokeWidth={isActive ? 2 : 1.75} />
                        {item.label}
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </nav>

        {/* Plan section */}
        <div className="px-2 pb-2">
          {isPro ? (
            <div
              className="rounded-xl px-3 py-2.5 flex items-center gap-2"
              style={{ background: "var(--inset-fill)", border: "0.5px solid var(--hairline)" }}
            >
              <Zap className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--status-warning)" }} strokeWidth={2.5} />
              <div>
                <p className="text-[11px] font-semibold" style={{ color: "var(--text-2)" }}>Pro Plan</p>
                <p className="text-[10px]" style={{ color: "var(--text-3)" }}>All features unlocked</p>
              </div>
            </div>
          ) : (
            <div
              className="rounded-xl p-3"
              style={{ background: "var(--inset-fill)", border: "0.5px solid var(--hairline)" }}
            >
              <div className="flex items-center justify-between mb-2.5">
                <p
                  className="text-[10px] font-semibold uppercase tracking-wider"
                  style={{ color: "var(--text-3)", fontFamily: "var(--font-mono)" }}
                >
                  Free Plan
                </p>
                <button
                  onClick={() => setShowUpgrade(true)}
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-full transition-all duration-150 hover:opacity-80 active:scale-95"
                  style={{ background: "rgba(255,255,255,0.10)", color: "var(--text-2)" }}
                >
                  Upgrade ↑
                </button>
              </div>

              {[
                { label: "Proposals", used: counts.proposals, limit: freeLimits.proposalsPerMonth, monthly: true },
                { label: "Invoices",  used: counts.invoices,  limit: freeLimits.invoicesPerMonth,  monthly: true },
                { label: "Clients",   used: counts.clients,   limit: freeLimits.clientsTotal,       monthly: false },
              ].map(item => {
                const pct = Math.min((item.used / item.limit) * 100, 100)
                const isAtLimit = item.used >= item.limit
                return (
                  <div key={item.label} className="mb-2 last:mb-0">
                    <div className="flex justify-between mb-1">
                      <span className="text-[10px]" style={{ color: "var(--text-3)" }}>
                        {item.label}{item.monthly ? " (mo)" : ""}
                      </span>
                      <span
                        className="text-[10px] font-medium"
                        style={{ color: isAtLimit ? "var(--status-error)" : "var(--text-3)" }}
                      >
                        {item.used}/{item.limit}
                      </span>
                    </div>
                    <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${pct}%`,
                          background: isAtLimit
                            ? "var(--status-error)"
                            : pct > 70
                            ? "var(--status-warning)"
                            : "rgba(255,255,255,0.28)",
                        }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* User row + popup */}
        <div
          className="px-2 pt-2 pb-3 shrink-0"
          style={{ borderTop: "0.5px solid rgba(255,255,255,0.08)", position: "relative" }}
        >
          {/* Popup menu — renders above the user row */}
          {showMenu && (
            <>
              {/* Backdrop — closes menu on outside click */}
              <div
                style={{ position: "fixed", inset: 0, zIndex: 40 }}
                onClick={() => setShowMenu(false)}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: "calc(100% + 4px)",
                  left: "8px",
                  right: "8px",
                  zIndex: 50,
                  background: "#1c1c1f",
                  border: "0.5px solid rgba(255,255,255,0.12)",
                  borderRadius: "12px",
                  padding: "4px",
                  boxShadow: "0 -4px 24px rgba(0,0,0,0.5), 0 0 0 0.5px rgba(255,255,255,0.05)",
                }}
              >
                {/* Name + email header */}
                <div style={{ padding: "10px 10px 8px", borderBottom: "0.5px solid rgba(255,255,255,0.07)", marginBottom: "4px" }}>
                  <p className="text-[12px] font-semibold truncate" style={{ color: "#f5f5f7" }}>
                    {userName}
                  </p>
                  <p className="text-[11px] truncate mt-0.5" style={{ color: "#6e6e73" }}>
                    {userEmail}
                  </p>
                </div>

                {/* Settings link */}
                <Link
                  href="/dashboard/settings"
                  onClick={() => setShowMenu(false)}
                  className="flex items-center gap-2.5 w-full px-2.5 py-[7px] rounded-lg transition-colors hover:bg-[rgba(255,255,255,0.05)]"
                >
                  <Settings className="w-3.5 h-3.5 shrink-0" style={{ color: "#6e6e73" }} />
                  <span className="text-[13px]" style={{ color: "#a1a1a6" }}>Settings</span>
                </Link>

                {/* Upgrade (only for free users) */}
                {!isPro && (
                  <button
                    onClick={() => { setShowMenu(false); setShowUpgrade(true) }}
                    className="flex items-center gap-2.5 w-full px-2.5 py-[7px] rounded-lg transition-colors hover:bg-[rgba(255,255,255,0.05)] text-left"
                  >
                    <Zap className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--status-warning)" }} strokeWidth={2.5} />
                    <span className="text-[13px]" style={{ color: "var(--status-warning)" }}>Upgrade to Pro</span>
                  </button>
                )}

                {/* Divider */}
                <div style={{ height: "0.5px", background: "rgba(255,255,255,0.07)", margin: "4px 0" }} />

                {/* Sign out */}
                <button
                  onClick={() => { setShowMenu(false); handleLogout() }}
                  disabled={isPending}
                  className="flex items-center gap-2.5 w-full px-2.5 py-[7px] rounded-lg transition-colors hover:bg-[rgba(255,69,58,0.08)] text-left disabled:opacity-50"
                >
                  <LogOut className="w-3.5 h-3.5 shrink-0" style={{ color: "#ff453a" }} />
                  <span className="text-[13px]" style={{ color: "#ff453a" }}>
                    {isPending ? "Signing out..." : "Sign out"}
                  </span>
                </button>
              </div>
            </>
          )}

          {/* User row button */}
          <button
            onClick={() => setShowMenu(s => !s)}
            className="flex items-center gap-2.5 w-full px-2.5 py-2 rounded-lg transition-all duration-150 hover:bg-[rgba(255,255,255,0.04)] text-left"
            style={showMenu ? { background: "rgba(255,255,255,0.05)" } : {}}
          >
            {userImage ? (
              <img
                src={userImage}
                alt={userName}
                className="w-6 h-6 rounded-full object-cover shrink-0"
                style={{ border: "0.5px solid rgba(255,255,255,0.14)" }}
              />
            ) : (
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  color: "#a1a1a6",
                  border: "0.5px solid rgba(255,255,255,0.12)",
                }}
              >
                {userName.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-medium truncate leading-none" style={{ color: "#a1a1a6" }}>
                {userName}
              </p>
              <p className="text-[11px] truncate mt-1 leading-none" style={{ color: "#6e6e73" }}>
                {isPro ? "Pro plan" : "Free plan"}
              </p>
            </div>
            <ChevronUp
              className="w-3 h-3 shrink-0 transition-transform duration-200"
              style={{
                color: "#6e6e73",
                transform: showMenu ? "rotate(180deg)" : "rotate(0deg)",
              }}
            />
          </button>
        </div>
      </aside>
    </>
  )
}
