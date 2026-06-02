import { db } from "@/lib/db"
import { notFound } from "next/navigation"
import { ApproveButton } from "@/components/approve-button"

export default async function PublicProposalPage(props: {
  params: Promise<{ token: string }>
}) {
  const { token } = await props.params

  if (!token) notFound()

  const proposal = await db.proposal.findFirst({
    where: { token: token },
    include: { user: true, client: true },
  })

  if (!proposal) notFound()

  const isExpired = proposal.status === "signed"

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-border">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground text-xs font-bold">P</span>
            </div>
            <span className="font-semibold">Proposely</span>
          </div>
          <span className={`text-xs px-3 py-1 rounded-full font-medium ${
            proposal.status === "signed" ? "bg-green-100 text-green-700"
            : proposal.status === "sent" ? "bg-blue-100 text-blue-700"
            : "bg-gray-100 text-gray-600"
          }`}>
            {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
          </span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="bg-white border border-border rounded-2xl p-8 mb-6 shadow-sm">
          <h1 className="text-2xl font-bold mb-2">{proposal.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span>From: <strong className="text-foreground">{proposal.user.name}</strong></span>
            {proposal.client && (
              <span>To: <strong className="text-foreground">{proposal.client.name}</strong></span>
            )}
            <span>{new Date(proposal.createdAt).toLocaleDateString("en-IN", {
              day: "numeric", month: "long", year: "numeric"
            })}</span>
          </div>
        </div>

        <div className="bg-white border border-border rounded-2xl p-8 mb-6 shadow-sm">
          <div
            className="tiptap"
            dangerouslySetInnerHTML={{ __html: proposal.content }}
          />
        </div>

        {!isExpired ? (
          <div className="bg-white border border-border rounded-2xl p-8 shadow-sm">
            <h2 className="font-semibold text-lg mb-1">Approve this Proposal</h2>
            <p className="text-sm text-muted-foreground mb-6">
              By clicking approve, you agree to the terms outlined in this proposal.
            </p>
            <ApproveButton proposalId={proposal.id} />
          </div>
        ) : (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center shadow-sm">
            <div className="text-3xl mb-2">✅</div>
            <h2 className="font-semibold text-green-800 text-lg">Proposal Signed</h2>
            <p className="text-sm text-green-700 mt-1">This proposal has been approved and signed.</p>
          </div>
        )}
      </div>
    </div>
  )
}