export function invoiceReminderEmail({
  invoiceNumber,
  clientName,
  freelancerName,
  amount,
  dueDate,
  invoiceUrl,
  reminderNumber, // 1, 2, or 3
}: {
  invoiceNumber: string
  clientName: string
  freelancerName: string
  amount: number
  dueDate: string
  invoiceUrl: string
  reminderNumber: number
}) {
  const subjects = {
    1: `Payment reminder: ${invoiceNumber} is due`,
    2: `Second reminder: ${invoiceNumber} is overdue`,
    3: `Final notice: ${invoiceNumber} requires immediate payment`,
  }

  const intros = {
    1: `This is a friendly reminder that invoice <strong>${invoiceNumber}</strong> for <strong>₹${amount.toLocaleString("en-IN")}</strong> was due on ${dueDate}.`,
    2: `Invoice <strong>${invoiceNumber}</strong> for <strong>₹${amount.toLocaleString("en-IN")}</strong> is now overdue. We'd appreciate prompt payment to avoid any disruption.`,
    3: `This is a final notice regarding invoice <strong>${invoiceNumber}</strong> for <strong>₹${amount.toLocaleString("en-IN")}</strong>. Immediate payment is required.`,
  }

  const subject = subjects[reminderNumber as keyof typeof subjects] ?? subjects[1]
  const intro = intros[reminderNumber as keyof typeof intros] ?? intros[1]

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:#0a0a0c;padding:24px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="background:#ffffff;border-radius:8px;width:28px;height:28px;text-align:center;vertical-align:middle;">
                          <span style="font-size:14px;">✦</span>
                        </td>
                        <td style="padding-left:10px;">
                          <span style="color:#f5f5f7;font-size:16px;font-weight:700;letter-spacing:-0.3px;">Klivio</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td align="right">
                    <span style="background:${reminderNumber === 3 ? "rgba(255,69,58,0.2)" : "rgba(255,255,255,0.1)"};color:${reminderNumber === 3 ? "#ff453a" : "#a1a1a6"};font-size:11px;font-weight:600;padding:4px 10px;border-radius:6px;text-transform:uppercase;letter-spacing:0.08em;">
                      ${reminderNumber === 1 ? "Reminder" : reminderNumber === 2 ? "2nd Reminder" : "Final Notice"}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 32px;">
              <p style="margin:0 0 6px;font-size:13px;color:#6e6e73;text-transform:uppercase;letter-spacing:0.08em;font-family:monospace;">
                Invoice ${invoiceNumber}
              </p>
              <h1 style="margin:0 0 20px;font-size:24px;font-weight:700;color:#0a0a0c;letter-spacing:-0.5px;">
                ${reminderNumber === 3 ? "⚠️ Final Payment Notice" : reminderNumber === 2 ? "Payment Overdue" : "Payment Reminder"}
              </h1>

              <p style="margin:0 0 16px;font-size:15px;color:#3a3a3c;line-height:1.6;">
                Hi ${clientName},
              </p>
              <p style="margin:0 0 24px;font-size:15px;color:#3a3a3c;line-height:1.6;">
                ${intro}
              </p>

              <!-- Invoice summary box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f7;border-radius:10px;margin-bottom:28px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="font-size:13px;color:#6e6e73;padding-bottom:8px;">Invoice Number</td>
                        <td align="right" style="font-size:13px;color:#0a0a0c;font-weight:600;padding-bottom:8px;font-family:monospace;">${invoiceNumber}</td>
                      </tr>
                      <tr>
                        <td style="font-size:13px;color:#6e6e73;padding-bottom:8px;">Due Date</td>
                        <td align="right" style="font-size:13px;color:${reminderNumber > 1 ? "#ff453a" : "#0a0a0c"};font-weight:600;padding-bottom:8px;">${dueDate}</td>
                      </tr>
                      <tr>
                        <td style="font-size:13px;color:#6e6e73;border-top:1px solid #e5e5e5;padding-top:12px;">Amount Due</td>
                        <td align="right" style="font-size:20px;color:#0a0a0c;font-weight:800;border-top:1px solid #e5e5e5;padding-top:12px;letter-spacing:-0.5px;">₹${amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="${invoiceUrl}"
                      style="display:inline-block;background:#0a0a0c;color:#ffffff;font-size:15px;font-weight:600;padding:14px 32px;border-radius:10px;text-decoration:none;letter-spacing:-0.2px;">
                      View & Pay Invoice →
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:28px 0 0;font-size:13px;color:#a1a1a6;line-height:1.6;">
                If you've already made this payment, please disregard this email.
                For questions, please contact <strong style="color:#3a3a3c;">${freelancerName}</strong> directly.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f5f5f7;padding:20px 32px;border-top:1px solid #e5e5e5;">
              <p style="margin:0;font-size:12px;color:#a1a1a6;text-align:center;">
                Sent via <strong style="color:#6e6e73;">Klivio</strong> · Invoice & payment platform for freelancers
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `

  return { subject, html }
}

export function paymentReceivedEmail({
  invoiceNumber,
  freelancerName,
  freelancerEmail,
  clientName,
  amount,
}: {
  invoiceNumber: string
  freelancerName: string
  freelancerEmail: string
  clientName: string
  amount: number
}) {
  return {
    subject: `✅ Payment received for ${invoiceNumber}`,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.08);">
          <tr>
            <td style="background:#0a0a0c;padding:24px 32px;">
              <span style="color:#f5f5f7;font-size:16px;font-weight:700;">✦ Klivio</span>
            </td>
          </tr>
          <tr>
            <td style="padding:36px 32px;text-align:center;">
              <div style="width:64px;height:64px;background:rgba(48,209,88,0.15);border-radius:16px;margin:0 auto 20px;display:flex;align-items:center;justify-content:center;font-size:28px;">✅</div>
              <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#0a0a0c;">Payment Received!</h1>
              <p style="margin:0 0 24px;font-size:15px;color:#6e6e73;">${clientName} has paid invoice ${invoiceNumber}</p>
              <div style="background:#f5f5f7;border-radius:10px;padding:20px;margin-bottom:24px;text-align:center;">
                <p style="margin:0 0 4px;font-size:13px;color:#6e6e73;">Amount received</p>
                <p style="margin:0;font-size:28px;font-weight:800;color:#30d158;letter-spacing:-0.5px;">₹${amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</p>
              </div>
              <p style="margin:0;font-size:13px;color:#a1a1a6;">The money is on its way to your Razorpay account.</p>
            </td>
          </tr>
          <tr>
            <td style="background:#f5f5f7;padding:16px 32px;border-top:1px solid #e5e5e5;">
              <p style="margin:0;font-size:12px;color:#a1a1a6;text-align:center;">Sent via <strong style="color:#6e6e73;">Klivio</strong></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
  }
}