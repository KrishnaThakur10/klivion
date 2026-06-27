import Link from "next/link";

export const metadata = {
  title: "Refund & Cancellation Policy — Klivion",
  description: "Klivion's policy on refunds and plan cancellations.",
};

const sections = [
  {
    title: "Scope of This Policy",
    content: [
      {
        subtitle: "What This Covers",
        text: "This policy applies to payments made to Klivion for Pro plan subscriptions. It does not apply to payments your clients make to you through your connected Razorpay account — those are governed by your own terms with your clients.",
      },
    ],
  },
  {
    title: "Pro Plan Payments",
    content: [
      {
        subtitle: "Manual Billing",
        text: "Pro plan upgrades are currently processed manually. You pay ₹499 via a Razorpay payment link and then send proof of payment to klivion@gmail.com. Your account is upgraded within 24 hours of confirmation.",
      },
      {
        subtitle: "No Automatic Renewals",
        text: "Klivion does not auto-renew subscriptions. You will not be charged without explicit action on your part. There are no recurring charges to worry about at this time.",
      },
    ],
  },
  {
    title: "Refund Policy",
    content: [
      {
        subtitle: "7-Day Refund Window",
        text: "If you are not satisfied with your Pro plan upgrade, you may request a full refund within 7 days of payment. Email klivion@gmail.com with your payment reference number and the email address associated with your account.",
      },
      {
        subtitle: "Refund Processing",
        text: "Approved refunds are processed back to your original payment method within 5–7 business days. Razorpay's processing timelines may affect when the amount appears in your account.",
      },
      {
        subtitle: "Conditions for Refund",
        text: "Refunds are issued at our discretion. We reserve the right to deny a refund if we determine the service has been used extensively (e.g., a high volume of proposals or invoices created) or if the refund request appears fraudulent.",
      },
      {
        subtitle: "After a Refund",
        text: "If your refund is approved, your account will revert to the Free plan immediately. Any data created while on the Pro plan will remain accessible, subject to Free plan limits.",
      },
      {
        subtitle: "No Refund After 7 Days",
        text: "Refund requests made more than 7 days after the payment date will not be honoured, except in cases of accidental duplicate payment or demonstrable service failure on our part.",
      },
    ],
  },
  {
    title: "Cancellations",
    content: [
      {
        subtitle: "Cancelling Your Pro Plan",
        text: "Since billing is manual, there is nothing to 'cancel' in the traditional sense — your Pro access simply does not renew unless you pay again. If you want your account downgraded to Free before your current Pro period ends, email klivion@gmail.com.",
      },
      {
        subtitle: "Account Deletion",
        text: "To delete your Klivion account entirely, email klivion@gmail.com. Account deletion is permanent and cannot be undone. All your proposals, invoices, and client data will be removed from our database within 30 days.",
      },
    ],
  },
  {
    title: "Client Payment Disputes",
    content: [
      {
        subtitle: "Not Our Responsibility",
        text: "Payments made by your clients to your Razorpay account are a direct transaction between you and your client. Klivion is not a party to that transaction and cannot issue refunds on your behalf.",
      },
      {
        subtitle: "Razorpay Disputes",
        text: "If your client raises a payment dispute through Razorpay, it will be handled by Razorpay's dispute resolution process. Klivion has no involvement in or control over that process.",
      },
      {
        subtitle: "Your Responsibility",
        text: "You are responsible for defining your own refund or cancellation policy for services you provide to your clients. We recommend including your policy in your proposals and invoices.",
      },
    ],
  },
  {
    title: "Accidental or Duplicate Payments",
    content: [
      {
        subtitle: "Contact Us Immediately",
        text: "If you believe you have been charged incorrectly or made a duplicate payment, email klivion@gmail.com immediately with your payment reference. We will investigate and, if confirmed, issue a full refund regardless of the 7-day window.",
      },
    ],
  },
  {
    title: "Contact",
    content: [
      {
        subtitle: "Refund Requests and Queries",
        text: "All refund and cancellation requests must be submitted via email to klivion@gmail.com. Please include your account email, payment reference number, and reason for the request. We aim to respond within 2 business days.",
      },
    ],
  },
];

