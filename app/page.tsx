"use client"

import { useEffect, useRef, useState } from "react"
import type { MouseEvent } from "react"
import Link from "next/link"
import {
  Zap, FileText, Link2, PenLine, Receipt,
  CreditCard, Users, Wallet, Smartphone,
  Gauge, LayoutGrid, ArrowRight,
  Check, Plus, Minus, Send, Menu, X,
} from "lucide-react"

/* ── Primitives ── */
function MonoLabel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <span className={`mono-label ${className}`}>{children}</span>
}

function PrimaryButton({ children, className = "", href, ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: string }) {
  const cls = `btn-panel inline-flex items-center justify-center gap-2 rounded-[11px] bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 active:scale-[0.98] ${className}`
  if (href) return <Link href={href} className={cls}>{children}</Link>
  return <button className={cls} {...rest}>{children}</button>
}

function GhostButton({ children, className = "", href, ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: string }) {
  const cls = `btn-panel-ghost inline-flex items-center justify-center gap-2 rounded-[11px] bg-transparent px-5 py-3 text-sm font-semibold text-foreground hover:bg-white/[0.04] active:scale-[0.98] ${className}`
  if (href) return <Link href={href} className={cls}>{children}</Link>
  return <button className={cls} {...rest}>{children}</button>
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="hairline-strong inline-flex items-center gap-2 rounded-full bg-white/[0.03] px-3.5 py-1.5 text-xs text-muted-foreground">
      {children}
    </span>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center gap-3">
      <span className="h-px w-8 bg-border-strong" />
      <MonoLabel>{children}</MonoLabel>
      <span className="h-px w-8 bg-border-strong" />
    </div>
  )
}

/* Reveal on scroll */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal")
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible")
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.12 }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
}

/* Magic card */
function MagicCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    el.style.setProperty("--mx", `${e.clientX - r.left}px`)
    el.style.setProperty("--my", `${e.clientY - r.top}px`)
  }
  return (
    <div ref={ref} onMouseMove={onMove} className={`magic-card rounded-2xl p-6 ${className}`}>
      <div className="magic-card-inner">{children}</div>
    </div>
  )
}

