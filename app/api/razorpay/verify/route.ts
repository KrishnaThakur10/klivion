import { NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import { db } from "@/lib/db"

export async function POST(req: NextRequest) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      invoiceId,
    } = await req.json() as {
      razorpay_order_id: string
      razorpay_payment_id: string
      razorpay_signature: string
      invoiceId: string
    }

    // 1. Validate all fields are present
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !invoiceId) {
      return NextResponse.json(
        { success: false, error: "Missing payment details" },
        { status: 400 }
      )
    }

    // 2. Fetch invoice — we need userId to look up the freelancer's secret
    const invoice = await db.invoice.findUnique({
      where: { id: invoiceId },
      select: {
        id: true,
        number: true,
        status: true,
        userId: true,
        razorpayOrderId: true,
      },
    })

    if (!invoice) {
      return NextResponse.json(
        { success: false, error: "Invoice not found" },
        { status: 404 }
      )
    }

    // 3. Guard against double-payment
    if (invoice.status === "paid") {
      return NextResponse.json(
        { success: false, error: "Invoice is already paid" },
        { status: 409 }
      )
    }

    // 4. Confirm order ID matches what we stored when creating the order
    //    Prevents a tampered order_id being swapped in
    if (invoice.razorpayOrderId !== razorpay_order_id) {
      console.error("Order ID mismatch — possible tampering", {
        stored: invoice.razorpayOrderId,
        received: razorpay_order_id,
      })
      return NextResponse.json(
        { success: false, error: "Order ID mismatch" },
        { status: 400 }
      )
    }

    // 5. Fetch the freelancer's own Razorpay secret
    //    Each freelancer uses their own account — money flows directly to them
    const settings = await db.userSettings.findUnique({
      where: { userId: invoice.userId },
      select: { razorpaySecret: true },
    })

    if (!settings?.razorpaySecret) {
      return NextResponse.json(
        { success: false, error: "Razorpay not configured for this account" },
        { status: 400 }
      )
    }

    // 6. Verify HMAC-SHA256 signature using the freelancer's secret
    //    Razorpay signs: razorpay_order_id + "|" + razorpay_payment_id
    const expectedSignature = crypto
      .createHmac("sha256", settings.razorpaySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex")

    if (expectedSignature !== razorpay_signature) {
      console.error("Invalid Razorpay signature — possible fraud attempt")
      return NextResponse.json(
        { success: false, error: "Payment verification failed" },
        { status: 400 }
      )
    }

    // 7. Signature valid — mark invoice as paid
    await db.invoice.update({
      where: { id: invoiceId },
      data: {
        status: "paid",
        razorpayPaymentId: razorpay_payment_id,
      },
    })

    console.log(`Invoice ${invoice.number} paid successfully via Razorpay`)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Payment verification error:", error)
    return NextResponse.json(
      { success: false, error: "Verification failed" },
      { status: 500 }
    )
  }
}