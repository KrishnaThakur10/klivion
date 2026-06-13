"use client"

import { useState, useTransition } from "react"
import { updateSettings } from "@/app/actions/settings"
import {
  User, Building2, Phone, Globe, MapPin,
  CreditCard, Eye, EyeOff, CheckCircle2, Save
} from "lucide-react"

type Settings = {
  businessName: string
  phone: string
  address: string
  website: string
  razorpayKeyId: string
  razorpaySecret: string
}

export function SettingsPage({
  initialSettings,
  userName,
  userEmail,
  userImage,
}: {
  initialSettings: Settings
  userName: string
  userEmail: string
  userImage: string | null
}) {
  const [businessName, setBusinessName] = useState(initialSettings.businessName)
  const [phone, setPhone] = useState(initialSettings.phone)
  const [address, setAddress] = useState(initialSettings.address)
  const [website, setWebsite] = useState(initialSettings.website)
  const [razorpayKeyId, setRazorpayKeyId] = useState(initialSettings.razorpayKeyId)
  const [razorpaySecret, setRazorpaySecret] = useState(initialSettings.razorpaySecret)
  const [showSecret, setShowSecret] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState("")
  const [isPending, startTransition] = useTransition()

  function handleSave() {
    setError("")
    setSaved(false)
    startTransition(async () => {
      const result = await updateSettings({
        businessName, phone, address, website,
        razorpayKeyId, razorpaySecret,
      })
      if (result?.error) {
        setError(result.error)
      } else {
        setSaved(true)
        setTimeout(() => setSaved(false), 2500)
      }
    })
  }

  return (
    <div className="flex flex-col min-h-full" style={{ background: "var(--bg)" }}>

      {/* Header */}
      <header
        className="h-14 flex items-center justify-between px-4 md:px-8 shrink-0"
        style={{ borderBottom: "0.5px solid var(--hairline)" }}
      >
        <span className="text-[15px] font-semibold" style={{ color: "var(--text)" }}>Settings</span>
        <button onClick={handleSave} disabled={isPending} className="btn-primary">
          {saved ? (
            <><CheckCircle2 className="w-3.5 h-3.5" /> Saved</>
          ) : isPending ? (
            "Saving..."
          ) : (
            <><Save className="w-3.5 h-3.5" /> Save</>
          )}
        </button>
      </header>

      <div className="flex-1 p-4 md:p-8 max-w-[680px] w-full mx-auto space-y-5">

        {error && (
          <p className="text-[12px] px-3 py-2 rounded-lg"
            style={{ color: "var(--status-error)", background: "var(--status-error-bg)", border: "0.5px solid var(--status-error)" }}>
            {error}
          </p>
        )}

        {/* Profile card */}
        <div
          className="rounded-2xl p-5"
          style={{ background: "var(--bg-grid)", border: "0.5px solid var(--hairline)", boxShadow: "var(--shadow-panel)" }}
        >
          <div className="flex items-center gap-2 mb-4">
            <User className="w-4 h-4" style={{ color: "var(--text-3)" }} />
            <p className="text-[13px] font-semibold" style={{ color: "var(--text)" }}>Profile</p>
          </div>

          <div
            className="flex items-center gap-3 mb-5 p-3 rounded-xl"
            style={{ background: "var(--inset-fill)", border: "0.5px solid var(--hairline)" }}
          >
            {userImage ? (
              <img src={userImage} alt={userName}
                className="w-11 h-11 rounded-full object-cover"
                style={{ border: "0.5px solid var(--hairline-strong)" }} />
            ) : (
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center text-[16px] font-bold"
                style={{ background: "rgba(255,255,255,0.08)", color: "var(--text-2)" }}
              >
                {userName.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="min-w-0">
              <p className="text-[14px] font-semibold truncate" style={{ color: "var(--text)" }}>{userName}</p>
              <p className="text-[12px] truncate" style={{ color: "var(--text-3)" }}>{userEmail}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="flex items-center gap-1.5 mb-1.5 text-[11px] font-semibold uppercase tracking-wider"
                style={{ color: "var(--text-3)", fontFamily: "var(--font-mono)" }}>
                <Building2 className="w-3 h-3" /> Business name
              </label>
              <input
                value={businessName}
                onChange={e => setBusinessName(e.target.value)}
                placeholder="Your Business / Freelance Name"
                className="ui-input"
              />
            </div>
            <div>
              <label className="flex items-center gap-1.5 mb-1.5 text-[11px] font-semibold uppercase tracking-wider"
                style={{ color: "var(--text-3)", fontFamily: "var(--font-mono)" }}>
                <Phone className="w-3 h-3" /> Phone
              </label>
              <input
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="ui-input"
              />
            </div>
            <div className="md:col-span-2">
              <label className="flex items-center gap-1.5 mb-1.5 text-[11px] font-semibold uppercase tracking-wider"
                style={{ color: "var(--text-3)", fontFamily: "var(--font-mono)" }}>
                <MapPin className="w-3 h-3" /> Address
              </label>
              <input
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder="Your city, state"
                className="ui-input"
              />
            </div>
            <div className="md:col-span-2">
              <label className="flex items-center gap-1.5 mb-1.5 text-[11px] font-semibold uppercase tracking-wider"
                style={{ color: "var(--text-3)", fontFamily: "var(--font-mono)" }}>
                <Globe className="w-3 h-3" /> Website
              </label>
              <input
                value={website}
                onChange={e => setWebsite(e.target.value)}
                placeholder="https://yourwebsite.com"
                className="ui-input"
              />
            </div>
          </div>
        </div>

        {/* Razorpay card */}
        <div
          className="rounded-2xl p-5"
          style={{ background: "var(--bg-grid)", border: "0.5px solid var(--hairline)", boxShadow: "var(--shadow-panel)" }}
        >
          <div className="flex items-center gap-2 mb-1">
            <CreditCard className="w-4 h-4" style={{ color: "var(--text-3)" }} />
            <p className="text-[13px] font-semibold" style={{ color: "var(--text)" }}>Connect Razorpay</p>
          </div>
          <p className="text-[12px] mb-4" style={{ color: "var(--text-3)" }}>
            Connect your Razorpay account so clients can pay your invoices directly. Keys are stored securely.
          </p>

          <div
            className="rounded-xl p-3 mb-4"
            style={{ background: "var(--inset-fill)", border: "0.5px solid var(--hairline)" }}
          >
            <p className="text-[11px] font-semibold uppercase tracking-wider mb-1.5"
              style={{ color: "var(--text-3)", fontFamily: "var(--font-mono)" }}>
              How to get your keys
            </p>
            <ol className="text-[12px] space-y-0.5 list-decimal list-inside" style={{ color: "var(--text-2)" }}>
              <li>Go to razorpay.com → Sign up / Login</li>
              <li>Settings → API Keys → Websites & API Keys</li>
              <li>Generate Test Key (or Live Key for real payments)</li>
              <li>Copy Key ID and Key Secret below</li>
            </ol>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block mb-1.5 text-[11px] font-semibold uppercase tracking-wider"
                style={{ color: "var(--text-3)", fontFamily: "var(--font-mono)" }}>
                Razorpay Key ID
              </label>
              <input
                value={razorpayKeyId}
                onChange={e => setRazorpayKeyId(e.target.value)}
                placeholder="rzp_test_xxxxxxxxxx"
                className="ui-input"
                style={{ fontFamily: "var(--font-mono)" }}
              />
            </div>
            <div>
              <label className="block mb-1.5 text-[11px] font-semibold uppercase tracking-wider"
                style={{ color: "var(--text-3)", fontFamily: "var(--font-mono)" }}>
                Razorpay Key Secret
              </label>
              <div className="relative">
                <input
                  value={razorpaySecret}
                  onChange={e => setRazorpaySecret(e.target.value)}
                  type={showSecret ? "text" : "password"}
                  placeholder="••••••••••••••••"
                  className="ui-input pr-10"
                  style={{ fontFamily: "var(--font-mono)" }}
                />
                <button
                  type="button"
                  onClick={() => setShowSecret(!showSecret)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: "var(--text-3)" }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "var(--text-2)")}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = "var(--text-3)")}
                >
                  {showSecret ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
              <p className="text-[11px] mt-1.5" style={{ color: "var(--text-3)" }}>
                🔒 Stored securely. Never visible to clients.
              </p>
            </div>

            {razorpayKeyId && (
              <div
                className="flex items-center gap-2 text-[12px] px-3 py-2.5 rounded-lg"
                style={{ background: "var(--status-success-bg)", color: "var(--status-success)", border: "0.5px solid rgba(48,209,88,0.25)" }}
              >
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                Razorpay connected — clients can pay your invoices online
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}