import Link from "next/link";

export const metadata = {
  title: "Terms of Service — Klivion",
  description: "Terms governing your use of the Klivion platform.",
};

const sections = [
  {
    title: "Acceptance of Terms",
    content: [
      {
        subtitle: "Agreement",
        text: "By creating an account or using Klivion, you agree to these Terms of Service. If you do not agree, do not use the service. These terms apply to all users, including freelancers and agencies on both Free and Pro plans.",
      },
      {
        subtitle: "Eligibility",
        text: "You must be at least 18 years old and legally capable of entering into a binding contract to use Klivion. By using the service, you represent that you meet these requirements.",
      },
    ],
  },
  {
    title: "The Service",
    content: [
      {
        subtitle: "What Klivion Provides",
        text: "Klivion is a SaaS platform that allows freelancers and agencies to create proposals, send invoices, accept online payments via Razorpay, and manage clients. The service is provided on a subscription basis with Free and Pro tiers.",
      },
      {
        subtitle: "Service Availability",
        text: "We aim to maintain high uptime but do not guarantee uninterrupted availability. Klivion is deployed on Vercel infrastructure. Scheduled maintenance or unforeseen outages may affect access temporarily.",
      },
      {
        subtitle: "Feature Changes",
        text: "We reserve the right to modify, add, or remove features at any time. Where material features are removed from a paid plan, we will provide reasonable notice.",
      },
    ],
  },
  {
    title: "Accounts",
    content: [
      {
        subtitle: "Account Creation",
        text: "Accounts are created via GitHub OAuth. You are responsible for maintaining the security of your GitHub account, which controls access to Klivion.",
      },
      {
        subtitle: "One Account Per User",
        text: "Each GitHub account may be linked to one Klivion account. Creating multiple accounts to circumvent plan limits is prohibited.",
      },
      {
        subtitle: "Account Termination",
        text: "We reserve the right to suspend or terminate accounts that violate these terms, engage in fraudulent activity, or abuse the service. You may request account deletion by emailing klivion.support@gmail.com.",
      },
    ],
  },
  {
    title: "Subscription Plans and Billing",
    content: [
      {
        subtitle: "Free Plan",
        text: "The Free plan allows up to 3 proposals per month, 5 invoices per month, and 5 total clients. Online payments and AI proposal generation are not available on the Free plan.",
      },
      {
        subtitle: "Pro Plan",
        text: "The Pro plan is priced at ₹499 per month and removes usage limits, enables online payment acceptance through your Razorpay account, and unlocks AI proposal generation.",
      },
      {
        subtitle: "Billing",
        text: "Pro plan upgrades are currently processed manually via a Razorpay payment link. Upon successful payment, send proof of payment to klivion.support@gmail.com and your account will be upgraded within 24 hours.",
      },
      {
        subtitle: "No Automatic Renewals",
        text: "At this time, subscriptions do not automatically renew. You will need to manually renew your Pro plan each billing period. We will introduce automated billing in a future update.",
      },
      {
        subtitle: "Plan Limits",
        text: "Monthly limits (proposals, invoices) reset on the 1st of each calendar month UTC. Client limits are cumulative. Exceeding a limit will block creation of new items until the plan is upgraded or the next reset.",
      },
    ],
  },
  {
    title: "Payments",
    content: [
      {
        subtitle: "Freelancer Razorpay Integration",
        text: "Klivion enables you to connect your own Razorpay account to accept payments from your clients. You are responsible for maintaining a valid, activated Razorpay account and complying with Razorpay's terms of service.",
      },
      {
        subtitle: "Direct Payment Flow",
        text: "Payments made by your clients flow directly into your connected Razorpay account. Klivion does not hold, process, or take a commission on client payments. We are not a payment aggregator or processor.",
      },
      {
        subtitle: "Responsibility",
        text: "You are solely responsible for the accuracy of invoices, applicable taxes (including GST), and the legal validity of your payment requests. Klivion is not liable for disputes between you and your clients regarding payment.",
      },
    ],
  },
  {
    title: "Your Content",
    content: [
      {
        subtitle: "Ownership",
        text: "You retain full ownership of all proposals, invoices, client data, and other content you create on Klivion. We do not claim any intellectual property rights over your content.",
      },
      {
        subtitle: "Licence to Operate",
        text: "By using Klivion, you grant us a limited, non-exclusive licence to store, process, and display your content solely for the purpose of providing the service to you.",
      },
      {
        subtitle: "Prohibited Content",
        text: "You may not use Klivion to create proposals or invoices for illegal services, fraudulent transactions, or any activity that violates applicable law.",
      },
    ],
  },
  {
    title: "AI-Generated Content",
    content: [
      {
        subtitle: "AI Proposal Generation",
        text: "Klivion uses Google Gemini to generate proposal drafts based on your inputs. AI-generated content is a starting point, not a final deliverable. You are responsible for reviewing and editing AI-generated proposals before sending them to clients.",
      },
      {
        subtitle: "No Warranty on AI Output",
        text: "We make no representations about the accuracy, completeness, or fitness for purpose of AI-generated content. AI outputs may contain errors, omissions, or inappropriate language.",
      },
    ],
  },
  {
    title: "Intellectual Property",
    content: [
      {
        subtitle: "Klivion IP",
        text: "The Klivion platform, including its design, code, branding, and features, is owned by Klivion and protected by applicable intellectual property laws. You may not copy, reverse-engineer, or redistribute any part of the platform.",
      },
    ],
  },
  {
    title: "Disclaimers and Limitation of Liability",
    content: [
      {
        subtitle: "No Warranty",
        text: "Klivion is provided 'as is' and 'as available' without warranties of any kind, express or implied. We do not warrant that the service will be error-free, uninterrupted, or suitable for your specific use case.",
      },
      {
        subtitle: "Limitation of Liability",
        text: "To the maximum extent permitted by law, Klivion's total liability to you for any claim arising from your use of the service shall not exceed the amount you paid to Klivion in the three months preceding the claim. We are not liable for indirect, incidental, or consequential damages.",
      },
      {
        subtitle: "Not a Legal or Financial Advisor",
        text: "Klivion is a productivity tool, not a legal, accounting, or tax advisor. Consult qualified professionals for advice on contracts, invoicing legality, GST compliance, or business matters.",
      },
    ],
  },
  {
    title: "Governing Law",
    content: [
      {
        subtitle: "Jurisdiction",
        text: "These Terms are governed by the laws of India. Any disputes arising from these Terms or your use of Klivion shall be subject to the exclusive jurisdiction of the courts of India.",
      },
    ],
  },
  {
    title: "Changes to Terms",
    content: [
      {
        subtitle: "Updates",
        text: "We may update these Terms of Service from time to time. Material changes will be communicated via email or a notice in the dashboard. Continued use of Klivion after changes take effect constitutes acceptance of the updated terms.",
      },
    ],
  },
];

export default function TermsPage() {
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
            Terms of Service 
          </h1>
          <p style={{ fontFamily: "Manrope, sans-serif", fontSize: "15px", color: "#a1a1a6", lineHeight: 1.6 }}>
            Last updated: June 2026. By using Klivion, you agree to these terms. Please read them carefully.
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
            Questions or concerns?{" "}
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
          <Link href="/privacy" style={{ fontFamily: "Manrope, sans-serif", fontSize: "13px", color: "#6e6e73", textDecoration: "none" }}>
            Privacy Policy
          </Link>
          <Link href="/refund-policy" style={{ fontFamily: "Manrope, sans-serif", fontSize: "13px", color: "#6e6e73", textDecoration: "none" }}>
            Refund Policy
          </Link>
        </div>
      </main>
    </div>
  );
}