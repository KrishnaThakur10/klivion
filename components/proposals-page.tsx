"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import {
  createProposal,
  deleteProposal,
  updateProposalStatus,
} from "@/app/actions/proposals"
import TiptapEditor from "@/components/tiptap-editor"
import {
  Plus, ArrowLeft, Trash2, Send,
  CheckCircle2, Clock, AlertCircle,
  FileText, Copy, Check, ExternalLink,
  MoreHorizontal, Link as LinkIcon, Zap 
} from "lucide-react"
import { AIProposalGenerator } from "@/components/ai-proposal-generator"
import { UpgradeModal } from "@/components/upgrade-modal"

type Client = { id: string; name: string }
type Proposal = {
  id: string
  title: string
  status: string
  token: string
  createdAt: string
  clientName: string | null
}

const statusConfig: Record<string, {
  label: string
  color: string
  bg: string
  icon: React.ElementType
}> = {
  draft:  { label: "Draft",  color: "#6e6e73", bg: "rgba(255,255,255,0.06)", icon: AlertCircle },
  sent:   { label: "Sent",   color: "#a1a1a6", bg: "rgba(255,255,255,0.08)", icon: Clock },
  viewed: { label: "Viewed", color: "#ff9f0a", bg: "rgba(255,159,10,0.14)",  icon: Clock },
  signed: { label: "Signed", color: "#30d158", bg: "rgba(48,209,88,0.14)",   icon: CheckCircle2 },
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  function copy() {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button
      onClick={copy}
      className="flex items-center gap-1.5 w-full px-3 py-2 rounded-lg text-[13px] transition-colors hover:bg-accent"
      style={{ color: "var(--text-2)", fontFamily: "var(--font-ui)" }}
    >
      {copied
        ? <Check className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--status-success)" }} />
        : <Copy className="w-3.5 h-3.5 shrink-0" />}
      {copied ? "Copied!" : "Copy link"}
    </button>
  )
}

