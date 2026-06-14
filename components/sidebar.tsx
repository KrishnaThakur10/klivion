"use client"

import Link from "next/link"
import { redirect, usePathname } from "next/navigation"
import {
  LayoutDashboard, FileText, Receipt,
  Users, Settings, Sparkles
} from "lucide-react"
import { cn } from "@/lib/utils"

const navSections = [
  {
    label: null,
    items: [{ label: "Dashboard", href: "/dashboard", icon: LayoutDashboard }],
  },
  {
    label: "Workspace",
    items: [
      { label: "Proposals", href: "/dashboard/proposals", icon: FileText },
      { label: "Invoices", href: "/dashboard/invoices", icon: Receipt },
      { label: "Clients", href: "/dashboard/clients", icon: Users },
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
}: {
  userName: string
  userEmail: string
  userImage: string | null
}) {
  const pathname = usePathname()

  return (
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
        <div onClick={() => { redirect("/") }} className="cursor-pointer flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
            style={{
              background: "#ffffff",
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.4), 0 4px 12px -4px rgba(0,0,0,0.6)",
            }}
          >
            <Sparkles
              className="w-3 h-3"
              style={{ color: "#0a0a0c" }}
              strokeWidth={2.5}
            />
          </div>
          <span
            className="text-[13px] font-semibold tracking-tight"
            style={{ color: "#f5f5f7" }}
          >
            Klivio
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 overflow-y-auto">
        <div className="space-y-5">
          {navSections.map((section, i) => (
            <div key={i}>
              {section.label && (
                <p
                  className="px-2.5 mb-1.5 text-[10px] font-semibold tracking-[0.1em] uppercase select-none"
                  style={{
                    color: "rgba(255,255,255,0.18)",
                    fontFamily: "var(--font-mono)",
                  }}
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
                      style={
                        isActive
                          ? { background: "rgba(255,255,255,0.07)" }
                          : {}
                      }
                    >
                      <Icon
                        className="w-[14px] h-[14px] shrink-0"
                        strokeWidth={isActive ? 2 : 1.75}
                      />
                      {item.label}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </nav>

      {/* User */}
      <div
        className="px-2 pt-3 pb-3 shrink-0"
        style={{ borderTop: "0.5px solid rgba(255,255,255,0.08)" }}
      >
        <Link
          href="/dashboard/settings"
          className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-all duration-150 hover:bg-[rgba(255,255,255,0.04)]"
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
            <p
              className="text-[12px] font-medium truncate leading-none"
              style={{ color: "#a1a1a6" }}
            >
              {userName}
            </p>
            <p
              className="text-[11px] truncate mt-1 leading-none"
              style={{ color: "#6e6e73" }}
            >
              Free plan
            </p>
          </div>
        </Link>
      </div>
    </aside>
  )
}