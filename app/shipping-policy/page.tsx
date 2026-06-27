import Link from "next/link";

export const metadata = {
  title: "Shipping Policy — Klivion",
  description: "Klivion delivers software digitally. No physical goods are shipped.",
};

export default function ShippingPolicyPage() {
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
            Shipping Policy
          </h1>
          <p style={{ fontFamily: "Manrope, sans-serif", fontSize: "15px", color: "#a1a1a6", lineHeight: 1.6 }}>
            Last updated: June 2026.
          </p>
        </div>

        {/* Digital delivery callout */}
        <div
          style={{
            background: "#121215",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "10px",
            padding: "24px",
            marginBottom: "48px",
          }}
        >
          <p
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "10px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#6e6e73",
              marginBottom: "12px",
            }}
          >
            Key point
          </p>
          <p style={{ fontFamily: "Manrope, sans-serif", fontSize: "15px", color: "#f5f5f7", fontWeight: 600, margin: 0 }}>
            Klivion is a digital software service. We do not sell or ship any physical goods.
          </p>
        </div>

        {/* Sections */}
        <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>

          <div>
            <h2
              style={{
                fontFamily: "Manrope, sans-serif",
                fontSize: "18px",
                fontWeight: 700,
                color: "#f5f5f7",
                marginBottom: "16px",
                letterSpacing: "-0.02em",
                paddingBottom: "12px",
                borderBottom: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              1. Digital Delivery Only
            </h2>
            <p style={{ fontFamily: "Manrope, sans-serif", fontSize: "14px", color: "#a1a1a6", lineHeight: 1.7, margin: 0 }}>
              Klivion is a Software-as-a-Service (SaaS) platform. All products and services offered by Klivion are delivered digitally over the internet. There are no physical products, no packaging, and no courier or postal delivery involved in any transaction with Klivion.
            </p>
          </div>

          <div>
            <h2
              style={{
                fontFamily: "Manrope, sans-serif",
                fontSize: "18px",
                fontWeight: 700,
                color: "#f5f5f7",
                marginBottom: "16px",
                letterSpacing: "-0.02em",
                paddingBottom: "12px",
                borderBottom: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              2. Instant Access
            </h2>
            <p style={{ fontFamily: "Manrope, sans-serif", fontSize: "14px", color: "#a1a1a6", lineHeight: 1.7, margin: 0 }}>
              Upon successful payment for a Pro plan subscription, access is granted to your account within 24 hours. There is no waiting period for shipping or delivery. Your upgraded plan features are available as soon as your account is manually upgraded by our team after payment confirmation.
            </p>
          </div>

          <div>
            <h2
              style={{
                fontFamily: "Manrope, sans-serif",
                fontSize: "18px",
                fontWeight: 700,
                color: "#f5f5f7",
                marginBottom: "16px",
                letterSpacing: "-0.02em",
                paddingBottom: "12px",
                borderBottom: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              3. Client Payments
            </h2>
            <p style={{ fontFamily: "Manrope, sans-serif", fontSize: "14px", color: "#a1a1a6", lineHeight: 1.7, margin: 0 }}>
              Klivion enables freelancers and agencies to accept payments from their own clients via Razorpay. These payments are for the freelancer's own services — not for any goods or services sold by Klivion. Klivion is not a party to those transactions and has no shipping obligations in connection with them.
            </p>
          </div>

          <div>
            <h2
              style={{
                fontFamily: "Manrope, sans-serif",
                fontSize: "18px",
                fontWeight: 700,
                color: "#f5f5f7",
                marginBottom: "16px",
                letterSpacing: "-0.02em",
                paddingBottom: "12px",
                borderBottom: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              4. Contact
            </h2>
            <p style={{ fontFamily: "Manrope, sans-serif", fontSize: "14px", color: "#a1a1a6", lineHeight: 1.7, margin: 0 }}>
              If you have any questions about this policy, email us at{" "}
              <a href="mailto:klivion@gmail.com" style={{ color: "#f5f5f7", textDecoration: "none", fontWeight: 600 }}>
                klivion@gmail.com
              </a>.
            </p>
          </div>

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
          <Link href="/privacy" style={{ fontFamily: "Manrope, sans-serif", fontSize: "13px", color: "#6e6e73", textDecoration: "none" }}>Privacy Policy</Link>
          <Link href="/terms" style={{ fontFamily: "Manrope, sans-serif", fontSize: "13px", color: "#6e6e73", textDecoration: "none" }}>Terms of Service</Link>
          <Link href="/refund-policy" style={{ fontFamily: "Manrope, sans-serif", fontSize: "13px", color: "#6e6e73", textDecoration: "none" }}>Refund Policy</Link>
          <Link href="/contact" style={{ fontFamily: "Manrope, sans-serif", fontSize: "13px", color: "#6e6e73", textDecoration: "none" }}>Contact Us</Link>
        </div>
      </main>
    </div>
  );
}