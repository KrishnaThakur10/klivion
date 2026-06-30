import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { fetchCashfreeOrderPayments } from "@/lib/cashfree"

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
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
      return NextResponse.json({ success: true, alreadyPro: true })
    }

    if (!user?.pendingSubscriptionOrderId) {
      return NextResponse.json(
        { success: false, error: "No pending upgrade found." },
        { status: 400 }
      )
    }

    const payments = await fetchCashfreeOrderPayments({
      appId,
      secretKey,
      orderId: user.pendingSubscriptionOrderId,
    })

    const successfulPayment = payments.find(p => p.payment_status === "SUCCESS")

    if (!successfulPayment) {
      return NextResponse.json(
        { success: false, error: "Payment not confirmed yet. Please wait a moment and try again." },
        { status: 400 }
      )
    }

    await db.user.update({
      where: { id: session.user.id },
      data: {
        plan: "pro",
        planUpdatedAt: new Date(),
        pendingSubscriptionOrderId: null,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Subscription verification error:", error)
    return NextResponse.json(
      { success: false, error: "Verification failed." },
      { status: 500 }
    )
  }
}
