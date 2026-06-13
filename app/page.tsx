import Link from "next/link"
import {
  FileText, Receipt, Users, CreditCard,
  Zap, CheckCircle2, ArrowRight, Sparkles,
  Send, ShieldCheck, Smartphone, Clock, Plus
} from "lucide-react"

export default function LandingPage() {
  return (
    <div style={{ background: "var(--bg)", color: "var(--text)", fontFamily: "var(--font-ui)" }} className="min-h-screen overflow-x-hidden">

      {/* ── Nav ── */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl"
        style={{ background: "rgba(10,10,12,0.7)", borderBottom: "0.5px solid var(--hairline)" }}>
        <div className="max-w-6xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: "#fff", boxShadow: "var(--shadow-primary)" }}>
              <Sparkles className="w-3.5 h-3.5" style={{ color: "#0a0a0c" }} strokeWidth={2.5} />
            </div>
            <span className="text-[15px] font-semibold tracking-tight">Klivio</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-[13px] font-medium" style={{ color: "var(--text-2)" }}>
            <a href="#features" className="hover:opacity-100 transition-opacity" style={{ opacity: 0.8 }}>Features</a>
            <a href="#how" className="hover:opacity-100 transition-opacity" style={{ opacity: 0.8 }}>How it works</a>
            <a href="#pricing" className="hover:opacity-100 transition-opacity" style={{ opacity: 0.8 }}>Pricing</a>
            <a href="#faq" className="hover:opacity-100 transition-opacity" style={{ opacity: 0.8 }}>FAQ</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="btn-ghost text-[13px] hidden sm:flex">
              Sign in
            </Link>
            <Link href="/login" className="btn-primary text-[13px]">
              Get started <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative pt-20 md:pt-28 pb-16 px-5 md:px-8 text-center overflow-hidden">
        {/* Radial glow arc */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
          style={{
            width: "1200px",
            height: "600px",
            background: "radial-gradient(ellipse 50% 50% at 50% 0%, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.05) 40%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
          style={{
            width: "800px",
            height: "400px",
            borderRadius: "50%",
            background: "var(--bg)",
            boxShadow: "0 0 120px 60px rgba(255,255,255,0.06)",
            filter: "blur(20px)",
          }}
        />

        <div className="relative max-w-3xl mx-auto" style={{ animation: "float-in 700ms var(--ease-apple) both" }}>
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 text-[12px] font-medium"
            style={{ background: "var(--inset-fill)", border: "0.5px solid var(--hairline-strong)", color: "var(--text-2)" }}
          >
            <Zap className="w-3 h-3" style={{ color: "var(--status-warning)" }} />
            Built for freelancers & agencies
          </div>

          <h1
            className="text-[40px] md:text-[64px] font-bold leading-[1.05] tracking-[-0.03em] mb-5"
            style={{ color: "var(--text)" }}
          >
            Proposals & invoices<br />that get you <em style={{ fontStyle: "italic", fontWeight: 600 }}>paid faster</em>
          </h1>

          <p className="text-[15px] md:text-[17px] max-w-xl mx-auto mb-8" style={{ color: "var(--text-2)" }}>
            Create stunning proposals, send professional invoices, and accept
            payments online — all in one place. Stop chasing clients, start
            getting paid.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
            <Link href="/login" className="btn-primary text-[14px] px-6 py-3 w-full sm:w-auto justify-center">
              Start for free <ArrowRight className="w-4 h-4" />
            </Link>
            <a href="#how" className="btn-ghost text-[14px] px-6 py-3 w-full sm:w-auto justify-center">
              See how it works
            </a>
          </div>
        </div>

        {/* Dashboard preview */}
        <div className="relative max-w-4xl mx-auto" style={{ animation: "float-in 900ms var(--ease-apple) both" }}>
          <div
            className="rounded-2xl overflow-hidden mx-4 md:mx-0"
            style={{
              background: "var(--bg-grid)",
              border: "0.5px solid var(--hairline-strong)",
              boxShadow: "var(--shadow-panel)",
            }}
          >
            {/* Fake browser bar */}
            <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: "0.5px solid var(--hairline)" }}>
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: "rgba(255,255,255,0.15)" }} />
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: "rgba(255,255,255,0.15)" }} />
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: "rgba(255,255,255,0.15)" }} />
              </div>
              <div
                className="flex-1 max-w-xs mx-auto rounded-md text-center text-[11px] py-1"
                style={{ background: "var(--inset-fill)", color: "var(--text-3)", fontFamily: "var(--font-mono)" }}
              >
                klivio.app/dashboard
              </div>
            </div>

            {/* Dashboard mock content */}
            <div className="p-4 md:p-6">
              {/* Stat cards row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 mb-3 md:mb-4">
                {[
                  { label: "Total Earned", value: "₹84,500", color: "var(--status-success)" },
                  { label: "Proposals", value: "12", color: "var(--text-2)" },
                  { label: "Outstanding", value: "₹12,000", color: "var(--text-2)" },
                  { label: "Clients", value: "8", color: "var(--text-2)" },
                ].map(s => (
                  <div key={s.label} className="rounded-xl p-3 md:p-4 text-left"
                    style={{ background: "rgba(255,255,255,0.03)", border: "0.5px solid var(--hairline)" }}>
                    <p className="text-[9px] md:text-[10px] font-semibold uppercase tracking-wider mb-1.5"
                      style={{ color: "var(--text-3)", fontFamily: "var(--font-mono)" }}>
                      {s.label}
                    </p>
                    <p className="text-[16px] md:text-[20px] font-bold" style={{ color: s.color === "var(--status-success)" ? s.color : "var(--text)" }}>
                      {s.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Invoice rows */}
              <div className="rounded-xl overflow-hidden" style={{ background: "rgba(255,255,255,0.03)", border: "0.5px solid var(--hairline)" }}>
                <div className="px-4 py-3" style={{ borderBottom: "0.5px solid var(--hairline)" }}>
                  <p className="text-[12px] font-semibold text-left" style={{ color: "var(--text)" }}>Recent Invoices</p>
                </div>
                {[
                  { num: "INV-0012", client: "Acme Studio", amount: "₹24,000", status: "Paid", color: "var(--status-success)" },
                  { num: "INV-0011", client: "Bright Labs", amount: "₹18,500", status: "Sent", color: "var(--text-2)" },
                  { num: "INV-0010", client: "Nova Design", amount: "₹9,200", status: "Paid", color: "var(--status-success)" },
                ].map((row, i) => (
                  <div key={row.num} className="flex items-center justify-between px-4 py-2.5"
                    style={{ borderBottom: i < 2 ? "0.5px solid rgba(255,255,255,0.04)" : "none" }}>
                    <div className="flex items-center gap-2.5">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: row.color }} />
                      <span className="text-[11px] md:text-[12px] font-medium" style={{ color: "var(--text)", fontFamily: "var(--font-mono)" }}>
                        {row.num}
                      </span>
                      <span className="text-[11px] md:text-[12px] hidden sm:inline" style={{ color: "var(--text-3)" }}>
                        {row.client}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] md:text-[12px] font-semibold" style={{ color: "var(--text)" }}>{row.amount}</span>
                      <span className="text-[9px] md:text-[10px] font-medium px-1.5 py-0.5 rounded-md"
                        style={{ background: row.color === "var(--status-success)" ? "var(--status-success-bg)" : "var(--inset-fill)", color: row.color, fontFamily: "var(--font-mono)" }}>
                        {row.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust strip ── */}
      <section className="py-10 px-5 md:px-8" style={{ borderTop: "0.5px solid var(--hairline)", borderBottom: "0.5px solid var(--hairline)" }}>
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-[11px] font-medium uppercase tracking-[0.15em] mb-6" style={{ color: "var(--text-3)", fontFamily: "var(--font-mono)" }}>
            Everything you need to run your freelance business
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[
              { icon: FileText, label: "Smart Proposals" },
              { icon: Receipt, label: "Invoicing" },
              { icon: CreditCard, label: "Online Payments" },
              { icon: Users, label: "Client Management" },
            ].map(item => {
              const Icon = item.icon
              return (
                <div key={item.label} className="flex flex-col items-center gap-2 py-2">
                  <Icon className="w-5 h-5" style={{ color: "var(--text-3)" }} strokeWidth={1.5} />
                  <span className="text-[12px] font-medium" style={{ color: "var(--text-2)" }}>{item.label}</span>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-20 md:py-28 px-5 md:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14 reveal">
            <p className="text-[12px] font-semibold uppercase tracking-[0.15em] mb-3" style={{ color: "var(--text-3)", fontFamily: "var(--font-mono)" }}>
              Features
            </p>
            <h2 className="text-[28px] md:text-[40px] font-bold tracking-[-0.03em] leading-tight mb-3">
              Everything to win clients<br />and get paid on time
            </h2>
            <p className="text-[14px] md:text-[15px] max-w-lg mx-auto" style={{ color: "var(--text-2)" }}>
              From the first pitch to the final payment — Klivio handles the
              business side so you can focus on the work.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                icon: FileText,
                title: "Beautiful Proposals",
                desc: "Rich text editor with formatting, images, and sections. Create proposals that make clients say yes.",
              },
              {
                icon: Send,
                title: "Shareable Links",
                desc: "Send a link, not a PDF attachment. Clients view and approve proposals right in their browser.",
              },
              {
                icon: CheckCircle2,
                title: "E-Signatures",
                desc: "Clients sign digitally with their name. No printing, scanning, or back-and-forth emails.",
              },
              {
                icon: Receipt,
                title: "Professional Invoices",
                desc: "Line items, taxes, auto-numbering — invoices that look like they came from a real business.",
              },
              {
                icon: CreditCard,
                title: "Get Paid Online",
                desc: "Accept UPI, cards, and net banking via Razorpay. Money goes straight to your account.",
              },
              {
                icon: Users,
                title: "Client Management",
                desc: "Keep all your clients, their contact details, and history organized in one place.",
              },
            ].map((f) => {
              const Icon = f.icon
              return (
                <div
                  key={f.title}
                  className="reveal rounded-2xl p-6"
                  style={{ background: "var(--bg-grid)", border: "0.5px solid var(--hairline)", boxShadow: "var(--shadow-panel)" }}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: "var(--inset-fill)", border: "0.5px solid var(--hairline)" }}>
                    <Icon className="w-4.5 h-4.5" style={{ color: "var(--text-2)" }} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-[15px] font-semibold mb-2" style={{ color: "var(--text)" }}>{f.title}</h3>
                  <p className="text-[13px] leading-relaxed" style={{ color: "var(--text-3)" }}>{f.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how" className="py-20 md:py-28 px-5 md:px-8" style={{ borderTop: "0.5px solid var(--hairline)" }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14 reveal">
            <p className="text-[12px] font-semibold uppercase tracking-[0.15em] mb-3" style={{ color: "var(--text-3)", fontFamily: "var(--font-mono)" }}>
              How it works
            </p>
            <h2 className="text-[28px] md:text-[40px] font-bold tracking-[-0.03em] leading-tight">
              From pitch to payment in 3 steps
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                title: "Create & Send",
                desc: "Write a proposal with our rich editor, attach your client, and send a shareable link in seconds.",
                icon: FileText,
              },
              {
                step: "02",
                title: "Client Approves",
                desc: "Your client opens the link, reviews everything, and signs digitally — no app or account needed.",
                icon: CheckCircle2,
              },
              {
                step: "03",
                title: "Invoice & Get Paid",
                desc: "Send a professional invoice with a payment link. Money lands directly in your Razorpay account.",
                icon: CreditCard,
              },
            ].map((s) => {
              const Icon = s.icon
              return (
                <div key={s.step} className="reveal text-center md:text-left">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 mx-auto md:mx-0"
                    style={{ background: "#fff", boxShadow: "var(--shadow-primary)" }}
                  >
                    <Icon className="w-5 h-5" style={{ color: "#0a0a0c" }} strokeWidth={1.75} />
                  </div>
                  <p className="text-[11px] font-semibold mb-2" style={{ color: "var(--text-3)", fontFamily: "var(--font-mono)" }}>
                    STEP {s.step}
                  </p>
                  <h3 className="text-[16px] font-semibold mb-2" style={{ color: "var(--text)" }}>{s.title}</h3>
                  <p className="text-[13px] leading-relaxed" style={{ color: "var(--text-3)" }}>{s.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Why Klivio (USP) ── */}
      <section className="py-20 md:py-28 px-5 md:px-8" style={{ borderTop: "0.5px solid var(--hairline)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14 reveal">
            <p className="text-[12px] font-semibold uppercase tracking-[0.15em] mb-3" style={{ color: "var(--text-3)", fontFamily: "var(--font-mono)" }}>
              Why Klivio
            </p>
            <h2 className="text-[28px] md:text-[40px] font-bold tracking-[-0.03em] leading-tight">
              Built different from the rest
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                icon: ShieldCheck,
                title: "Your money, your account",
                desc: "Payments go directly to your own Razorpay account. We never touch your client's money.",
              },
              {
                icon: Smartphone,
                title: "Mobile-first design",
                desc: "Manage proposals and invoices from your phone. Fully responsive on every device.",
              },
              {
                icon: Clock,
                title: "Built for speed",
                desc: "Create a proposal in under 2 minutes. Send an invoice in seconds. No bloated workflows.",
              },
              {
                icon: Sparkles,
                title: "No clutter, just essentials",
                desc: "Proposals, invoices, clients, payments. The tools freelancers actually use, nothing else.",
              },
            ].map(f => {
              const Icon = f.icon
              return (
                <div key={f.title} className="reveal flex items-start gap-4 p-5 rounded-2xl"
                  style={{ background: "var(--bg-grid)", border: "0.5px solid var(--hairline)" }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: "var(--inset-fill)", border: "0.5px solid var(--hairline)" }}>
                    <Icon className="w-4.5 h-4.5" style={{ color: "var(--text-2)" }} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-[14px] font-semibold mb-1" style={{ color: "var(--text)" }}>{f.title}</h3>
                    <p className="text-[13px] leading-relaxed" style={{ color: "var(--text-3)" }}>{f.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="py-20 md:py-28 px-5 md:px-8" style={{ borderTop: "0.5px solid var(--hairline)" }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14 reveal">
            <p className="text-[12px] font-semibold uppercase tracking-[0.15em] mb-3" style={{ color: "var(--text-3)", fontFamily: "var(--font-mono)" }}>
              Pricing
            </p>
            <h2 className="text-[28px] md:text-[40px] font-bold tracking-[-0.03em] leading-tight mb-3">
              Simple pricing, no surprises
            </h2>
            <p className="text-[14px]" style={{ color: "var(--text-2)" }}>
              Start free. Upgrade when you're ready to scale.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {/* Free */}
            <div className="reveal rounded-2xl p-6"
              style={{ background: "var(--bg-grid)", border: "0.5px solid var(--hairline)", boxShadow: "var(--shadow-panel)" }}>
              <p className="text-[13px] font-semibold mb-1" style={{ color: "var(--text-2)" }}>Free</p>
              <p className="text-[32px] font-bold mb-1" style={{ color: "var(--text)" }}>₹0</p>
              <p className="text-[12px] mb-5" style={{ color: "var(--text-3)" }}>forever, to get you started</p>
              <ul className="space-y-2.5 mb-6">
                {["3 proposals / month", "5 invoices / month", "1 client", "Basic templates"].map(item => (
                  <li key={item} className="flex items-center gap-2 text-[13px]" style={{ color: "var(--text-2)" }}>
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--text-3)" }} />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/login" className="btn-ghost w-full justify-center text-[13px]">
                Get started
              </Link>
            </div>

            {/* Pro */}
            <div className="reveal rounded-2xl p-6 relative"
              style={{ background: "var(--bg-grid)", border: "0.5px solid var(--hairline-strong)", boxShadow: "var(--shadow-panel)" }}>
              <div className="absolute -top-3 right-6 px-2.5 py-1 rounded-full text-[10px] font-semibold"
                style={{ background: "#fff", color: "#0a0a0c", fontFamily: "var(--font-mono)" }}>
                MOST POPULAR
              </div>
              <p className="text-[13px] font-semibold mb-1" style={{ color: "var(--text-2)" }}>Pro</p>
              <p className="text-[32px] font-bold mb-1" style={{ color: "var(--text)" }}>
                ₹499<span className="text-[14px] font-medium" style={{ color: "var(--text-3)" }}>/month</span>
              </p>
              <p className="text-[12px] mb-5" style={{ color: "var(--text-3)" }}>for growing freelancers</p>
              <ul className="space-y-2.5 mb-6">
                {["Unlimited proposals", "Unlimited invoices", "Unlimited clients", "Online payments (Razorpay)", "E-signatures", "Priority support"].map(item => (
                  <li key={item} className="flex items-center gap-2 text-[13px]" style={{ color: "var(--text)" }}>
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--status-success)" }} />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/login" className="btn-primary w-full justify-center text-[13px]">
                Start free trial
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="py-20 md:py-28 px-5 md:px-8" style={{ borderTop: "0.5px solid var(--hairline)" }}>
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12 reveal">
            <p className="text-[12px] font-semibold uppercase tracking-[0.15em] mb-3" style={{ color: "var(--text-3)", fontFamily: "var(--font-mono)" }}>
              FAQ
            </p>
            <h2 className="text-[28px] md:text-[40px] font-bold tracking-[-0.03em] leading-tight">
              Questions, answered
            </h2>
          </div>

          <div className="space-y-3">
            {[
              {
                q: "How do I get paid?",
                a: "You connect your own Razorpay account in Settings. When a client pays an invoice, the money goes directly to your account — Klivio never touches it.",
              },
              {
                q: "Can my clients pay via UPI?",
                a: "Yes. Razorpay supports UPI, cards, net banking, and wallets — covering virtually every payment method used in India.",
              },
              {
                q: "Do clients need an account?",
                a: "No. Clients receive a simple link to view and approve proposals or pay invoices — no signup required on their end.",
              },
              {
                q: "Is Klivio mobile friendly?",
                a: "Yes, the entire dashboard and client-facing pages are fully responsive and work great on phones and tablets.",
              },
              {
                q: "Can I cancel anytime?",
                a: "Yes. There's no lock-in — upgrade, downgrade, or cancel your plan anytime from Settings.",
              },
            ].map((item) => (
              <details
                key={item.q}
                className="reveal group rounded-2xl px-5 py-4 cursor-pointer"
                style={{ background: "var(--bg-grid)", border: "0.5px solid var(--hairline)" }}
              >
                <summary className="flex items-center justify-between text-[14px] font-medium list-none" style={{ color: "var(--text)" }}>
                  {item.q}
                  <span className="ml-4 transition-transform group-open:rotate-45" style={{ color: "var(--text-3)" }}>
                    <Plus className="w-4 h-4" />
                  </span>
                </summary>
                <p className="text-[13px] mt-3 leading-relaxed" style={{ color: "var(--text-3)" }}>
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-20 md:py-28 px-5 md:px-8 text-center relative overflow-hidden" style={{ borderTop: "0.5px solid var(--hairline)" }}>
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{
            width: "900px",
            height: "400px",
            background: "radial-gradient(ellipse 50% 50% at 50% 50%, rgba(255,255,255,0.1) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        <div className="relative max-w-2xl mx-auto reveal">
          <h2 className="text-[28px] md:text-[44px] font-bold tracking-[-0.03em] leading-tight mb-4">
            Stop chasing clients.<br />Start getting paid.
          </h2>
          <p className="text-[14px] md:text-[15px] mb-8" style={{ color: "var(--text-2)" }}>
            Join freelancers who use Klivio to send proposals, invoice clients,
            and get paid online — all in one place.
          </p>
          <Link href="/login" className="btn-primary text-[14px] px-8 py-3.5 inline-flex">
            Get started for free <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-10 px-5 md:px-8" style={{ borderTop: "0.5px solid var(--hairline)" }}>
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: "#fff" }}>
              <Sparkles className="w-3 h-3" style={{ color: "#0a0a0c" }} strokeWidth={2.5} />
            </div>
            <span className="text-[13px] font-semibold">Klivio</span>
          </div>
          <p className="text-[12px]" style={{ color: "var(--text-3)" }}>
            © 2026 Klivio. Built for freelancers, by a freelancer.
          </p>
        </div>
      </footer>
    </div>
  )
}