"use client"

import { useState } from "react"

declare global {
  interface Window {
    Razorpay: any
    Cashfree: any
  }
}

// Cashfree's checkout SDK is loaded on demand (only when a freelancer
// uses Cashfree) to avoid adding weight for Razorpay-only users.
function loadCashfreeSdk(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.Cashfree) {
      resolve()
      return
    }
    const script = document.createElement("script")
    script.src = "https://sdk.cashfree.com/js/v3/cashfree.js"
    script.onload = () => resolve()
    script.onerror = () => reject(new Error("Failed to load Cashfree checkout"))
    document.body.appendChild(script)
  })
}

export function PayNowButton({
  invoiceId,
  amount,
  invoiceNumber,
}: {
  invoiceId: string
  amount: number
  invoiceNumber: string
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handlePay() {
    setLoading(true)
    setError("")

    try {
      // Step 1: Create order on our server — server decides Razorpay vs Cashfree
      // based on the freelancer's settings, so the client doesn't need to know
      // ahead of time.
      const res = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoiceId }),
      })

      const data = await res.json()

      if (!data.success) {
        setError(data.error || "Failed to initiate payment")
        setLoading(false)
        return
      }

      if (data.provider === "cashfree") {
        await handleCashfreeCheckout(data)
      } else {
        handleRazorpayCheckout(data)
      }
    } catch {
      setError("Something went wrong. Please try again.")
      setLoading(false)
    }
  }

  async function handleCashfreeCheckout(data: {
    order: { id: string; paymentSessionId: string }
  }) {
    try {
      await loadCashfreeSdk()

      const cashfree = window.Cashfree({
        mode: process.env.NEXT_PUBLIC_CASHFREE_ENV === "sandbox" ? "sandbox" : "production",
      })

      const checkoutOptions = {
        paymentSessionId: data.order.paymentSessionId,
        redirectTarget: "_modal", // open in-page modal instead of full redirect
      }

      const result = await cashfree.checkout(checkoutOptions)

      // result.error -> user closed/cancelled, result.paymentDetails -> success
      if (result?.error) {
        setError("Payment was not completed.")
        setLoading(false)
        return
      }

      // Verify server-side regardless of client result (never trust client alone)
      const verifyRes = await fetch("/api/razorpay/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoiceId, provider: "cashfree" }),
      })

      const verifyData = await verifyRes.json()

      if (verifyData.success) {
        window.location.reload()
      } else {
        setError(verifyData.error || "Payment verification failed. Please refresh to check status.")
        setLoading(false)
      }
    } catch {
      setError("Cashfree checkout failed to load. Please try again.")
      setLoading(false)
    }
  }

  function handleRazorpayCheckout(data: {
    order: { id: string; amount: number; currency: string }
    keyId: string
  }) {
    const options = {
      key: data.keyId,
      amount: data.order.amount,
      currency: data.order.currency,
      name: "Klivion",
      description: `Payment for ${invoiceNumber}`,
      order_id: data.order.id,

      handler: async function (response: {
        razorpay_order_id: string
        razorpay_payment_id: string
        razorpay_signature: string
      }) {
        try {
          const verifyRes = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              invoiceId,
              provider: "razorpay",
            }),
          })

          const verifyData = await verifyRes.json()

          if (verifyData.success) {
            window.location.reload()
          } else {
            setError("Payment verification failed. Contact support.")
          }
        } catch {
          setError("Verification failed. Please contact support.")
        }
      },

      prefill: {
        name: "",
        email: "",
      },

      theme: { color: "#000000" },

      modal: {
        ondismiss: () => {
          setLoading(false)
        },
      },
    }

    const rzp = new window.Razorpay(options)

    rzp.on("payment.failed", function (response: any) {
      setError(`Payment failed: ${response.error.description}`)
      setLoading(false)
    })

    rzp.open()
  }

  return (
    <div>
      <button
        onClick={handlePay}
        disabled={loading}
        className="w-full bg-primary text-primary-foreground py-3 px-8 rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors flex items-center justify-center gap-2 text-base"
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Opening payment...
          </>
        ) : (
          <>
            💳 Pay ₹{amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })} Now
          </>
        )}
      </button>
      {error && (
        <p className="text-sm text-red-500 mt-3 text-center bg-red-50 border border-red-200 rounded-lg p-2">
          {error}
        </p>
      )}
      <p className="text-xs text-muted-foreground mt-3 text-center">
        🔒 Secure payment · Supports UPI, Cards, Net Banking
      </p>
    </div>
  )
}
