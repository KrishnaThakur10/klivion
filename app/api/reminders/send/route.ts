import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { resend } from "@/lib/resend"
import { invoiceReminderEmail } from "@/lib/email-templates"

// This route is called by a cron job daily
// Protected by a secret key so only our cron can call it
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const now = new Date()

  // Find all sent invoices that are overdue
  const overdueInvoices = await db.invoice.findMany({
    where: {
      status: "sent",
      dueDate: { lt: now },
    },
    include: {
      user: {
        include: { settings: true }
      },
      client: true,
    },
  })

  const results = []

  for (const invoice of overdueInvoices) {
    // Skip if no client email
    if (!invoice.client?.email) continue

    const daysPastDue = Math.floor(
      (now.getTime() - new Date(invoice.dueDate).getTime()) / (1000 * 60 * 60 * 24)
    )

    // Send reminders on day 1, 3, and 7
    const reminderDays: Record<number, number> = { 1: 1, 3: 2, 7: 3 }
    const reminderNumber = reminderDays[daysPastDue]

    if (!reminderNumber) continue

    // Check if we already sent this reminder
    const alreadySent = await db.emailLog.findFirst({
      where: {
        invoiceId: invoice.id,
        reminderNumber,
      },
    })

    if (alreadySent) continue

    const invoiceUrl = `${process.env.NEXTAUTH_URL}/invoices/${invoice.id}`
    const { subject, html } = invoiceReminderEmail({
      invoiceNumber: invoice.number,
      clientName: invoice.client.name,
      freelancerName: invoice.user.name ?? "Your freelancer",
      amount: invoice.total,
      dueDate: new Date(invoice.dueDate).toLocaleDateString("en-IN", {
        day: "numeric", month: "long", year: "numeric"
      }),
      invoiceUrl,
      reminderNumber,
    })

    try {
      await resend.emails.send({
        // from: "Klivio <reminders@klivio.app>",  // change to your domain later
        // to: invoice.client.email,
        from: "onboarding@resend.dev",  // change to your domain later
        to: "kthakur99100@gmail.com", // change to invoice.client.email later
        subject,
        html,
      })

      // Log that we sent this reminder
      await db.emailLog.create({
        data: {
          invoiceId: invoice.id,
          reminderNumber,
          sentAt: now,
        },
      })

      results.push({ invoice: invoice.number, reminder: reminderNumber, status: "sent" })
    } catch (err) {
      console.error(`Failed to send reminder for ${invoice.number}:`, err)
      results.push({ invoice: invoice.number, reminder: reminderNumber, status: "failed" })
    }
  }

  return NextResponse.json({
    processed: overdueInvoices.length,
    sent: results.filter(r => r.status === "sent").length,
    results,
  })
}