export async function sendEmail({
  to,
  toName,
  subject,
  html,
}: {
  to: string
  toName?: string
  subject: string
  html: string
}) {
  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.BREVO_API_KEY!,
      },
      body: JSON.stringify({
        sender: {
          name: "Klivion",
          email: "notifications@klivion.app",
        },
        to: [{ email: to, name: toName ?? to }],
        subject,
        htmlContent: html,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error("Brevo email error:", error)
      return { success: false, error }
    }

    console.log(`Email sent to ${to}`)
    return { success: true }
  } catch (error) {
    console.error("Brevo email error:", error)
    return { success: false, error }
  }
}