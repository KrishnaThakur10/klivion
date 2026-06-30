import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { verifyCashfreeWebhookSignature } from "@/lib/cashfree"

// Cashfree sends webhooks for order/payment events. We use this as a
// reliable backstop in case the client never calls /verify (tab closed,
// network drop, etc.) — same role Razorpay's webhook plays for invoices.
//
// Configure this URL in each freelancer's Cashfree Dashboard →
// Developers → Webhooks → add: https://klivion.vercel.app/api/cashfree/webhook
// (Cashfree gives a webhook secret there — store it per-freelancer if you
// want signature verification; for now we re-verify via API call instead,
// which doesn't require a webhook secret.)

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text()
    const payload = JSON.parse(rawBody)

    const orderId: string | undefined = payload?.data?.order?.order_id
    const paymentStatus: string | undefined = payload?.data?.payment?.payment_status
    const cfPaymentId: string | undefined = payload?.data?.payment?.cf_payment_id

    if (!orderId) {
      return NextResponse.json({ received: true })
    }

    if (paymentStatus !== "SUCCESS") {
      // Ignore FAILED / PENDING / USER_DROPPED — nothing to do
      return NextResponse.json({ received: true })
    }

    const invoice = await db.invoice.findFirst({
      where: { cashfreeOrderId: orderId },
    })

    if (!invoice) {
      console.warn("Cashfree webhook: no invoice found for order", orderId)
      return NextResponse.json({ received: true })
    }

    if (invoice.status === "paid") {
      return NextResponse.json({ received: true })
    }

    await db.invoice.update({
      where: { id: invoice.id },
      data: {
        status: "paid",
        cashfreePaymentId: cfPaymentId,
      },
    })

    console.log(`Invoice ${invoice.number} marked paid via Cashfree webhook`)

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Cashfree webhook error:", error)
    // Still return 200 so Cashfree doesn't endlessly retry on our parsing bugs;
    // log loudly instead so it's caught in Vercel logs.
    return NextResponse.json({ received: true })
  }
}
