import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

// Backstop for the subscription flow: if the client never calls
// /api/cashfree/subscription-verify (tab closed, network drop, etc.),
// this webhook still upgrades the user once Cashfree confirms payment.
//
// Configure in YOUR Cashfree Dashboard (Klivion's own account) →
// Developers → Webhooks → add:
// https://klivion.vercel.app/api/cashfree/subscription-webhook

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text()
    const payload = JSON.parse(rawBody)

    const orderId: string | undefined = payload?.data?.order?.order_id
    const paymentStatus: string | undefined = payload?.data?.payment?.payment_status

    if (!orderId || paymentStatus !== "SUCCESS") {
      return NextResponse.json({ received: true })
    }

    const user = await db.user.findFirst({
      where: { pendingSubscriptionOrderId: orderId },
    })

    if (!user || user.plan === "pro") {
      return NextResponse.json({ received: true })
    }

    await db.user.update({
      where: { id: user.id },
      data: {
        plan: "pro",
        planUpdatedAt: new Date(),
        pendingSubscriptionOrderId: null,
      },
    })

    console.log(`User ${user.email} upgraded to Pro via Cashfree subscription webhook`)

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Subscription webhook error:", error)
    return NextResponse.json({ received: true })
  }
}
