import { NextRequest, NextResponse } from "next/server"
import Razorpay from "razorpay"
import { db } from "@/lib/db"

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

    // Get the FREELANCER's own Razorpay keys from their settings
    const settings = await db.userSettings.findUnique({
      where: { userId: invoice.userId },
    })

    if (!settings?.razorpayKeyId || !settings?.razorpaySecret) {
      return NextResponse.json(
        { success: false, error: "Freelancer has not connected Razorpay yet" },
        { status: 400 }
      )
    }

    // Use the FREELANCER'S keys — money goes to them directly
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

    // Return the freelancer's KEY ID to the frontend (public key, safe to send)
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
      { success: false, error: "Failed to create payment order" },
      { status: 500 }
    )
  }
}