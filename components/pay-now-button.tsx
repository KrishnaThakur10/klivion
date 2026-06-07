"use client"

import { useState } from "react"

declare global {
  interface Window {
    Razorpay: any
  }
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
      // Step 1: Create Razorpay order on our server
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

      // Step 2: Open Razorpay checkout
      const options = {
        key: data.keyId,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "Proposely",
        description: `Payment for ${invoiceNumber}`,
        order_id: data.order.id,

        // Step 3: Verify payment after user pays
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
              }),
            })

            const verifyData = await verifyRes.json()

            if (verifyData.success) {
              // Payment verified — reload page to show paid status
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
    } catch {
      setError("Something went wrong. Please try again.")
      setLoading(false)
    }
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
        🔒 Secured by Razorpay · Supports UPI, Cards, Net Banking
      </p>
    </div>
  )
}