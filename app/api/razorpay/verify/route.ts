import { NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import { db } from "@/lib/db"
import { sendEmail } from "@/lib/email"
import { paymentReceivedEmail } from "@/lib/email-templates"

export async function POST(req: NextRequest) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      invoiceId,
    } = await req.json()

    // Validate all fields present
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !invoiceId) {
      return NextResponse.json(
        { success: false, error: "Missing payment details" },
        { status: 400 }
      )
    }

    // CRITICAL: Verify signature using HMAC-SHA256
    // This proves the payment response came from Razorpay, not a hacker
    const body = razorpay_order_id + "|" + razorpay_payment_id
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest("hex")

    const isSignatureValid = expectedSignature === razorpay_signature

    if (!isSignatureValid) {
      console.error("Invalid Razorpay signature — possible fraud attempt")
      return NextResponse.json(
        { success: false, error: "Payment verification failed" },
        { status: 400 }
      )
    }

    // Signature valid — update invoice status
    const invoice = await db.invoice.findFirst({
      where: { id: invoiceId },
    })

    if (!invoice) {
      return NextResponse.json(
        { success: false, error: "Invoice not found" },
        { status: 404 }
      )
    }

    await db.invoice.update({
      where: { id: invoiceId },
      data: {
        status: "paid",
        razorpayPaymentId: razorpay_payment_id,
      },
    })
    const updatedInvoice = await db.invoice.findFirst({
      where: { id: invoiceId },
      include: { user: true, client: true },
    })

    if (updatedInvoice?.user?.email) {
      const { subject, html } = paymentReceivedEmail({
        invoiceNumber: updatedInvoice.number,
        freelancerName: updatedInvoice.user.name ?? "",
        freelancerEmail: updatedInvoice.user.email,
        clientName: updatedInvoice.client?.name ?? "Your client",
        amount: updatedInvoice.total,
      })

      await sendEmail({
        to: updatedInvoice.user.email,
        toName: updatedInvoice.user.name ?? "",
        subject,
        html,
      })
    }

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