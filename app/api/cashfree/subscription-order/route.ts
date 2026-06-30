import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { createCashfreeOrder } from "@/lib/cashfree"
import { PLANS } from "@/lib/plans"

// This route uses KLIVION'S OWN Cashfree account (env vars), not a
// freelancer's keys — it's for collecting the ₹499/month Pro subscription
// fee directly from Klivion users, completely separate from the
// freelancer-invoice payment flow in /api/razorpay and /api/cashfree.

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id || !session.user.email) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const appId = process.env.CASHFREE_APP_ID
    const secretKey = process.env.CASHFREE_SECRET_KEY

    if (!appId || !secretKey) {
      return NextResponse.json(
        { success: false, error: "Subscription payments are not configured yet." },
        { status: 500 }
      )
    }
    

    const user = await db.user.findUnique({ where: { id: session.user.id } })

    if (user?.plan === "pro") {
      return NextResponse.json(
        { success: false, error: "You're already on the Pro plan." },
        { status: 400 }
      )
    }
    const settings = await db.userSettings.findUnique({
      where: { userId: session.user.id },
      select: { phone: true },
    })

    if (!settings?.phone) {
      return NextResponse.json(
        {
          success: false,
          error: "Please add your phone number in Settings before upgrading. Cashfree requires it to process payments.",
          missingPhone: true,
        },
        { status: 400 }
      )
    }

    const orderId = `sub_${session.user.id}_${Date.now()}`
    const appUrl = process.env.NEXTAUTH_URL || ""

    const order = await createCashfreeOrder({
      appId,
      secretKey,
      orderId,
      orderAmount: PLANS.pro.price,
      customerName: session.user.name || "Klivion User",
      customerEmail: session.user.email,
      customerPhone: settings.phone, // Cashfree requires a phone; not collected at signup today
      returnUrl: `${appUrl}/dashboard?upgrade=processing`,
      notifyUrl: `${appUrl}/api/cashfree/subscription-webhook`,
      orderNote: `Klivion Pro subscription — ${session.user.email}`,
    })

    // Track the order so the webhook (or a manual fallback check) can
    // tie a successful payment back to this user.
    await db.user.update({
      where: { id: session.user.id },
      data: { pendingSubscriptionOrderId: order.order_id },
    })

    return NextResponse.json({
      success: true,
      order: {
        id: order.order_id,
        paymentSessionId: order.payment_session_id,
      },
    })
  } catch (error) {
    console.error("Subscription order creation error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to start checkout. Please try again." },
      { status: 500 }
    )
  }
}
