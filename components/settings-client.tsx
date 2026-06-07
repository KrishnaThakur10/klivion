"use client"

import { useState, useTransition } from "react"
import { updateSettings } from "@/app/actions/settings"
import {
  User, Building2, Phone, Globe,
  CreditCard, Eye, EyeOff, CheckCircle, Save
} from "lucide-react"

type Settings = {
  businessName?: string | null
  phone?: string | null
  address?: string | null
  website?: string | null
  razorpayKeyId?: string | null
  razorpaySecret?: string | null
} | null

export function SettingsClient({
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
  const [businessName, setBusinessName] = useState(initialSettings?.businessName ?? "")
  const [phone, setPhone] = useState(initialSettings?.phone ?? "")
  const [address, setAddress] = useState(initialSettings?.address ?? "")
  const [website, setWebsite] = useState(initialSettings?.website ?? "")
  const [razorpayKeyId, setRazorpayKeyId] = useState(initialSettings?.razorpayKeyId ?? "")
  const [razorpaySecret, setRazorpaySecret] = useState(initialSettings?.razorpaySecret ?? "")
  const [showSecret, setShowSecret] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState("")
  const [isPending, startTransition] = useTransition()

  function handleSave() {
    setError("")
    setSaved(false)
    startTransition(async () => {
      const result = await updateSettings({
        businessName,
        phone,
        address,
        website,
        razorpayKeyId,
        razorpaySecret,
      })
      if (result?.error) {
        setError(result.error)
      } else {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      }
    })
  }

  return (
    <div className="space-y-6">

      {/* Profile Card */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="font-semibold mb-4 flex items-center gap-2">
          <User className="w-4 h-4" /> Profile
        </h2>
        <div className="flex items-center gap-4 mb-6 p-4 bg-muted/30 rounded-lg">
          {userImage ? (
            <img src={userImage} alt={userName}
              className="w-14 h-14 rounded-full object-cover" />
          ) : (
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-xl font-bold text-primary">
              {userName.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <p className="font-semibold text-lg">{userName}</p>
            <p className="text-sm text-muted-foreground">{userEmail}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Connected via GitHub
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5" /> Business Name
            </label>
            <input
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="Your Business / Freelance Name"
              className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block flex items-center gap-1">
              <Phone className="w-3.5 h-3.5" /> Phone
            </label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="text-sm font-medium mb-1 block">Address</label>
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Your city, state"
              className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="text-sm font-medium mb-1 block flex items-center gap-1">
              <Globe className="w-3.5 h-3.5" /> Website
            </label>
            <input
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://yourwebsite.com"
              className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </div>

      {/* Razorpay Connect Card */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="font-semibold mb-1 flex items-center gap-2">
          <CreditCard className="w-4 h-4" /> Connect Razorpay
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Connect your Razorpay account so your clients can pay invoices directly to you.
          Your keys are stored securely and never shared.
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <p className="text-xs text-blue-700 font-medium mb-1">How to get your keys:</p>
          <ol className="text-xs text-blue-600 space-y-0.5 list-decimal list-inside">
            <li>Go to razorpay.com → Sign up / Login</li>
            <li>Settings → API Keys → Websites & API Keys</li>
            <li>Generate Test Key (for testing) or Live Key (for real payments)</li>
            <li>Copy Key ID and Key Secret below</li>
          </ol>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">
              Razorpay Key ID
            </label>
            <input
              value={razorpayKeyId}
              onChange={(e) => setRazorpayKeyId(e.target.value)}
              placeholder="rzp_test_xxxxxxxxxx"
              className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary font-mono"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">
              Razorpay Key Secret
            </label>
            <div className="relative">
              <input
                value={razorpaySecret}
                onChange={(e) => setRazorpaySecret(e.target.value)}
                type={showSecret ? "text" : "password"}
                placeholder="••••••••••••••••"
                className="w-full border border-border rounded-lg px-3 py-2 pr-10 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary font-mono"
              />
              <button
                type="button"
                onClick={() => setShowSecret(!showSecret)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showSecret
                  ? <EyeOff className="w-4 h-4" />
                  : <Eye className="w-4 h-4" />
                }
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              🔒 Stored encrypted. Never visible to clients or other users.
            </p>
          </div>

          {razorpayKeyId && (
            <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg p-3">
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              Razorpay connected — clients can now pay your invoices online
            </div>
          )}
        </div>
      </div>

      {/* Save Button */}
      {error && (
        <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg p-3">
          {error}
        </p>
      )}

      <button
        onClick={handleSave}
        disabled={isPending}
        className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
      >
        {saved ? (
          <>
            <CheckCircle className="w-4 h-4" />
            Settings Saved!
          </>
        ) : isPending ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Save className="w-4 h-4" />
            Save Settings
          </>
        )}
      </button>

    </div>
  )
}