"use client"

import { useState, useTransition } from "react"
import { approveProposal } from "@/app/actions/proposals"
import { CheckCircle } from "lucide-react"

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
      <div className="text-center py-4">
        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
        <h3 className="font-semibold text-lg text-green-700">Successfully Approved!</h3>
        <p className="text-sm text-muted-foreground mt-1">
          The freelancer has been notified of your approval.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium mb-1 block">
          Your Full Name <span className="text-red-500">*</span>
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Type your name to sign"
          className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <p className="text-xs text-muted-foreground mt-1">
          This acts as your digital signature
        </p>
      </div>
      <button
        onClick={handleApprove}
        disabled={isPending || !name.trim()}
        className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
      >
        {isPending ? "Approving..." : "✅ Approve & Sign Proposal"}
      </button>
    </div>
  )
}