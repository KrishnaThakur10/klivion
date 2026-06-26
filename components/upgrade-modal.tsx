"use client"

import { X, Zap, Check, ArrowRight } from "lucide-react"

type Props = {
  onClose: () => void
  reason?: string
}

// ── Replace this with your actual Razorpay payment link ──
// Go to Razorpay Dashboard → Payment Links → Create → ₹499 → Copy link
const RAZORPAY_PAYMENT_LINK = "https://rzp.io/l/YOUR_LINK_HERE"
const SUPPORT_EMAIL = "klivion.support@gmail.com"

const FREE_LIMITS = [
  "3 proposals per month",
  "5 invoices per month",
  "5 clients total",
]

const PRO_FEATURES = [
  "Unlimited proposals",
  "Unlimited invoices",
  "Unlimited clients",
  "Online payments via Razorpay",
  "AI proposal generation",
  "Priority support",
]

export function UpgradeModal({ onClose, reason }: Props) {
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

          {/* Reason banner */}
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
            {/* Free */}
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

            {/* Pro */}
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
          <a
            href={RAZORPAY_PAYMENT_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary w-full justify-center py-3 text-[14px]"
            onClick={onClose}
          >
            <Zap className="w-4 h-4" />
            Pay ₹499 — Upgrade to Pro
            <ArrowRight className="w-4 h-4" />
          </a>

          {/* After payment instructions */}
          <div
            className="rounded-xl p-4 text-center"
            style={{ background: "var(--inset-fill)", border: "0.5px solid var(--hairline)" }}
          >
            <p className="text-[12px] font-medium mb-1" style={{ color: "var(--text-2)" }}>
              After payment
            </p>
            <p className="text-[11px] mb-2" style={{ color: "var(--text-3)" }}>
              Send your payment screenshot to:
            </p>
            <p
              className="text-[13px] font-semibold"
              style={{ color: "var(--text)", fontFamily: "var(--font-mono)" }}
            >
              {SUPPORT_EMAIL}
            </p>
            <p className="text-[11px] mt-2" style={{ color: "var(--text-3)" }}>
              We'll activate Pro within 24 hours ⚡
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}