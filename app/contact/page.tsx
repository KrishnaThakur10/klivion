import Link from "next/link";

export const metadata = {
  title: "Contact Us — Klivion",
  description: "Get in touch with the Klivion team.",
};

export default function ContactPage() {
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
        <div style={{ marginBottom: "56px" }}>
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
            Support
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
            Contact Us
          </h1>
          <p style={{ fontFamily: "Manrope, sans-serif", fontSize: "15px", color: "#a1a1a6", lineHeight: 1.6 }}>
            We're a small team building Klivion. Email is the best way to reach us — we typically respond within 1–2 business days.
          </p>
        </div>

        {/* Contact cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "56px" }}>

          {/* General */}
          <div
            style={{
              background: "#121215",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "12px",
              padding: "28px",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
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
              General enquiries
            </p>
            <p
              style={{
                fontFamily: "Manrope, sans-serif",
                fontSize: "18px",
                fontWeight: 700,
                color: "#f5f5f7",
                margin: 0,
                letterSpacing: "-0.02em",
              }}
            >
              <a href="mailto:klivion.support@gmail.com" style={{ color: "#f5f5f7", textDecoration: "none" }}>
                klivion.support@gmail.com
              </a>
            </p>
            <p style={{ fontFamily: "Manrope, sans-serif", fontSize: "13px", color: "#6e6e73", margin: 0 }}>
              Product questions, feature requests, account issues
            </p>
          </div>

          {/* Billing */}
          <div
            style={{
              background: "#121215",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "12px",
              padding: "28px",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
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
              Billing & refunds
            </p>
            <p
              style={{
                fontFamily: "Manrope, sans-serif",
                fontSize: "18px",
                fontWeight: 700,
                color: "#f5f5f7",
                margin: 0,
                letterSpacing: "-0.02em",
              }}
            >
              <a href="mailto:klivion.support@gmail.com" style={{ color: "#f5f5f7", textDecoration: "none" }}>
                klivion.support@gmail.com
              </a>
            </p>
            <p style={{ fontFamily: "Manrope, sans-serif", fontSize: "13px", color: "#6e6e73", margin: 0 }}>
              Pro plan upgrades, refund requests, payment issues — include your payment reference number
            </p>
          </div>

        </div>

        {/* Response time note */}
        <div
          style={{
            background: "#121215",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "10px",
            padding: "20px 24px",
            marginBottom: "56px",
          }}
        >
          <p style={{ fontFamily: "Manrope, sans-serif", fontSize: "14px", color: "#a1a1a6", margin: 0, lineHeight: 1.6 }}>
            <span style={{ color: "#f5f5f7", fontWeight: 600 }}>Response time:</span> We aim to respond to all emails within 1–2 business days (Monday–Friday, IST). For urgent billing issues, mention "URGENT" in your subject line.
          </p>
        </div>

        {/* What to include */}
        <div style={{ marginBottom: "56px" }}>
          <h2
            style={{
              fontFamily: "Manrope, sans-serif",
              fontSize: "18px",
              fontWeight: 700,
              color: "#f5f5f7",
              marginBottom: "20px",
              letterSpacing: "-0.02em",
              paddingBottom: "12px",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            What to include in your email
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {[
              { label: "Account email", desc: "The email address linked to your Klivion account (your GitHub email)" },
              { label: "Description", desc: "A clear description of the issue or question" },
              { label: "Payment reference", desc: "For billing issues — your Razorpay payment ID or transaction reference" },
              { label: "Screenshots", desc: "Optional but helpful for bug reports or UI issues" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "11px",
                    color: "#6e6e73",
                    flexShrink: 0,
                    marginTop: "2px",
                    minWidth: "20px",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <p style={{ fontFamily: "Manrope, sans-serif", fontSize: "14px", fontWeight: 600, color: "#f5f5f7", margin: "0 0 2px" }}>
                    {item.label}
                  </p>
                  <p style={{ fontFamily: "Manrope, sans-serif", fontSize: "13px", color: "#6e6e73", margin: 0, lineHeight: 1.6 }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Business info */}
        <div
          style={{
            background: "#121215",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "10px",
            padding: "24px",
            marginBottom: "16px",
          }}
        >
          <p
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "10px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#6e6e73",
              marginBottom: "16px",
            }}
          >
            Business details
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {[
              ["Product", "Klivion"],
              ["Email", "klivion.support@gmail.com"],
              ["Country", "India"],
            ].map(([key, val]) => (
              <div key={key} style={{ display: "flex", gap: "16px" }}>
                <span style={{ fontFamily: "Manrope, sans-serif", fontSize: "13px", color: "#6e6e73", minWidth: "80px" }}>{key}</span>
                <span style={{ fontFamily: "Manrope, sans-serif", fontSize: "13px", color: "#a1a1a6" }}>{val}</span>
              </div>
            ))}
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
          <Link href="/shipping-policy" style={{ fontFamily: "Manrope, sans-serif", fontSize: "13px", color: "#6e6e73", textDecoration: "none" }}>Shipping Policy</Link>
        </div>
      </main>
    </div>
  );
}