export default function RefundPolicyPage() {
  return (
    <div style={{ background: "#0a0a0c", minHeight: "100vh", color: "#f5f5f7" }}>
      {/* Nav */}
      <nav
        style={{
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          padding: "0 24px",
          height: "56px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Link
          href="/"
          style={{
            fontFamily: "Manrope, sans-serif",
            fontWeight: 700,
            fontSize: "16px",
            color: "#f5f5f7",
            textDecoration: "none",
            letterSpacing: "-0.3px",
          }}
        >
          Klivion
        </Link>
        <Link
          href="/dashboard"
          style={{
            fontFamily: "Manrope, sans-serif",
            fontSize: "13px",
            color: "#a1a1a6",
            textDecoration: "none",
          }}
        >
          Go to app →
        </Link>
      </nav>

      {/* Content */}
      <main style={{ maxWidth: "720px", margin: "0 auto", padding: "64px 24px 96px" }}>
        {/* Header */}
        <div style={{ marginBottom: "48px" }}>
          <p
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "11px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#6e6e73",
              marginBottom: "16px",
            }}
          >
            Legal
          </p>
          <h1
            style={{
              fontFamily: "Manrope, sans-serif",
              fontSize: "clamp(28px, 5vw, 40px)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              color: "#f5f5f7",
              marginBottom: "16px",
              lineHeight: 1.1,
            }}
          >
            Refund &amp; Cancellation Policy
          </h1>
          <p style={{ fontFamily: "Manrope, sans-serif", fontSize: "15px", color: "#a1a1a6", lineHeight: 1.6 }}>
            Last updated: June 2026. This policy covers refunds on Klivion Pro plan payments and does not apply to payments your clients make through your Razorpay account.
          </p>
        </div>

        {/* Quick summary card */}
        <div
          style={{
            background: "#121215",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "10px",
            padding: "24px",
            marginBottom: "48px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          <p
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "10px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#6e6e73",
              margin: 0,
            }}
          >
            Summary
          </p>
          {[
            "Full refund within 7 days of Pro plan payment",
            "No automatic renewals — you're never charged without action",
            "Refunds processed in 5–7 business days",
            "For refund requests: klivion@gmail.com",
          ].map((point, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
              <span style={{ color: "#30d158", fontFamily: "Manrope, sans-serif", fontSize: "14px", flexShrink: 0, marginTop: "1px" }}>✓</span>
              <p style={{ fontFamily: "Manrope, sans-serif", fontSize: "14px", color: "#a1a1a6", margin: 0, lineHeight: 1.5 }}>
                {point}
              </p>
            </div>
          ))}
        </div>

        {/* Sections */}
        <div style={{ display: "flex", flexDirection: "column", gap: "48px" }}>
          {sections.map((section, i) => (
            <div key={i}>
              <h2
                style={{
                  fontFamily: "Manrope, sans-serif",
                  fontSize: "18px",
                  fontWeight: 700,
                  color: "#f5f5f7",
                  marginBottom: "24px",
                  letterSpacing: "-0.02em",
                  paddingBottom: "12px",
                  borderBottom: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                {i + 1}. {section.title}
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {section.content.map((item, j) => (
                  <div key={j}>
                    <p
                      style={{
                        fontFamily: "Manrope, sans-serif",
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "#f5f5f7",
                        marginBottom: "6px",
                      }}
                    >
                      {item.subtitle}
                    </p>
                    <p
                      style={{
                        fontFamily: "Manrope, sans-serif",
                        fontSize: "14px",
                        color: "#a1a1a6",
                        lineHeight: 1.7,
                        margin: 0,
                      }}
                    >
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer links */}
        <div
          style={{
            marginTop: "64px",
            paddingTop: "32px",
            borderTop: "1px solid rgba(255,255,255,0.08)",
            display: "flex",
            gap: "24px",
            flexWrap: "wrap",
          }}
        >
          <Link href="/privacy" style={{ fontFamily: "Manrope, sans-serif", fontSize: "13px", color: "#6e6e73", textDecoration: "none" }}>
            Privacy Policy
          </Link>
          <Link href="/terms" style={{ fontFamily: "Manrope, sans-serif", fontSize: "13px", color: "#6e6e73", textDecoration: "none" }}>
            Terms
          </Link>
        </div>
      </main>
    </div>
  );
}