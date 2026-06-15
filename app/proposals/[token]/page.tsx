import { db } from "@/lib/db"
import { notFound } from "next/navigation"
import { ApproveButton } from "@/components/approve-button"
import { Sparkles, CheckCircle2, Clock, AlertCircle } from "lucide-react"

export default async function PublicProposalPage(props: {
  params: Promise<{ token: string }>
}) {
  const { token } = await props.params
  if (!token) notFound()

  const proposal = await db.proposal.findFirst({
    where: { token },
    include: { user: true, client: true },
  })

  if (!proposal) notFound()

  const isSigned = proposal.status === "signed"

  const statusMap: Record<string, { label: string; color: string; bg: string; icon: React.ElementType }> = {
    draft:  { label: "Draft",  color: "#6e6e73", bg: "rgba(255,255,255,0.06)", icon: AlertCircle },
    sent:   { label: "Sent",   color: "#a1a1a6", bg: "rgba(255,255,255,0.08)", icon: Clock },
    signed: { label: "Signed", color: "#30d158", bg: "rgba(48,209,88,0.14)",   icon: CheckCircle2 },
  }
  const sc = statusMap[proposal.status] ?? statusMap.draft
  const StatusIcon = sc.icon

  return (
    <div
      className="min-h-screen"
      style={{
        background: "var(--bg)",
        color: "var(--text)",
        fontFamily: "var(--font-ui)",
      }}
    >
      {/* Nav */}
      <nav
        className="sticky top-0 z-10 backdrop-blur-xl"
        style={{
          background: "rgba(10,10,12,0.8)",
          borderBottom: "0.5px solid var(--hairline)",
        }}
      >
        <div className="max-w-3xl mx-auto px-5 md:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: "#ffffff", boxShadow: "var(--shadow-primary)" }}
            >
              <Sparkles className="w-3.5 h-3.5" style={{ color: "#0a0a0c" }} strokeWidth={2.5} />
            </div>
            <span className="text-[14px] font-semibold tracking-tight">Klivio</span>
          </div>

          <span
            className="flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-md"
            style={{
              background: sc.bg,
              color: sc.color,
              border: `0.5px solid ${sc.color}33`,
              fontFamily: "var(--font-mono)",
            }}
          >
            <StatusIcon className="w-3 h-3" />
            {sc.label}
          </span>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-5 md:px-8 py-10 space-y-4">

        {/* Proposal meta card */}
        <div
          className="rounded-2xl p-6 md:p-8"
          style={{
            background: "var(--bg-grid)",
            border: "0.5px solid var(--hairline)",
            boxShadow: "var(--shadow-panel)",
          }}
        >
          <h1
            className="text-[22px] md:text-[28px] font-bold tracking-tight mb-3"
            style={{ color: "var(--text)", letterSpacing: "-0.02em" }}
          >
            {proposal.title}
          </h1>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[13px]" style={{ color: "var(--text-3)" }}>
            <span>
              From:{" "}
              <span className="font-medium" style={{ color: "var(--text-2)" }}>
                {proposal.user.name}
              </span>
            </span>
            {proposal.client && (
              <span>
                To:{" "}
                <span className="font-medium" style={{ color: "var(--text-2)" }}>
                  {proposal.client.name}
                </span>
              </span>
            )}
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px" }}>
              {new Date(proposal.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
        </div>

        {/* Proposal content */}
        <div
          className="rounded-2xl p-6 md:p-10"
          style={{
            background: "var(--bg-grid)",
            border: "0.5px solid var(--hairline)",
            boxShadow: "var(--shadow-panel)",
          }}
        >
          <div
            className="tiptap"
            dangerouslySetInnerHTML={{ __html: proposal.content }}
          />
        </div>

        {/* Sign / Signed section */}
        {isSigned ? (
          <div
            className="rounded-2xl p-8 text-center"
            style={{
              background: "var(--status-success-bg)",
              border: "0.5px solid rgba(48,209,88,0.25)",
            }}
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: "rgba(48,209,88,0.2)" }}
            >
              <CheckCircle2 className="w-7 h-7" style={{ color: "var(--status-success)" }} />
            </div>
            <h2
              className="text-[18px] font-semibold mb-1"
              style={{ color: "var(--status-success)" }}
            >
              Proposal Signed
            </h2>
            <p className="text-[13px]" style={{ color: "rgba(48,209,88,0.7)" }}>
              This proposal has been approved and signed.
            </p>
          </div>
        ) : (
          <div
            className="rounded-2xl p-6 md:p-8"
            style={{
              background: "var(--bg-grid)",
              border: "0.5px solid var(--hairline-strong)",
              boxShadow: "var(--shadow-panel)",
            }}
          >
            <h2
              className="text-[16px] font-semibold mb-1"
              style={{ color: "var(--text)" }}
            >
              Approve this Proposal
            </h2>
            <p
              className="text-[13px] mb-6"
              style={{ color: "var(--text-3)" }}
            >
              By clicking approve, you agree to the terms outlined in this proposal.
              Your name acts as a digital signature.
            </p>
            <ApproveButton proposalId={proposal.id} />
          </div>
        )}

        {/* Footer */}
        <p
          className="text-center text-[11px] pb-6"
          style={{ color: "var(--text-3)", fontFamily: "var(--font-mono)" }}
        >
          Powered by Klivio · Secure proposal & payment platform
        </p>
      </div>
    </div>
  )
}