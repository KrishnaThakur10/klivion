"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { updateSettings } from "@/app/actions/settings"
import {
  Zap, ArrowRight, Building2, Phone,
  Globe, MapPin, CreditCard, Eye, EyeOff,
  CheckCircle2, X
} from "lucide-react"

const TOTAL_STEPS = 3

export function OnboardingModal({ userName }: { userName: string }) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState("")

  // Step 2 fields
  const [businessName, setBusinessName] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [website, setWebsite] = useState("")

  // Step 3 fields
  const [razorpayKeyId, setRazorpayKeyId] = useState("")
  const [razorpaySecret, setRazorpaySecret] = useState("")
  const [showSecret, setShowSecret] = useState(false)

  const firstName = userName.split(" ")[0] ?? "there"

  function handleNext() {
    setError("")
    if (step < TOTAL_STEPS) {
      setStep(s => s + 1)
    }
  }

  function handleFinish() {
    setError("")
    startTransition(async () => {
      const result = await updateSettings({
        businessName: businessName || undefined,
        phone: phone || undefined,
        address: address || undefined,
        website: website || undefined,
        razorpayKeyId: razorpayKeyId || undefined,
        razorpaySecret: razorpaySecret || undefined,
      })
      if (result?.error) {
        setError(result.error)
      } else {
        router.refresh()
      }
    })
  }

  function handleSkipToFinish() {
    // Skip Razorpay step — save what we have so far and dismiss
    handleFinish()
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        background: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "480px",
          background: "#121215",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "20px",
          overflow: "hidden",
          boxShadow: "0 32px 64px -16px rgba(0,0,0,0.8)",
          animation: "float-in 400ms cubic-bezier(0.32,0.72,0,1) both",
        }}
      >
        {/* Progress bar */}
        <div style={{ height: "2px", background: "rgba(255,255,255,0.06)" }}>
          <div
            style={{
              height: "100%",
              background: "#f5f5f7",
              borderRadius: "2px",
              transition: "width 400ms cubic-bezier(0.32,0.72,0,1)",
              width: `${(step / TOTAL_STEPS) * 100}%`,
            }}
          />
        </div>

        <div style={{ padding: "32px" }}>

          {/* Step indicator */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "28px",
            }}
          >
            <div style={{ display: "flex", gap: "6px" }}>
              {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: i + 1 === step ? "20px" : "6px",
                    height: "6px",
                    borderRadius: "3px",
                    background: i + 1 <= step ? "#f5f5f7" : "rgba(255,255,255,0.12)",
                    transition: "all 300ms cubic-bezier(0.32,0.72,0,1)",
                  }}
                />
              ))}
            </div>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "10px",
                color: "#6e6e73",
                letterSpacing: "0.08em",
              }}
            >
              {step}/{TOTAL_STEPS}
            </span>
          </div>

          {/* ── STEP 1: Welcome ── */}
          {step === 1 && (
            <div style={{ animation: "float-in 300ms cubic-bezier(0.32,0.72,0,1) both" }}>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "14px",
                  background: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "24px",
                  boxShadow: "0 8px 24px -8px rgba(255,255,255,0.3)",
                }}
              >
                <Zap style={{ width: "22px", height: "22px", color: "#0a0a0c" }} strokeWidth={2.5} />
              </div>

              <h2
                style={{
                  fontFamily: "Manrope, sans-serif",
                  fontSize: "22px",
                  fontWeight: 800,
                  color: "#f5f5f7",
                  letterSpacing: "-0.03em",
                  marginBottom: "10px",
                  lineHeight: 1.2,
                }}
              >
                Welcome to Klivion, {firstName}
              </h2>
              <p
                style={{
                  fontFamily: "Manrope, sans-serif",
                  fontSize: "14px",
                  color: "#a1a1a6",
                  lineHeight: 1.6,
                  marginBottom: "32px",
                }}
              >
                You're two minutes away from sending your first proposal. Let's set up your account.
              </p>

              {/* What you'll get */}
              <div
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: "12px",
                  padding: "20px",
                  marginBottom: "28px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                {[
                  { icon: "📄", text: "Create and send professional proposals" },
                  { icon: "🧾", text: "Invoice clients and track payments" },
                  { icon: "💳", text: "Accept payments directly via Razorpay" },
                  { icon: "✨", text: "Generate proposals with AI in seconds" },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{ fontSize: "16px", flexShrink: 0 }}>{item.icon}</span>
                    <span
                      style={{
                        fontFamily: "Manrope, sans-serif",
                        fontSize: "13px",
                        color: "#a1a1a6",
                      }}
                    >
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={handleNext}
                className="btn-primary"
                style={{ width: "100%", justifyContent: "center", padding: "12px" }}
              >
                Get started
                <ArrowRight style={{ width: "14px", height: "14px" }} />
              </button>
            </div>
          )}

          {/* ── STEP 2: Business Details ── */}
          {step === 2 && (
            <div style={{ animation: "float-in 300ms cubic-bezier(0.32,0.72,0,1) both" }}>
              <h2
                style={{
                  fontFamily: "Manrope, sans-serif",
                  fontSize: "20px",
                  fontWeight: 800,
                  color: "#f5f5f7",
                  letterSpacing: "-0.03em",
                  marginBottom: "6px",
                }}
              >
                Your business details
              </h2>
              <p
                style={{
                  fontFamily: "Manrope, sans-serif",
                  fontSize: "13px",
                  color: "#6e6e73",
                  marginBottom: "24px",
                  lineHeight: 1.5,
                }}
              >
                These appear on your proposals and invoices. You can edit them anytime in Settings.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "28px" }}>

                <div>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      fontFamily: "Manrope, sans-serif",
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "#a1a1a6",
                      marginBottom: "6px",
                    }}
                  >
                    <Building2 style={{ width: "12px", height: "12px" }} />
                    Business / Freelancer name
                  </label>
                  <input
                    className="ui-input"
                    type="text"
                    placeholder="e.g. Rahul Design Studio"
                    value={businessName}
                    onChange={e => setBusinessName(e.target.value)}
                    autoFocus
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      fontFamily: "Manrope, sans-serif",
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "#a1a1a6",
                      marginBottom: "6px",
                    }}
                  >
                    <Phone style={{ width: "12px", height: "12px" }} />
                    Phone number
                  </label>
                  <input
                    className="ui-input"
                    type="tel"
                    placeholder="e.g. +91 98765 43210"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      fontFamily: "Manrope, sans-serif",
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "#a1a1a6",
                      marginBottom: "6px",
                    }}
                  >
                    <Globe style={{ width: "12px", height: "12px" }} />
                    Website <span style={{ color: "#6e6e73", fontWeight: 400 }}>(optional)</span>
                  </label>
                  <input
                    className="ui-input"
                    type="url"
                    placeholder="e.g. https://yoursite.com"
                    value={website}
                    onChange={e => setWebsite(e.target.value)}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      fontFamily: "Manrope, sans-serif",
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "#a1a1a6",
                      marginBottom: "6px",
                    }}
                  >
                    <MapPin style={{ width: "12px", height: "12px" }} />
                    Address <span style={{ color: "#6e6e73", fontWeight: 400 }}>(optional)</span>
                  </label>
                  <input
                    className="ui-input"
                    type="text"
                    placeholder="e.g. Mumbai, Maharashtra"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={() => setStep(1)}
                  className="btn-ghost"
                  style={{ flex: 1, justifyContent: "center", padding: "12px" }}
                >
                  Back
                </button>
                <button
                  onClick={handleNext}
                  className="btn-primary"
                  style={{ flex: 2, justifyContent: "center", padding: "12px" }}
                >
                  Continue
                  <ArrowRight style={{ width: "14px", height: "14px" }} />
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 3: Razorpay ── */}
          {step === 3 && (
            <div style={{ animation: "float-in 300ms cubic-bezier(0.32,0.72,0,1) both" }}>
              <h2
                style={{
                  fontFamily: "Manrope, sans-serif",
                  fontSize: "20px",
                  fontWeight: 800,
                  color: "#f5f5f7",
                  letterSpacing: "-0.03em",
                  marginBottom: "6px",
                }}
              >
                Connect Razorpay
              </h2>
              <p
                style={{
                  fontFamily: "Manrope, sans-serif",
                  fontSize: "13px",
                  color: "#6e6e73",
                  marginBottom: "6px",
                  lineHeight: 1.5,
                }}
              >
                Add your Razorpay API keys to accept online payments from clients. Money goes directly to your account.
              </p>
              <a
                href="https://dashboard.razorpay.com/app/keys"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: "Manrope, sans-serif",
                  fontSize: "12px",
                  color: "#a1a1a6",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  marginBottom: "24px",
                }}
              >
                Find your keys at dashboard.razorpay.com →
              </a>

              <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "16px" }}>
                <div>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      fontFamily: "Manrope, sans-serif",
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "#a1a1a6",
                      marginBottom: "6px",
                    }}
                  >
                    <CreditCard style={{ width: "12px", height: "12px" }} />
                    Key ID
                  </label>
                  <input
                    className="ui-input"
                    type="text"
                    placeholder="rzp_live_..."
                    value={razorpayKeyId}
                    onChange={e => setRazorpayKeyId(e.target.value)}
                    style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "13px" }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      fontFamily: "Manrope, sans-serif",
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "#a1a1a6",
                      marginBottom: "6px",
                    }}
                  >
                    <CreditCard style={{ width: "12px", height: "12px" }} />
                    Key Secret
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      className="ui-input"
                      type={showSecret ? "text" : "password"}
                      placeholder="Your secret key"
                      value={razorpaySecret}
                      onChange={e => setRazorpaySecret(e.target.value)}
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: "13px",
                        paddingRight: "40px",
                      }}
                    />
                    <button
                      onClick={() => setShowSecret(s => !s)}
                      type="button"
                      style={{
                        position: "absolute",
                        right: "12px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: "2px",
                        color: "#6e6e73",
                      }}
                    >
                      {showSecret
                        ? <EyeOff style={{ width: "14px", height: "14px" }} />
                        : <Eye style={{ width: "14px", height: "14px" }} />
                      }
                    </button>
                  </div>
                </div>
              </div>

              {/* Pro plan notice */}
              <div
                style={{
                  background: "rgba(255,159,10,0.06)",
                  border: "1px solid rgba(255,159,10,0.15)",
                  borderRadius: "8px",
                  padding: "10px 14px",
                  marginBottom: "24px",
                }}
              >
                <p
                  style={{
                    fontFamily: "Manrope, sans-serif",
                    fontSize: "12px",
                    color: "#ff9f0a",
                    margin: 0,
                    lineHeight: 1.5,
                  }}
                >
                  Online payments require the Pro plan (₹499/month). You can add your keys now and upgrade later.
                </p>
              </div>

              {error && (
                <p
                  style={{
                    fontFamily: "Manrope, sans-serif",
                    fontSize: "12px",
                    color: "#ff453a",
                    marginBottom: "16px",
                    background: "rgba(255,69,58,0.08)",
                    border: "1px solid rgba(255,69,58,0.15)",
                    borderRadius: "8px",
                    padding: "10px 14px",
                  }}
                >
                  {error}
                </p>
              )}

              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={() => setStep(2)}
                  className="btn-ghost"
                  style={{ flex: 1, justifyContent: "center", padding: "12px" }}
                  disabled={isPending}
                >
                  Back
                </button>
                <button
                  onClick={handleSkipToFinish}
                  className="btn-ghost"
                  style={{ flex: 1, justifyContent: "center", padding: "12px" }}
                  disabled={isPending}
                >
                  Skip
                </button>
                <button
                  onClick={handleFinish}
                  disabled={isPending || !razorpayKeyId || !razorpaySecret}
                  className="btn-primary"
                  style={{ flex: 2, justifyContent: "center", padding: "12px" }}
                >
                  {isPending ? (
                    <>
                      <div
                        style={{
                          width: "14px",
                          height: "14px",
                          border: "2px solid rgba(0,0,0,0.2)",
                          borderTopColor: "#0a0a0c",
                          borderRadius: "50%",
                          animation: "spin 0.6s linear infinite",
                        }}
                      />
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 style={{ width: "14px", height: "14px" }} />
                      Finish setup
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}