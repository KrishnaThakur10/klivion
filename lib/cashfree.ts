// lib/cashfree.ts
//
// Thin wrapper around Cashfree's Payment Gateway REST API.
// Cashfree has no official lightweight SDK for Node like Razorpay does,
// so we call their REST API directly with fetch.
//
// Docs: https://docs.cashfree.com/docs/payment-gateway

const CASHFREE_API_VERSION = "2023-08-01"

function getBaseUrl() {
  // Use sandbox unless explicitly told this is a production (live) credential pair.
  // Freelancers/your own account paste in their own App ID + Secret Key from
  // either the Sandbox or Live Cashfree dashboard — the keys themselves
  // determine sandbox vs live on Cashfree's side, so we always hit api.cashfree.com
  // and let Cashfree route based on the key. (Sandbox keys -> sandbox responses.)
  return process.env.CASHFREE_ENV === "sandbox"
    ? "https://sandbox.cashfree.com/pg"
    : "https://api.cashfree.com/pg"
}

type CashfreeOrderParams = {
  appId: string
  secretKey: string
  orderId: string
  orderAmount: number
  orderCurrency?: string
  customerName: string
  customerEmail: string
  customerPhone: string
  returnUrl?: string
  notifyUrl?: string
  orderNote?: string
}

export async function createCashfreeOrder(params: CashfreeOrderParams) {
  const res = await fetch(`${getBaseUrl()}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-version": CASHFREE_API_VERSION,
      "x-client-id": params.appId,
      "x-client-secret": params.secretKey,
    },
    body: JSON.stringify({
      order_id: params.orderId,
      order_amount: params.orderAmount,
      order_currency: params.orderCurrency ?? "INR",
      customer_details: {
        customer_id: params.orderId, // Cashfree requires a customer_id; order_id is fine as a stand-in
        customer_name: params.customerName || "Customer",
        customer_email: params.customerEmail || "no-reply@klivion.app",
        customer_phone: params.customerPhone || "9999999999",
      },
      order_meta: {
        return_url: params.returnUrl,
        notify_url: params.notifyUrl,
      },
      order_note: params.orderNote,
    }),
  })

  const data = await res.json()

  if (!res.ok) {
    console.error("Cashfree order creation failed:", data)
    throw new Error(data?.message || "Failed to create Cashfree order")
  }

  // payment_session_id is what the frontend SDK uses to open checkout
  return data as {
    order_id: string
    payment_session_id: string
    order_status: string
  }
}

export async function fetchCashfreeOrder(params: {
  appId: string
  secretKey: string
  orderId: string
}) {
  const res = await fetch(`${getBaseUrl()}/orders/${params.orderId}`, {
    method: "GET",
    headers: {
      "x-api-version": CASHFREE_API_VERSION,
      "x-client-id": params.appId,
      "x-client-secret": params.secretKey,
    },
  })

  const data = await res.json()

  if (!res.ok) {
    console.error("Cashfree order fetch failed:", data)
    throw new Error(data?.message || "Failed to fetch Cashfree order")
  }

  return data as {
    order_id: string
    order_status: "ACTIVE" | "PAID" | "EXPIRED" | "TERMINATED"
    order_amount: number
    cf_order_id: string
  }
}

export async function fetchCashfreeOrderPayments(params: {
  appId: string
  secretKey: string
  orderId: string
}) {
  const res = await fetch(`${getBaseUrl()}/orders/${params.orderId}/payments`, {
    method: "GET",
    headers: {
      "x-api-version": CASHFREE_API_VERSION,
      "x-client-id": params.appId,
      "x-client-secret": params.secretKey,
    },
  })

  const data = await res.json()

  if (!res.ok) {
    console.error("Cashfree payments fetch failed:", data)
    throw new Error(data?.message || "Failed to fetch Cashfree payments")
  }

  return data as Array<{
    cf_payment_id: string
    payment_status: "SUCCESS" | "FAILED" | "PENDING" | "NOT_ATTEMPTED" | "USER_DROPPED"
    payment_amount: number
  }>
}

// Verifies a Cashfree webhook's signature.
// Cashfree signs: timestamp + rawBody, using HMAC-SHA256 with your webhook secret,
// base64-encoded. Header names: x-webhook-signature, x-webhook-timestamp.
export function verifyCashfreeWebhookSignature(params: {
  rawBody: string
  timestamp: string
  signature: string
  secretKey: string
}): boolean {
  const crypto = require("crypto") as typeof import("crypto")
  const expected = crypto
    .createHmac("sha256", params.secretKey)
    .update(params.timestamp + params.rawBody)
    .digest("base64")

  return expected === params.signature
}
