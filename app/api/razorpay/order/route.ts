import { NextRequest, NextResponse } from "next/server"
import Razorpay from "razorpay"
import { db } from "@/lib/db"
import { getPlanFeatures } from "@/lib/plans"

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
      include: { lineItems: true, user: true },
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

    // Get the freelancer's own Razorpay keys from their settings
    const settings = await db.userSettings.findUnique({
      where: { userId: invoice.userId },
    })

    if (!settings?.razorpayKeyId || !settings?.razorpaySecret) {
      return NextResponse.json(
        {
          success: false,
          error: "Razorpay is not connected. Please add your Razorpay keys in Settings.",
        },
        { status: 400 }
      )
    }

    // Use the freelancer's keys — money goes directly to them
    const razorpay = new Razorpay({
      key_id: settings.razorpayKeyId,
      key_secret: settings.razorpaySecret,
    })

    const amountInPaise = Math.round(invoice.total * 100)

    if (amountInPaise <= 0) {
      return NextResponse.json(
        { success: false, error: "Invalid invoice amount" },
        { status: 400 }
      )
    }

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
      data: { razorpayOrderId: order.id },
    })

    // Return freelancer's public key ID to the frontend — safe to expose
    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
      },
      keyId: settings.razorpayKeyId,
    })
  } catch (error) {
    console.error("Razorpay order creation error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create payment order. Please try again." },
      { status: 500 }
    )
  }
}