import Link from "next/link";

export const metadata = {
  title: "Privacy Policy — Klivion",
  description: "How Klivion collects, uses, and protects your data.",
};

const sections = [
  {
    title: "Information We Collect",
    content: [
      {
        subtitle: "Account Information",
        text: "When you sign in via GitHub OAuth, we receive your name, email address, and profile picture from GitHub. We store this to identify your account and personalise your dashboard.",
      },
      {
        subtitle: "Business Data You Create",
        text: "Proposals, invoices, client details, and line items you create are stored in our database and associated with your account. This data belongs to you.",
      },
      {
        subtitle: "Payment Integration Credentials",
        text: "If you connect your Razorpay account, we store your Razorpay Key ID and Secret in our database to process payments on your behalf. These credentials are used solely to create and verify payment orders for your clients.",
      },
      {
        subtitle: "Usage Data",
        text: "We may collect anonymous usage metrics (page views, feature usage counts) to improve the product. This data is not linked to your identity.",
      },
    ],
  },
  {
    title: "How We Use Your Information",
    content: [
      {
        subtitle: "To Provide the Service",
        text: "Your data is used to operate Klivion — displaying your proposals, generating invoices, processing client payments through your connected Razorpay account, and generating AI-powered proposals via Google Gemini.",
      },
      {
        subtitle: "To Enforce Plan Limits",
        text: "We count monthly proposal and invoice creation and total client count to enforce Free and Pro plan limits.",
      },
      {
        subtitle: "To Communicate With You",
        text: "We may use your email to send important service updates, billing information, or security notices. We do not send marketing emails without your explicit consent.",
      },
    ],
  },
  {
    title: "Data Sharing",
    content: [
      {
        subtitle: "We Do Not Sell Your Data",
        text: "We never sell, rent, or trade your personal information to third parties for marketing purposes.",
      },
      {
        subtitle: "Service Providers",
        text: "We share data only with the services required to operate Klivion: Supabase (database hosting), Vercel (application hosting), GitHub (OAuth authentication), Razorpay (payment processing), and Google (AI proposal generation). Each provider is subject to their own privacy policy.",
      },
      {
        subtitle: "Legal Requirements",
        text: "We may disclose information if required by law, court order, or to protect the rights and safety of Klivion, our users, or the public.",
      },
    ],
  },
  {
    title: "Payment Data",
    content: [
      {
        subtitle: "Your Razorpay Integration",
        text: "Klivion enables a direct payment flow between your clients and your Razorpay account. Your clients' payment card or UPI details are handled entirely by Razorpay and are never stored on Klivion's servers. We store only the Razorpay Order ID and Payment ID for reconciliation.",
      },
      {
        subtitle: "PCI Compliance",
        text: "We do not store, process, or transmit raw card data. All sensitive payment data is handled by Razorpay, a PCI DSS compliant payment processor.",
      },
    ],
  },
  {
    title: "Data Retention",
    content: [
      {
        subtitle: "Active Accounts",
        text: "Your data is retained for as long as your account is active. Deleting a client, proposal, or invoice removes it from our database immediately.",
      },
      {
        subtitle: "Account Deletion",
        text: "To delete your account and all associated data, email us at klivion.support@gmail.com. We will process deletion requests within 30 days.",
      },
    ],
  },
  {
    title: "Security",
    content: [
      {
        subtitle: "How We Protect Your Data",
        text: "All data is transmitted over HTTPS. Passwords are not stored — authentication is handled via GitHub OAuth. Razorpay credentials stored in our database are access-controlled and not exposed in API responses. We use Supabase with row-level access controls.",
      },
      {
        subtitle: "No System Is Perfect",
        text: "While we take reasonable measures to protect your information, no internet-based service can guarantee absolute security. In the event of a breach, we will notify affected users promptly.",
      },
    ],
  },
  {
    title: "Your Rights",
    content: [
      {
        subtitle: "Access and Portability",
        text: "You can export your proposals and invoices as PDFs at any time from within the app.",
      },
      {
        subtitle: "Correction",
        text: "You can update your profile, business information, and Razorpay credentials at any time from the Settings page.",
      },
      {
        subtitle: "Deletion",
        text: "Email klivion.support@gmail.com to request deletion of your account and all associated data.",
      },
    ],
  },
  {
    title: "Cookies",
    content: [
      {
        subtitle: "Session Cookies",
        text: "We use session cookies to keep you signed in. These are essential for the service to function and are cleared when you sign out or close your browser.",
      },
      {
        subtitle: "No Tracking Cookies",
        text: "We do not use third-party advertising or tracking cookies.",
      },
    ],
  },
  {
    title: "Changes to This Policy",
    content: [
      {
        subtitle: "Updates",
        text: "We may update this Privacy Policy as the product evolves. Material changes will be communicated via email or a notice in the dashboard. Continued use of Klivion after changes take effect constitutes acceptance of the updated policy.",
      },
    ],
  },
];

export default function PrivacyPage() {
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
            Privacy Policy
          </h1>
          <p style={{ fontFamily: "Manrope, sans-serif", fontSize: "15px", color: "#a1a1a6", lineHeight: 1.6 }}>
            Last updated: June 2026. This policy explains what data Klivion collects, why, and how it is used and protected.
          </p>
        </div>

        {/* Contact callout */}
        <div
          style={{
            background: "#121215",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "10px",
            padding: "20px 24px",
            marginBottom: "48px",
          }}
        >
          <p style={{ fontFamily: "Manrope, sans-serif", fontSize: "14px", color: "#a1a1a6", margin: 0 }}>
            Questions about this policy?{" "}
            <a href="mailto:klivion.support@gmail.com" style={{ color: "#f5f5f7", textDecoration: "none", fontWeight: 600 }}>
              klivion.support@gmail.com
            </a>
          </p>
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
          <Link href="/terms" style={{ fontFamily: "Manrope, sans-serif", fontSize: "13px", color: "#6e6e73", textDecoration: "none" }}>
            Terms 
          </Link>
          <Link href="/refund-policy" style={{ fontFamily: "Manrope, sans-serif", fontSize: "13px", color: "#6e6e73", textDecoration: "none" }}>
            Refund Policy
          </Link>
        </div>
      </main>
    </div>
  );
}