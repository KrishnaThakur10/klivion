import { NextRequest, NextResponse } from "next/server"
import Razorpay from "razorpay"
import { db } from "@/lib/db"
import { getPlanFeatures } from "@/lib/plans"
import { createCashfreeOrder } from "@/lib/cashfree"

export async function POST(req: NextRequest) {
  try {
    const { invoiceId } = await req.json()

    if (!invoiceId) {
      return NextResponse.json(
        { success: false, error: "Invoice ID required" },
        { status: 400 }
      )
    }

    const invoice = await db.invoice.findFirst({
      where: { id: invoiceId },
      include: { lineItems: true, user: true, client: true },
    })

    if (!invoice) {
      return NextResponse.json(
        { success: false, error: "Invoice not found" },
        { status: 404 }
      )
    }

    if (invoice.status === "paid") {
      return NextResponse.json(
        { success: false, error: "Invoice already paid" },
        { status: 400 }
      )
    }

    // Check if the freelancer's plan allows payments
    const user = await db.user.findUnique({
      where: { id: invoice.userId },
      select: { plan: true },
    })

    const features = getPlanFeatures(user?.plan ?? "free")

    if (!features.payments) {
      return NextResponse.json(
        {
          success: false,
          error: "Online payments require a Pro plan. Upgrade to start accepting payments.",
          limitReached: true,
        },
        { status: 403 }
      )
    }

    // Get the freelancer's settings — provider choice + keys
    const settings = await db.userSettings.findUnique({
      where: { userId: invoice.userId },
    })

    const provider = settings?.paymentProvider ?? "razorpay"
    const amountInPaise = Math.round(invoice.total * 100)

    if (amountInPaise <= 0) {
      return NextResponse.json(
        { success: false, error: "Invalid invoice amount" },
        { status: 400 }
      )
    }

    // ───────────────── Cashfree ─────────────────
    if (provider === "cashfree") {
      if (!settings?.cashfreeAppId || !settings?.cashfreeSecretKey) {
        return NextResponse.json(
          {
            success: false,
            error: "Cashfree is not connected. Please add your Cashfree keys in Settings.",
          },
          { status: 400 }
        )
      }

      const orderId = `inv_${invoice.number}_${Date.now()}`
      const appUrl = process.env.NEXTAUTH_URL || ""

      const order = await createCashfreeOrder({
        appId: settings.cashfreeAppId,
        secretKey: settings.cashfreeSecretKey,
        orderId,
        orderAmount: invoice.total, // Cashfree wants rupees, not paise
        customerName: invoice.client?.name || "Customer",
        customerEmail: invoice.client?.email || "no-reply@klivion.app",
        customerPhone: invoice.client?.phone || "9999999999",
        returnUrl: `${appUrl}/invoices/${invoice.id}?cf_order_id={order_id}`,
        notifyUrl: `${appUrl}/api/cashfree/webhook`,
        orderNote: `Payment for invoice ${invoice.number}`,
      })

      await db.invoice.update({
        where: { id: invoiceId },
        data: {
          paymentProvider: "cashfree",
          cashfreeOrderId: order.order_id,
        },
      })

      return NextResponse.json({
        success: true,
        provider: "cashfree",
        order: {
          id: order.order_id,
          paymentSessionId: order.payment_session_id,
        },
        appId: settings.cashfreeAppId,
      })
    }

    // ───────────────── Razorpay (default) ─────────────────
    if (!settings?.razorpayKeyId || !settings?.razorpaySecret) {
      return NextResponse.json(
        {
          success: false,
          error: "Razorpay is not connected. Please add your Razorpay keys in Settings.",
        },
        { status: 400 }
      )
    }

    const razorpay = new Razorpay({
      key_id: settings.razorpayKeyId,
      key_secret: settings.razorpaySecret,
    })

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `inv_${invoice.number}_${Date.now()}`,
      notes: {
        invoiceId: invoice.id,
        invoiceNumber: invoice.number,
      },
    })

    await db.invoice.update({
      where: { id: invoiceId },
      data: {
        paymentProvider: "razorpay",
        razorpayOrderId: order.id,
      },
    })

    return NextResponse.json({
      success: true,
      provider: "razorpay",
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
      },
      keyId: settings.razorpayKeyId,
    })
  } catch (error) {
    console.error("Payment order creation error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create payment order. Please try again." },
      { status: 500 }
    )
  }
}