// 3-dot dropdown menu per row
function ProposalMenu({
  proposal,
  onSend,
  onSign,
  onCopyLink,
  onDelete,
  isPending,
}: {
  proposal: Proposal
  onSend: () => void
  onSign: () => void
  onCopyLink: () => void
  onDelete: () => void
  isPending: boolean
}) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(!open) }}
        className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors"
        style={{
          color: open ? "var(--text)" : "var(--text-3)",
          background: open ? "rgba(255,255,255,0.08)" : "transparent",
        }}
        onMouseEnter={e => {
          if (!open) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)"
        }}
        onMouseLeave={e => {
          if (!open) (e.currentTarget as HTMLElement).style.background = "transparent"
        }}
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>

      {open && (
        <>
          {/* Click outside to close */}
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />

          <div
            className="absolute right-0 top-8 z-20 w-44 rounded-xl py-1 overflow-hidden"
            style={{
              background: "var(--bg-grid)",
              border: "0.5px solid var(--hairline-strong)",
              boxShadow: "var(--shadow-panel)",
            }}
          >
            {proposal.status === "draft" && (
              <button
                onClick={() => { onSend(); setOpen(false) }}
                disabled={isPending}
                className="flex items-center gap-2.5 w-full px-3 py-2 text-[13px] transition-colors hover:bg-accent"
                style={{ color: "var(--text-2)" }}
              >
                <Send className="w-3.5 h-3.5 shrink-0" />
                Send to client
              </button>
            )}
            {proposal.status === "sent" && (
              <>
                <button
                  onClick={() => { onCopyLink(); setOpen(false) }}
                  className="flex items-center gap-2.5 w-full px-3 py-2 text-[13px] transition-colors hover:bg-accent"
                  style={{ color: "var(--text-2)" }}
                >
                  <LinkIcon className="w-3.5 h-3.5 shrink-0" />
                  Copy link
                </button>
                <button
                  onClick={() => { onSign(); setOpen(false) }}
                  disabled={isPending}
                  className="flex items-center gap-2.5 w-full px-3 py-2 text-[13px] transition-colors hover:bg-accent"
                  style={{ color: "var(--status-success)" }}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  Mark as signed
                </button>
              </>
            )}
            {proposal.status === "signed" && (
              <button
                onClick={() => { onCopyLink(); setOpen(false) }}
                className="flex items-center gap-2.5 w-full px-3 py-2 text-[13px] transition-colors hover:bg-accent"
                style={{ color: "var(--text-2)" }}
              >
                <LinkIcon className="w-3.5 h-3.5 shrink-0" />
                Copy link
              </button>
            )}

            <div style={{ height: "0.5px", background: "var(--hairline)", margin: "4px 0" }} />

            <button
              onClick={() => { onDelete(); setOpen(false) }}
              disabled={isPending}
              className="flex items-center gap-2.5 w-full px-3 py-2 text-[13px] transition-colors hover:bg-accent"
              style={{ color: "var(--status-error)" }}
            >
              <Trash2 className="w-3.5 h-3.5 shrink-0" />
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export function ProposalsPage({
  proposals: initial,
  clients,
  userPlan,
}: {
  proposals: Proposal[]
  clients: Client[]
  userPlan: string
}) {
  const isPro = userPlan === "pro"
  const router = useRouter()
  const [view, setView] = useState<"list" | "new">("list")
  // Use props directly — router.refresh() causes Server Component to re-render with fresh DB data
  const proposals = initial
  const [title, setTitle] = useState("")
  const [clientId, setClientId] = useState("")
  const [content, setContent] = useState("")
  const [error, setError] = useState("")
  const [shareLink, setShareLink] = useState("")
  const [showShare, setShowShare] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [showAI, setShowAI] = useState(false)
  const [aiBusinessName, setAiBusinessName] = useState("")
  const [showUpgrade, setShowUpgrade] = useState(false)
  const [upgradeReason, setUpgradeReason] = useState("")

function handleCreate() {
  if (!title.trim()) { setError("Title is required"); return }
  setError("")
  startTransition(async () => {
    const result = await createProposal({
      title,
      clientId: clientId || undefined,
      content,
    })
    if (result?.limitReached) {
      setUpgradeReason(result.error ?? "")
      setShowUpgrade(true)
      return
    }
    if (result?.error) {
      setError(result.error)
    } else {
      setTitle("")
      setClientId("")
      setContent("")
      setView("list")
      router.refresh()
    }
  })
}

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteProposal(id)
      router.refresh() // re-fetches → deleted item disappears
    })
  }

  function handleStatus(id: string, status: string) {
    startTransition(async () => {
      const result = await updateProposalStatus(id, status)
      router.refresh() // re-fetches → status badge updates
      if (status === "sent" && result?.token) {
        setShareLink(`${window.location.origin}/proposals/${result.token}`)
        setShowShare(true)
      }
    })
  }

  function handleCopyLink(token: string) {
    setShareLink(`${window.location.origin}/proposals/${token}`)
    setShowShare(true)
  }

  // ── NEW PROPOSAL VIEW ──
  if (view === "new") {
    return (
      <div className="flex flex-col min-h-full" style={{ background: "var(--bg)" }}>
        {showUpgrade && (
          <UpgradeModal
            reason={upgradeReason}
            onClose={() => setShowUpgrade(false)}
          />
        )}
      <header
        className="h-14 flex items-center justify-between px-4 md:px-8 shrink-0"
        style={{ borderBottom: "0.5px solid var(--hairline)" }}
      >
        <button
          onClick={() => setView("list")}
          className="flex items-center gap-2 text-[13px] font-medium transition-colors"
          style={{ color: "var(--text-3)", background: "none", border: "none", cursor: "pointer", padding: 0 }}
          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "var(--text-2)")}
          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = "var(--text-3)")}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Proposals
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (!isPro) {
                setUpgradeReason("AI proposal generation is a Pro feature. Upgrade to unlock it.")
                setShowUpgrade(true)
                return
              }
              setShowAI(true)
            }}
            className="btn-ghost text-[13px] flex items-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">AI Generate</span>
            {!isPro && (
              <span
                className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                style={{ background: "rgba(255,159,10,0.15)", color: "var(--status-warning)" }}
              >
                PRO
              </span>
            )}
          </button>
          <button onClick={handleCreate} disabled={isPending} className="btn-primary">
            {isPending ? "Saving..." : "Save Proposal"}
          </button>
        </div>
      </header>

        <div className="flex-1 p-4 md:p-8 max-w-215 w-full mx-auto space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block mb-1.5 text-[11px] font-semibold uppercase tracking-wider"
                style={{ color: "var(--text-3)", fontFamily: "var(--font-mono)" }}>
                Title *
              </label>
              <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Web Design Proposal for Acme Corp"
                className="ui-input"
              />
            </div>
            <div>
              <label className="block mb-1.5 text-[11px] font-semibold uppercase tracking-wider"
                style={{ color: "var(--text-3)", fontFamily: "var(--font-mono)" }}>
                Client
              </label>
              <select
                value={clientId}
                onChange={e => setClientId(e.target.value)}
                className="ui-input"
                style={{ fontFamily: "var(--font-ui)" }}
              >
                <option value="">Select a client (optional)</option>
                {clients.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          {error && (
            <p className="text-[12px] px-3 py-2 rounded-lg"
              style={{ color: "var(--status-error)", background: "var(--status-error-bg)", border: "0.5px solid var(--status-error)" }}>
              {error}
            </p>
          )}

          <div>
            <label className="block mb-1.5 text-[11px] font-semibold uppercase tracking-wider"
              style={{ color: "var(--text-3)", fontFamily: "var(--font-mono)" }}>
              Content
            </label>
            <TiptapEditor
              content={content}
              onChange={html => setContent(html)}
              placeholder="Write your proposal here..."
            />
          </div>
        </div>
        {showUpgrade && (
          <UpgradeModal
            reason={upgradeReason}
            onClose={() => setShowUpgrade(false)}
          />
        )}
        {showAI && (
            <AIProposalGenerator
              onGenerated={(html) => {
                setContent(html)
                setShowAI(false)
              }}
              onClose={() => setShowAI(false)}
              userName={""} // pass from session if available
              businessName={""}
            />
          )}
      </div>
    )
  }

  // ── LIST VIEW ──
  return (
    <div className="flex flex-col min-h-full" style={{ background: "var(--bg)" }}>
      {showUpgrade && (
        <UpgradeModal
          reason={upgradeReason}
          onClose={() => setShowUpgrade(false)}
        />
      )}
      {/* Share modal */}
      {showShare && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
          onClick={() => setShowShare(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl p-6"
            style={{ background: "var(--bg-grid)", boxShadow: "var(--shadow-panel)", border: "0.5px solid var(--hairline-strong)" }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "var(--status-success-bg)" }}>
                <Send className="w-4 h-4" style={{ color: "var(--status-success)" }} />
              </div>
              <div>
                <p className="text-[14px] font-semibold" style={{ color: "var(--text)" }}>
                  Proposal ready to send
                </p>
                <p className="text-[12px] mt-0.5" style={{ color: "var(--text-3)" }}>
                  Share this link with your client
                </p>
              </div>
            </div>

            <div
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg mb-3"
              style={{ background: "var(--input-bg)", border: "0.5px solid var(--hairline-strong)" }}
            >
              <span className="flex-1 text-[12px] truncate"
                style={{ color: "var(--text-2)", fontFamily: "var(--font-mono)" }}>
                {shareLink}
              </span>
            </div>

            <div className="mb-4">
              <CopyButton text={shareLink} />
            </div>

            <div className="flex gap-2">
              <a
                href={shareLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost flex-1 justify-center text-[12px]"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Preview
              </a>
              <button
                onClick={() => setShowShare(false)}
                className="btn-primary flex-1 justify-center text-[12px]"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header
        className="h-14 flex items-center justify-between px-4 md:px-8 shrink-0"
        style={{ borderBottom: "0.5px solid var(--hairline)" }}
      >
        <div className="flex items-center gap-2">
          <span className="text-[15px] font-semibold" style={{ color: "var(--text)" }}>
            Proposals
          </span>
          <span
            className="text-[11px] px-1.5 py-0.5 rounded-md"
            style={{ background: "var(--inset-fill)", color: "var(--text-3)", fontFamily: "var(--font-mono)", border: "0.5px solid var(--hairline)" }}
          >
            {proposals.length}
          </span>
        </div>
        <button onClick={() => setView("new")} className="btn-primary">
          <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
          <span className="hidden sm:inline">New Proposal</span>
          <span className="sm:hidden">New</span>
        </button>
      </header>

      <div className="flex-1 p-4 md:p-8 max-w-270 w-full overflow-x-hidden">

        {/* Empty state */}
        {proposals.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ background: "var(--inset-fill)", border: "0.5px solid var(--hairline)", boxShadow: "var(--shadow-panel)" }}>
              <FileText className="w-6 h-6" style={{ color: "var(--text-3)" }} />
            </div>
            <div className="text-center">
              <p className="text-[15px] font-semibold" style={{ color: "var(--text)" }}>No proposals yet</p>
              <p className="text-[13px] mt-1" style={{ color: "var(--text-3)" }}>Create your first proposal to get started</p>
            </div>
            <button onClick={() => setView("new")} className="btn-primary">
              <Plus className="w-3.5 h-3.5" /> Create Proposal
            </button>
          </div>
        )}

        {proposals.length > 0 && (
          <div className="space-y-1">
            {/* Desktop table header */}
            <div
              className="hidden md:grid items-center px-4 py-2.5"
              style={{
                gridTemplateColumns: "1fr 130px 100px 120px 40px",
                borderBottom: "0.5px solid var(--hairline)",
                color: "var(--text-3)",
                fontFamily: "var(--font-mono)",
                fontSize: "10px",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              <span>Title</span>
              <span>Client</span>
              <span>Created</span>
              <span>Status</span>
              <span />
            </div>

            {proposals.map((p) => {
              const sc = statusConfig[p.status] ?? statusConfig.draft
              const StatusIcon = sc.icon

              return (
                <div key={p.id}>
                  {/* ── Desktop row ── */}
                  <div
                    className="hidden md:grid items-center px-4 py-3 rounded-xl transition-all duration-150"
                    style={{
                      gridTemplateColumns: "1fr 130px 100px 120px 40px",
                      border: "0.5px solid transparent",
                    }}
                    onMouseEnter={e => {
                      const el = e.currentTarget as HTMLElement
                      el.style.background = "var(--bg-grid)"
                      el.style.borderColor = "var(--hairline)"
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget as HTMLElement
                      el.style.background = "transparent"
                      el.style.borderColor = "transparent"
                    }}
                  >
                    {/* Title */}
                    <div className="flex items-center gap-3 min-w-0 pr-4">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                        style={{ background: "var(--inset-fill)", border: "0.5px solid var(--hairline)" }}>
                        <FileText className="w-3.5 h-3.5" style={{ color: "var(--text-3)" }} strokeWidth={1.5} />
                      </div>
                      <span className="text-[13px] font-medium truncate" style={{ color: "var(--text)" }}>
                        {p.title}
                      </span>
                    </div>

                    {/* Client */}
                    <span className="text-[12px] truncate" style={{ color: "var(--text-2)" }}>
                      {p.clientName ?? <span style={{ color: "var(--text-3)" }}>—</span>}
                    </span>

                    {/* Date */}
                    <span className="text-[12px]" style={{ color: "var(--text-3)", fontFamily: "var(--font-mono)" }}>
                      {new Date(p.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    </span>

                    {/* Status badge */}
                    <span
                      className="flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-medium w-fit"
                      style={{ background: sc.bg, color: sc.color, fontFamily: "var(--font-mono)", border: `0.5px solid ${sc.color}22` }}
                    >
                      <StatusIcon className="w-3 h-3" />
                      {sc.label}
                    </span>

                    {/* 3-dot menu */}
                    <div className="flex justify-end">
                      <ProposalMenu
                        proposal={p}
                        onSend={() => handleStatus(p.id, "sent")}
                        onSign={() => handleStatus(p.id, "signed")}
                        onCopyLink={() => handleCopyLink(p.token)}
                        onDelete={() => handleDelete(p.id)}
                        isPending={isPending}
                      />
                    </div>
                  </div>

                  {/* ── Mobile card ── */}
                  <div
                    className="md:hidden rounded-xl p-4 mb-2"
                    style={{ background: "var(--bg-grid)", border: "0.5px solid var(--hairline)" }}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                          style={{ background: "var(--inset-fill)", border: "0.5px solid var(--hairline)" }}>
                          <FileText className="w-3.5 h-3.5" style={{ color: "var(--text-3)" }} strokeWidth={1.5} />
                        </div>
                        <span className="text-[14px] font-medium truncate" style={{ color: "var(--text)" }}>
                          {p.title}
                        </span>
                      </div>
                      <ProposalMenu
                        proposal={p}
                        onSend={() => handleStatus(p.id, "sent")}
                        onSign={() => handleStatus(p.id, "signed")}
                        onCopyLink={() => handleCopyLink(p.token)}
                        onDelete={() => handleDelete(p.id)}
                        isPending={isPending}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {p.clientName && (
                          <span className="text-[12px]" style={{ color: "var(--text-2)" }}>
                            {p.clientName}
                          </span>
                        )}
                        <span className="text-[11px]" style={{ color: "var(--text-3)", fontFamily: "var(--font-mono)" }}>
                          {new Date(p.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                        </span>
                      </div>
                      <span
                        className="flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-medium shrink-0"
                        style={{ background: sc.bg, color: sc.color, fontFamily: "var(--font-mono)", border: `0.5px solid ${sc.color}22` }}
                      >
                        <StatusIcon className="w-3 h-3" />
                        {sc.label}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}