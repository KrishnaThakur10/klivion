"use client"

import { useState, useTransition } from "react"
import { createProposal, deleteProposal, updateProposalStatus } from "@/app/actions/proposals"
import TiptapEditor from "@/components/tiptap-editor"
import { FileText, Plus, Trash2, Send, CheckCircle, Clock, ArrowLeft } from "lucide-react"

type Client = { id: string; name: string }
type Proposal = {
  id: string
  title: string
  content: string
  status: string
  createdAt: Date
  client: Client | null
}

const statusStyles: Record<string, string> = {
  draft:  "bg-gray-100 text-gray-600",
  sent:   "bg-blue-100 text-blue-600",
  viewed: "bg-yellow-100 text-yellow-600",
  signed: "bg-green-100 text-green-600",
}

export function ProposalsClient({ proposals, clients }: { proposals: Proposal[], clients: Client[] }) {
  const [view, setView] = useState<"list" | "new">("list")
  const [title, setTitle] = useState("")
  const [clientId, setClientId] = useState("")
  const [content, setContent] = useState("")
  const [error, setError] = useState("")
  const [isPending, startTransition] = useTransition()
  const [shareLink, setShareLink] = useState("")
  const [showShare, setShowShare] = useState(false)

  function handleCreate() {
    setError("")
    startTransition(async () => {
      const result = await createProposal({ title, clientId: clientId || undefined, content })
      if (result?.error) {
        setError(result.error)
      } else {
        setView("list")
        setTitle("")
        setClientId("")
        setContent("")
      }
    })
  }

  function handleDelete(id: string) {
    startTransition(async () => { await deleteProposal(id) })
  }

function handleStatus(id: string, status: string) {
  startTransition(async () => {
    const result = await updateProposalStatus(id, status)
    if (status === "sent" && result?.token) {
      const link = `${window.location.origin}/proposals/${result.token}`
      setShareLink(link)
      setShowShare(true)
    }
  })
}

  if (view === "new") {
    return (
      <div>
        <button onClick={() => setView("list")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to proposals
        </button>

        <div className="bg-card border border-border rounded-xl p-6 mb-4">
          <h2 className="font-semibold mb-4">New Proposal</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="text-sm font-medium mb-1 block">Title <span className="text-red-500">*</span></label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Web Design Proposal for Acme Corp"
                className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Client</label>
              <select
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select a client (optional)</option>
                {clients.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
              </select>
            </div>
          </div>

          {/* ✅ New Professional Editor */}
          <TiptapEditor
            content=""
            onChange={(html) => setContent(html)}
            placeholder="Write your proposal here..."
          />

          {error && <p className="text-sm text-red-500 mt-3">{error}</p>}

          <div className="flex gap-3 mt-4">
            <button onClick={handleCreate} disabled={isPending}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors">
              {isPending ? "Saving..." : "Save Proposal"}
            </button>
            <button onClick={() => setView("list")}
              className="border border-border px-4 py-2 rounded-lg text-sm font-medium hover:bg-accent transition-colors">
              Cancel
            </button>
          </div>
        </div>
      </div>
    )
  }

  {/* Share Link Modal */}
  
  return (
    <div>
      {showShare && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-md w-full shadow-xl">
            <div className="text-center mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Send className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="font-semibold text-lg">Proposal Ready to Send!</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Copy this link and send it to your client
              </p>
            </div>
      
            <div className="flex gap-2 mb-4">
              <input
                readOnly
                value={shareLink}
                className="flex-1 border border-border rounded-lg px-3 py-2 text-sm bg-muted focus:outline-none"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(shareLink)
                  alert("Link copied!")
                }}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shrink-0"
              >
                Copy
              </button>
            </div>
      
            <p className="text-xs text-muted-foreground text-center mb-4">
              Your client can view and sign the proposal at this link
            </p>
      
            <button
              onClick={() => setShowShare(false)}
              className="w-full border border-border py-2 rounded-lg text-sm hover:bg-accent transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}
      <button onClick={() => setView("new")}
        className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors mb-6">
        <Plus className="w-4 h-4" /> New Proposal
      </button>

      {proposals.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border rounded-xl">
          <FileText className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <h3 className="font-medium mb-1">No proposals yet</h3>
          <p className="text-sm text-muted-foreground">Create your first proposal to get started</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {proposals.map((p) => (
            <div key={p.id} className="bg-card border border-border rounded-xl p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium">{p.title}</div>
                  <div className="flex items-center gap-3 mt-1">
                    {p.client && <span className="text-xs text-muted-foreground">{p.client.name}</span>}
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusStyles[p.status]}`}>
                      {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />{new Date(p.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {p.status === "draft" && (
                  <button onClick={() => handleStatus(p.id, "sent")} disabled={isPending}
                    className="flex items-center gap-1 text-xs border border-border px-3 py-1.5 rounded-lg hover:bg-accent transition-colors">
                    <Send className="w-3 h-3" /> Send
                  </button>
                )}
                {p.status === "sent" && (
                  <button onClick={() => handleStatus(p.id, "signed")} disabled={isPending}
                    className="flex items-center gap-1 text-xs border border-green-200 text-green-600 px-3 py-1.5 rounded-lg hover:bg-green-50 transition-colors">
                    <CheckCircle className="w-3 h-3" /> Mark Signed
                  </button>
                )}
                <button onClick={() => handleDelete(p.id)} disabled={isPending}
                  className="text-muted-foreground hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-50">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}