/* ── Navbar ── */
function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [open])

  const links = [
    { href: "#features", label: "Features" },
    { href: "#how", label: "How it works" },
    { href: "#pricing", label: "Pricing" },
    { href: "#faq", label: "FAQ" },
  ]

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${scrolled ? "pt-2" : "pt-4"}`}>
      <div className="mx-auto w-full max-w-6xl px-3 sm:px-4">
        <nav className={`glass relative grid grid-cols-[auto_1fr_auto] items-center gap-2 rounded-2xl px-2 py-2 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] sm:px-3 ${scrolled ? "shadow-[0_10px_40px_-20px_rgba(0,0,0,0.6)]" : ""}`}>
          {/* Brand */}
          <a href="#top" className="flex min-w-0 items-center gap-2 pl-1 sm:gap-2.5 sm:pl-2">
            <span className="btn-panel grid h-8 w-8 shrink-0 place-items-center rounded-[9px] bg-primary text-primary-foreground">
              <Zap size={16} strokeWidth={2.5} />
            </span>
            <span className="truncate font-bold tracking-tight">Klivion</span>
          </a>

          {/* Desktop links */}
          <div className="hidden justify-center lg:flex">
            <div className="hairline flex items-center gap-1 rounded-full bg-white/[0.02] px-1 py-1 text-sm">
              {links.map((l) => (
                <a key={l.href} href={l.href}
                  className="rounded-full px-3.5 py-1.5 text-muted-foreground transition-colors duration-300 hover:bg-white/[0.06] hover:text-foreground">
                  {l.label}
                </a>
              ))}
            </div>
          </div>
          {/* Tablet links */}
          <div className="hidden items-center justify-center gap-5 text-sm text-muted-foreground md:flex lg:hidden">
            {links.map((l) => (
              <a key={l.href} href={l.href} className="hover:text-foreground transition-colors">{l.label}</a>
            ))}
          </div>
          <div className="md:hidden" />

          {/* Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="hidden items-center gap-2 lg:flex">
              <GhostButton href="/login" className="px-4 py-2 text-sm">Sign in</GhostButton>
              <PrimaryButton href="/login" className="px-4 py-2 text-sm">Get Started</PrimaryButton>
            </div>
            <button
              aria-label="Toggle menu"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="btn-panel-ghost grid h-9 w-9 place-items-center rounded-[10px] text-foreground md:hidden"
            >
              {open ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </nav>

        {/* Mobile drawer */}
        <div className={`md:hidden overflow-hidden transition-[max-height,opacity,transform] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${open ? "mt-2 max-h-[420px] opacity-100 translate-y-0" : "max-h-0 opacity-0 -translate-y-2"}`}>
          <div className="glass rounded-2xl p-3">
            <ul className="flex flex-col">
              {links.map((l) => (
                <li key={l.href}>
                  <a href={l.href} onClick={() => setOpen(false)}
                    className="flex items-center justify-between rounded-xl px-3 py-3 text-sm text-foreground/90 hover:bg-white/[0.04]">
                    <span>{l.label}</span>
                    <ArrowRight size={14} className="text-muted-foreground" />
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex flex-col gap-2 border-t border-border pt-3">
              <GhostButton href="/login" className="w-full">Sign in</GhostButton>
              <PrimaryButton href="/login" className="w-full">
                Get Started <ArrowRight size={14} />
              </PrimaryButton>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

/* ── Ambient Backdrop ── */
function AmbientBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="perspective-floor absolute inset-x-0 bottom-0 h-[80vh] opacity-40" />
      <div className="orb drift-slow absolute left-1/2 top-1/3 h-[520px] w-[680px] -translate-x-1/2 opacity-60" />
      <div className="orb drift-slower absolute -left-32 top-1/2 h-[420px] w-[420px] opacity-50" />
      <div className="orb drift-slow absolute -right-32 top-2/3 h-[380px] w-[380px] opacity-40" style={{ animationDelay: "4s" }} />
      <div className="vignette absolute inset-0" />
    </div>
  )
}

function WireframeRing({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`pointer-events-none absolute ${className}`}>
      <div className="spin-y relative h-full w-full">
        <div className="absolute inset-0 rounded-full border border-white/15" />
        <div className="absolute inset-4 rounded-full border border-white/10" />
        <div className="absolute inset-10 rounded-full border border-white/[0.06]" />
      </div>
    </div>
  )
}

/* ── Hero ── */
function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-40 pb-24">
      <div className="hero-glow pointer-events-none absolute inset-x-0 -top-32 h-[720px]" aria-hidden />
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_70%)]" aria-hidden />
      <WireframeRing className="left-[-180px] top-[180px] h-[420px] w-[420px] opacity-50" />
      <WireframeRing className="right-[-200px] top-[120px] h-[520px] w-[520px] opacity-40" />
      <div className="pulse-dot pointer-events-none absolute left-[12%] top-[28%] h-1.5 w-1.5 rounded-full bg-white/60" aria-hidden />
      <div className="pulse-dot pointer-events-none absolute right-[14%] top-[34%] h-1 w-1 rounded-full bg-white/40" style={{ animationDelay: "0.8s" }} aria-hidden />
      <div className="pulse-dot pointer-events-none absolute left-[20%] top-[60%] h-1 w-1 rounded-full bg-white/50" style={{ animationDelay: "1.6s" }} aria-hidden />

      <div className="relative mx-auto max-w-5xl px-4 text-center">
        <div className="reveal inline-flex">
          <Pill>
            <Zap size={12} className="text-foreground" />
            Built for freelancers & agencies
          </Pill>
        </div>
        <h1 className="reveal mt-6 text-balance text-5xl font-extrabold leading-[1.05] tracking-tight md:text-7xl">
          Proposals & invoices that
          <br />
          <span className="font-serif italic font-medium text-muted-foreground"
            style={{ fontFamily: "'Instrument Serif', 'Iowan Old Style', Georgia, serif" }}>
            get you paid faster
          </span>
        </h1>
        <p className="reveal mx-auto mt-6 max-w-2xl text-balance text-base text-muted-foreground md:text-lg">
          Create proposals clients love, send professional invoices, and accept online payments —
          all in one calm, premium workspace.
        </p>
        <div className="reveal mt-9 flex flex-wrap items-center justify-center gap-3">
          <PrimaryButton href="/login">
            Start for free <ArrowRight size={16} />
          </PrimaryButton>
          <GhostButton href="#how">See how it works</GhostButton>
        </div>

        {/* Dashboard mockup */}
        <div className="reveal mt-20 [perspective:1800px]">
          <div className="float-tilt mx-auto max-w-5xl">
            <div className="hairline-strong relative rounded-2xl bg-surface p-1.5 shadow-[0_60px_120px_-40px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.06)]">
              <div className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-b from-white/10 to-transparent opacity-60" aria-hidden />
              <img
                src="/dashboard-mockup.png"
                alt="Klivion dashboard showing earnings, proposals, and invoices"
                width={1536}
                height={1024}
                className="relative w-full rounded-xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── Capability Strip ── */
function CapabilityStrip() {
  const items = [
    { icon: FileText, label: "Smart Proposals" },
    { icon: Receipt, label: "Invoicing" },
    { icon: CreditCard, label: "Online Payments" },
    { icon: Users, label: "Client Management" },
  ]
  return (
    <section className="relative py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="reveal text-center">
          <MonoLabel>Everything you need to run your freelance business</MonoLabel>
        </div>
        <div className="reveal mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-4">
          {items.map(({ icon: Icon, label }) => (
            <div key={label} className="flex flex-col items-center justify-center gap-3 bg-background px-6 py-10">
              <span className="hairline-strong grid h-11 w-11 place-items-center rounded-xl bg-white/[0.03]">
                <Icon size={18} />
              </span>
              <span className="text-sm font-medium">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Features ── */
const FEATURES = [
  { icon: FileText, title: "Beautiful Proposals", desc: "Rich text editor with formatting, images, and sections. Create proposals that make clients say yes." },
  { icon: Link2, title: "Shareable Links", desc: "Send a link, not a PDF attachment. Clients view and approve proposals right in their browser." },
  { icon: PenLine, title: "E-Signatures", desc: "Clients sign digitally with their name. No printing, scanning, or back-and-forth emails." },
  { icon: Receipt, title: "Professional Invoices", desc: "Line items, taxes, auto-numbering — invoices that look like they came from a real business." },
  { icon: CreditCard, title: "Get Paid Online", desc: "Accept UPI, cards, and net banking via Razorpay. Money goes straight to your account." },
  { icon: Users, title: "Client Management", desc: "Keep all your clients, their contact details, and history organized in one place." },
]

function Features() {
  return (
    <section id="features" className="relative py-28">
      <div className="mx-auto max-w-6xl px-4">
        <div className="reveal text-center">
          <SectionLabel>Features</SectionLabel>
          <h2 className="mt-6 text-balance text-4xl font-bold tracking-tight md:text-5xl">
            Everything to win clients <br className="hidden md:block" />
            and get paid on time
          </h2>
        </div>
        <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="reveal">
              <MagicCard className="h-full">
                <span className="hairline-strong inline-grid h-11 w-11 place-items-center rounded-xl bg-white/[0.03]">
                  <Icon size={18} />
                </span>
                <h3 className="mt-5 text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{desc}</p>
              </MagicCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── How it works ── */
const STEPS = [
  { n: "01", icon: PenLine, title: "Create & Send", desc: "Write a proposal with our rich editor, attach your client, and send a shareable link in seconds." },
  { n: "02", icon: Check, title: "Client Approves", desc: "Your client opens the link, reviews everything, and signs digitally — no app or account needed." },
  { n: "03", icon: Wallet, title: "Invoice & Get Paid", desc: "Send a professional invoice with a payment link. Money lands directly in your Razorpay account." },
]

function HowItWorks() {
  return (
    <section id="how" className="relative py-24 sm:py-28">
      <div className="mx-auto max-w-6xl px-4">
        <div className="reveal text-center">
          <SectionLabel>How it works</SectionLabel>
          <h2 className="mt-6 text-balance text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            From pitch to payment in 3 steps
          </h2>
        </div>
        <div className="relative mt-14 sm:mt-16">
          <div aria-hidden
            className="pointer-events-none absolute left-[34px] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-border-strong to-transparent md:left-0 md:right-0 md:top-[64px] md:bottom-auto md:h-px md:w-auto md:bg-gradient-to-r"
          />
          <div className="grid gap-5 md:grid-cols-3 md:gap-6">
            {STEPS.map(({ n, icon: Icon, title, desc }, i) => (
              <div key={n} className="reveal" style={{ transitionDelay: `${i * 80}ms` }}>
                <MagicCard className="h-full p-6 sm:p-7">
                  <div className="grid grid-cols-[auto_1fr] items-start gap-4 md:block">
                    <div className="relative">
                      <span className="btn-panel relative z-10 grid h-[56px] w-[56px] shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground sm:h-[64px] sm:w-[64px]">
                        <Icon size={22} strokeWidth={2.2} />
                      </span>
                      <span aria-hidden className="pointer-events-none absolute inset-0 rounded-2xl bg-white/20 blur-2xl opacity-40" />
                      <span className="hairline-strong absolute -right-1.5 -top-1.5 z-20 grid h-6 min-w-6 place-items-center rounded-full bg-background px-1.5 font-mono text-[10px] tracking-widest text-foreground">
                        {n}
                      </span>
                    </div>
                    <div className="min-w-0 md:mt-6">
                      <MonoLabel>Step {n}</MonoLabel>
                      <h3 className="mt-1.5 text-lg font-semibold sm:text-xl">{title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{desc}</p>
                    </div>
                  </div>
                </MagicCard>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── Why Klivion ── */
const USPS = [
  { icon: Wallet, title: "Your money, your account", desc: "Payments go directly to your own Razorpay account. We never touch your client's money." },
  { icon: Smartphone, title: "Mobile-first design", desc: "Manage proposals and invoices from your phone. Fully responsive on every device." },
  { icon: Gauge, title: "Built for speed", desc: "Create a proposal in under 2 minutes. Send an invoice in seconds. No bloated workflows." },
  { icon: LayoutGrid, title: "No clutter, just essentials", desc: "Proposals, invoices, clients, payments. The tools freelancers actually use, nothing else." },
]

function Why() {
  return (
    <section className="relative py-28">
      <div className="mx-auto max-w-6xl px-4">
        <div className="reveal text-center">
          <SectionLabel>Why Klivion</SectionLabel>
          <h2 className="mt-6 text-balance text-4xl font-bold tracking-tight md:text-5xl">
            Built different from the rest
          </h2>
        </div>
        <div className="mt-16 grid gap-5 md:grid-cols-2">
          {USPS.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="reveal">
              <MagicCard className="h-full">
                <div className="flex gap-5">
                  <span className="hairline-strong grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-white/[0.03]">
                    <Icon size={18} />
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-lg font-semibold">{title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{desc}</p>
                  </div>
                </div>
              </MagicCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Pricing ── */
function Pricing() {
  const free = ["3 proposals/month", "5 invoices/month", "2 clients", "Basic templates"]
  const pro = ["500 proposals/month", "1,000 invoices/month", "200 clients", "Online payments (Razorpay)", "AI proposal generation", "Priority support"]
  return (
    <section id="pricing" className="relative py-28">
      <div className="mx-auto max-w-5xl px-4">
        <div className="reveal text-center">
          <SectionLabel>Pricing</SectionLabel>
          <h2 className="mt-6 text-balance text-4xl font-bold tracking-tight md:text-5xl">
            Simple pricing, no surprises
          </h2>
          <p className="mx-auto mt-4 max-w-md text-muted-foreground">
            Start free. Upgrade when you're ready to scale.
          </p>
        </div>
        <div className="mt-16 grid gap-5 md:grid-cols-2">
          <div className="reveal hairline rounded-2xl bg-surface p-8">
            <MonoLabel>Free</MonoLabel>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-5xl font-bold tracking-tight">₹0</span>
              <span className="text-muted-foreground">forever</span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">For trying things out.</p>
            <GhostButton href="/login" className="mt-6 w-full">Get started</GhostButton>
            <ul className="mt-7 space-y-3 text-sm">
              {free.map((f) => (
                <li key={f} className="flex items-center gap-3 text-muted-foreground">
                  <Check size={14} className="text-foreground" /> {f}
                </li>
              ))}
            </ul>
          </div>
          <div className="reveal relative rounded-2xl bg-surface p-8 hairline-strong shadow-[0_30px_80px_-20px_rgba(255,255,255,0.08)]">
            <span className="absolute -top-3 left-8 hairline-strong rounded-full bg-background px-3 py-1 text-[10px] font-mono uppercase tracking-[0.18em] text-foreground">
              ★ Most popular
            </span>
            <MonoLabel>Pro</MonoLabel>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-5xl font-bold tracking-tight">₹499</span>
              <span className="text-muted-foreground">/ month</span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">For serious freelancers and agencies.</p>
            <PrimaryButton href="/login" className="mt-6 w-full">Start free trial</PrimaryButton>
            <ul className="mt-7 space-y-3 text-sm">
              {pro.map((f) => (
                <li key={f} className="flex items-center gap-3 text-foreground">
                  <Check size={14} /> <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── FAQ ── */
const FAQS = [
  { q: "How do I get paid?", a: "You connect your own Razorpay account in Settings. When a client pays an invoice, the money goes directly to your account — Klivion never touches it." },
  { q: "Can my clients pay via UPI?", a: "Yes. Razorpay supports UPI, cards, net banking, and wallets — covering virtually every payment method used in India." },
  { q: "Do clients need an account?", a: "No. Clients receive a simple link to view and approve proposals or pay invoices — no signup required on their end." },
  { q: "Is Klivion mobile friendly?", a: "Yes, the entire dashboard and client-facing pages are fully responsive and work great on phones and tablets." },
  { q: "Can I cancel anytime?", a: "Yes. There's no lock-in — upgrade, downgrade, or cancel your plan anytime from Settings." },
]

function FAQ() {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <section id="faq" className="relative py-28">
      <div className="mx-auto max-w-3xl px-4">
        <div className="reveal text-center">
          <SectionLabel>FAQ</SectionLabel>
          <h2 className="mt-6 text-balance text-4xl font-bold tracking-tight md:text-5xl">
            Questions, answered
          </h2>
        </div>
        <div className="mt-14 space-y-3">
          {FAQS.map((item, i) => {
            const isOpen = open === i
            return (
              <div key={item.q}
                className="reveal hairline rounded-2xl bg-surface transition-colors duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:border-border-strong">
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className="text-base font-medium">{item.q}</span>
                  <span className="hairline-strong grid h-7 w-7 shrink-0 place-items-center rounded-full">
                    {isOpen ? <Minus size={14} /> : <Plus size={14} />}
                  </span>
                </button>
                <div
                  className="grid overflow-hidden px-6 transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
                  style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                >
                  <div className="min-h-0 overflow-hidden">
                    <p className="pb-5 pr-10 text-sm leading-relaxed text-muted-foreground">{item.a}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ── Final CTA ── */
function FinalCTA() {
  return (
    <section className="relative overflow-hidden py-32">
      <div className="cta-glow pointer-events-none absolute inset-0" aria-hidden />
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-30 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" aria-hidden />
      <div className="pulse-dot pointer-events-none absolute left-[20%] top-[30%] h-1 w-1 rounded-full bg-white/60" aria-hidden />
      <div className="pulse-dot pointer-events-none absolute right-[24%] top-[60%] h-1.5 w-1.5 rounded-full bg-white/40" style={{ animationDelay: "1s" }} aria-hidden />
      <div className="relative mx-auto max-w-3xl px-4 text-center">
        <h2 className="reveal text-balance text-4xl font-bold tracking-tight md:text-6xl">
          Stop chasing clients.
          <br />
          <span className="font-serif italic font-medium text-muted-foreground"
            style={{ fontFamily: "'Instrument Serif', 'Iowan Old Style', Georgia, serif" }}>
            Start getting paid.
          </span>
        </h2>
        <p className="reveal mx-auto mt-6 max-w-xl text-muted-foreground">
          Join freelancers who use Klivion to send proposals, invoice clients, and get paid online — all in one place.
        </p>
        <div className="reveal mt-9 flex justify-center">
          <PrimaryButton href="/login" className="px-6 py-3.5 text-base">
            Get started for free <Send size={15} />
          </PrimaryButton>
        </div>
      </div>
    </section>
  )
}

/* ── Footer ── */
function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row">
        <div className="flex items-center gap-2.5">
          <span className="btn-panel grid h-7 w-7 place-items-center rounded-[8px] bg-primary text-primary-foreground">
            <Zap size={13} strokeWidth={2.5} />
          </span>
          <span className="font-bold tracking-tight">Klivion</span>
        </div>
        <p className="text-xs text-muted-foreground">
          © 2026 Klivion. Built for freelancers, by a freelancer.
        </p>
      </div>
    </footer>
  )
}

/* ── Page ── */
export default function LandingPage() {
  useReveal()
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap" />
      <AmbientBackdrop />
      <div className="relative z-10">
        <Navbar />
        <Hero />
        <CapabilityStrip />
        <Features />
        <HowItWorks />
        <Why />
        <Pricing />
        <FAQ />
        <FinalCTA />
        <Footer />
      </div>
    </main>
  )
}