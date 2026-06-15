"use client"

import { useState, useTransition } from "react"
import { approveProposal } from "@/app/actions/proposals"
import { CheckCircle2, Loader2 } from "lucide-react"

export function ApproveButton({ proposalId }: { proposalId: string }) {
  const [name, setName] = useState("")
  const [approved, setApproved] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleApprove() {
    if (!name.trim()) return
    startTransition(async () => {
      await approveProposal(proposalId, name)
      setApproved(true)
    })
  }

  if (approved) {
    return (
      <div className="text-center py-6">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
          style={{ background: "rgba(48,209,88,0.2)" }}
        >
          <CheckCircle2 className="w-8 h-8" style={{ color: "var(--status-success)" }} />
        </div>
        <h3 className="text-[16px] font-semibold mb-1" style={{ color: "var(--status-success)" }}>
          Successfully Approved!
        </h3>
        <p className="text-[13px]" style={{ color: "var(--text-3)" }}>
          The freelancer has been notified of your approval.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div>
        <label
          className="block mb-1.5 text-[11px] font-semibold uppercase tracking-wider"
          style={{ color: "var(--text-3)", fontFamily: "var(--font-mono)" }}
        >
          Your Full Name *
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Type your name to sign"
          className="ui-input"
        />
        <p className="text-[11px] mt-1.5" style={{ color: "var(--text-3)" }}>
          This acts as your digital signature
        </p>
      </div>
      <button
        onClick={handleApprove}
        disabled={isPending || !name.trim()}
        className="btn-primary w-full justify-center py-3 text-[14px] disabled:opacity-40"
      >
        {isPending ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Approving...
          </>
        ) : (
          <>
            <CheckCircle2 className="w-4 h-4" />
            Approve & Sign Proposal
          </>
        )}
      </button>
    </div>
  )
}