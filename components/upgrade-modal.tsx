"use client"

import { useState } from "react"
import { X, Zap, Check, ArrowRight } from "lucide-react"

type Props = {
  onClose: () => void
  reason?: string
}

declare global {
  interface Window {
    Cashfree: any
  }
}

const SUPPORT_EMAIL = "klivion.support@gmail.com"

function loadCashfreeSdk(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.Cashfree) {
      resolve()
      return
    }
    const script = document.createElement("script")
    script.src = "https://sdk.cashfree.com/js/v3/cashfree.js"
    script.onload = () => resolve()
    script.onerror = () => reject(new Error("Failed to load checkout"))
    document.body.appendChild(script)
  })
}

const FREE_LIMITS = [
  "3 proposals per month",
  "5 invoices per month",
  "5 clients total",
]

const PRO_FEATURES = [
  "Unlimited proposals",
  "Unlimited invoices",
  "Unlimited clients",
  "Online payments (Razorpay or Cashfree)",
  "AI proposal generation",
  "Priority support",
]

export function UpgradeModal({ onClose, reason }: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [status, setStatus] = useState<"idle" | "verifying" | "success">("idle")

  async function handleUpgrade() {
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/cashfree/subscription-order", {
        method: "POST",
      })
      const data = await res.json()

      if (!data.success) {
        if (data.missingPhone) {
          setError("Add your phone number in Settings → Profile, then come back here to upgrade. Cashfree requires it to process payments.")
        } else {
          setError(data.error || "Failed to start checkout")
        }
        setLoading(false)
        return
      }

      await loadCashfreeSdk()

      const cashfree = window.Cashfree({
        mode: process.env.NEXT_PUBLIC_CASHFREE_ENV === "sandbox" ? "sandbox" : "production",
      })

      const result = await cashfree.checkout({
        paymentSessionId: data.order.paymentSessionId,
        redirectTarget: "_modal",
      })

      if (result?.error) {
        setError("Payment was not completed.")
        setLoading(false)
        return
      }

      setStatus("verifying")

      const verifyRes = await fetch("/api/cashfree/subscription-verify", {
        method: "POST",
      })
      const verifyData = await verifyRes.json()

      if (verifyData.success) {
        setStatus("success")
        setTimeout(() => {
          window.location.reload()
        }, 1200)
      } else {
        setError(verifyData.error || "We couldn't confirm your payment yet. It may take a minute — refresh to check.")
        setStatus("idle")
        setLoading(false)
      }
    } catch {
      setError("Something went wrong. Please try again.")
      setStatus("idle")
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(12px)" }}
      onClick={onClose}
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
          className="px-6 py-5 flex items-start justify-between"
          style={{
            borderBottom: "0.5px solid var(--hairline)",
            background: "linear-gradient(to bottom, rgba(255,255,255,0.04), transparent)",
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "#ffffff", boxShadow: "var(--shadow-primary)" }}
            >
              <Zap className="w-5 h-5" style={{ color: "#0a0a0c" }} strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-[15px] font-semibold" style={{ color: "var(--text)" }}>
                Upgrade to Pro
              </p>
              <p className="text-[12px]" style={{ color: "var(--text-3)" }}>
                Unlock everything in Klivion
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors hover:bg-[rgba(255,255,255,0.06)]"
            style={{ color: "var(--text-3)" }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">

          {reason && (
            <div
              className="rounded-xl px-4 py-3 text-[13px]"
              style={{
                background: "var(--status-warning-bg)",
                border: "0.5px solid rgba(255,159,10,0.3)",
                color: "var(--status-warning)",
              }}
            >
              {reason}
            </div>
          )}

          {/* Price */}
          <div className="text-center py-2">
            <div className="flex items-baseline justify-center gap-1">
              <span
                className="text-[42px] font-bold"
                style={{ color: "var(--text)", letterSpacing: "-0.03em" }}
              >
                ₹499
              </span>
              <span className="text-[14px]" style={{ color: "var(--text-3)" }}>/month</span>
            </div>
            <p className="text-[12px] mt-1" style={{ color: "var(--text-3)" }}>
              Cancel anytime · No lock-in
            </p>
          </div>

          {/* Comparison */}
          <div className="grid grid-cols-2 gap-3">
            <div
              className="rounded-xl p-3"
              style={{ background: "var(--inset-fill)", border: "0.5px solid var(--hairline)" }}
            >
              <p
                className="text-[10px] font-semibold uppercase tracking-wider mb-2"
                style={{ color: "var(--text-3)", fontFamily: "var(--font-mono)" }}
              >
                Free
              </p>
              <ul className="space-y-1.5">
                {FREE_LIMITS.map(f => (
                  <li key={f} className="flex items-center gap-2 text-[11px]" style={{ color: "var(--text-3)" }}>
                    <div className="w-3 h-3 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: "rgba(255,255,255,0.06)" }}>
                      <span style={{ fontSize: "8px" }}>—</span>
                    </div>
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            <div
              className="rounded-xl p-3"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "0.5px solid var(--hairline-strong)",
              }}
            >
              <p
                className="text-[10px] font-semibold uppercase tracking-wider mb-2"
                style={{ color: "var(--text-2)", fontFamily: "var(--font-mono)" }}
              >
                Pro ✦
              </p>
              <ul className="space-y-1.5">
                {PRO_FEATURES.map(f => (
                  <li key={f} className="flex items-center gap-2 text-[11px]" style={{ color: "var(--text-2)" }}>
                    <div
                      className="w-3 h-3 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: "var(--status-success-bg)" }}
                    >
                      <Check className="w-2 h-2" style={{ color: "var(--status-success)" }} />
                    </div>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={handleUpgrade}
            disabled={loading}
            className="btn-primary w-full justify-center py-3 text-[14px] disabled:opacity-60"
          >
            {status === "verifying" ? (
              <>
                <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                Confirming payment...
              </>
            ) : status === "success" ? (
              <>
                <Check className="w-4 h-4" />
                Upgraded! Reloading...
              </>
            ) : loading ? (
              <>
                <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                Opening checkout...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                Pay ₹499 — Upgrade to Pro
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {error && (
            <p
              className="text-[12px] text-center px-3 py-2 rounded-lg"
              style={{ background: "var(--status-error-bg)", color: "var(--status-error)" }}
            >
              {error}
            </p>
          )}

          {/* Fallback instructions */}
          <div
            className="rounded-xl p-4 text-center"
            style={{ background: "var(--inset-fill)", border: "0.5px solid var(--hairline)" }}
          >
            <p className="text-[11px]" style={{ color: "var(--text-3)" }}>
              Trouble paying? Email a screenshot to{" "}
              <span style={{ color: "var(--text-2)", fontFamily: "var(--font-mono)" }}>{SUPPORT_EMAIL}</span>{" "}
              and we'll activate Pro manually within 24 hours.
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}
