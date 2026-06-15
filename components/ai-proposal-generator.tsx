"use client"

import { useState } from "react"
import {
  Sparkles, X, Loader2, ChevronRight,
  User, Briefcase, DollarSign, Calendar, FileText
} from "lucide-react"

type Props = {
  onGenerated: (html: string) => void
  onClose: () => void
  userName: string
  businessName?: string
}

const PROJECT_TYPES = [
  "Website Design & Development",
  "Mobile App Development",
  "UI/UX Design",
  "Logo & Brand Identity",
  "Social Media Management",
  "SEO & Digital Marketing",
  "Content Writing & Copywriting",
  "E-commerce Development",
  "WordPress Development",
  "Video Editing & Production",
  "Graphic Design",
  "Custom Software Development",
]

export function AIProposalGenerator({ onGenerated, onClose, userName, businessName }: Props) {
  const [step, setStep] = useState<"form" | "generating" | "done">("form")
  const [clientName, setClientName] = useState("")
  const [projectType, setProjectType] = useState("")
  const [customProject, setCustomProject] = useState("")
  const [budget, setBudget] = useState("")
  const [deadline, setDeadline] = useState("")
  const [description, setDescription] = useState("")
  const [error, setError] = useState("")

  async function handleGenerate() {
    const finalProjectType = projectType === "other" ? customProject : projectType
    if (!clientName.trim()) { setError("Client name is required"); return }
    if (!finalProjectType.trim()) { setError("Project type is required"); return }

    setError("")
    setStep("generating")

    try {
      const res = await fetch("/api/ai/proposal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectType: finalProjectType,
          clientName,
          budget,
          deadline,
          description,
          yourName: userName,
          yourBusiness: businessName,
        }),
      })

      const data = await res.json()

      if (!data.success) {
        setError(data.error || "Generation failed")
        setStep("form")
        return
      }
      console.log("Generated proposal:", data.content)
      onGenerated(data.content)
      setStep("done")
    } catch {
      setError("Something went wrong. Please try again.")
      setStep("form")
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(12px)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl overflow-hidden"
        style={{
          background: "var(--bg-grid)",
          border: "0.5px solid var(--hairline-strong)",
          boxShadow: "var(--shadow-panel)",
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: "0.5px solid var(--hairline)" }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.1)", border: "0.5px solid var(--hairline-strong)" }}
            >
              <Sparkles className="w-4 h-4" style={{ color: "var(--text)" }} />
            </div>
            <div>
              <p className="text-[14px] font-semibold" style={{ color: "var(--text)" }}>
                AI Proposal Generator
              </p>
              <p className="text-[11px]" style={{ color: "var(--text-3)" }}>
                Powered by Gemini · Free
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors hover:bg-[rgba(255,255,255,0.06)]"
            style={{ color: "var(--text-3)" }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Generating state */}
        {step === "generating" && (
          <div className="flex flex-col items-center justify-center py-16 px-6 gap-4">
            <div className="relative">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{ background: "rgba(255,255,255,0.06)", border: "0.5px solid var(--hairline)" }}
              >
                <Loader2 className="w-7 h-7 animate-spin" style={{ color: "var(--text-2)" }} />
              </div>
              <div
                className="absolute inset-0 rounded-2xl animate-pulse"
                style={{ background: "radial-gradient(circle, rgba(255,255,255,0.08), transparent 70%)" }}
              />
            </div>
            <div className="text-center">
              <p className="text-[15px] font-semibold mb-1" style={{ color: "var(--text)" }}>
                Writing your proposal...
              </p>
              <p className="text-[13px]" style={{ color: "var(--text-3)" }}>
                Gemini is crafting a personalized proposal for {clientName}
              </p>
            </div>
            <div className="flex flex-col gap-2 w-full max-w-xs">
              {["Analyzing project requirements", "Writing introduction", "Crafting deliverables", "Adding pricing section"].map((step, i) => (
                <div key={step} className="flex items-center gap-2.5 text-[12px]" style={{ color: "var(--text-3)" }}>
                  <div
                    className="w-1 h-1 rounded-full animate-pulse"
                    style={{ background: "var(--text-3)", animationDelay: `${i * 300}ms` }}
                  />
                  {step}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Done state */}
        {step === "done" && (
          <div className="flex flex-col items-center justify-center py-14 px-6 gap-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ background: "rgba(48,209,88,0.14)", border: "0.5px solid rgba(48,209,88,0.3)" }}
            >
              <Sparkles className="w-7 h-7" style={{ color: "var(--status-success)" }} />
            </div>
            <div className="text-center">
              <p className="text-[15px] font-semibold mb-1" style={{ color: "var(--text)" }}>
                Proposal generated!
              </p>
              <p className="text-[13px]" style={{ color: "var(--text-3)" }}>
                Your AI proposal has been added to the editor. Review and edit before sending.
              </p>
            </div>
            <button onClick={onClose} className="btn-primary mt-2">
              Open in Editor
            </button>
          </div>
        )}

        {/* Form */}
        {step === "form" && (
          <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
            {error && (
              <p
                className="text-[12px] px-3 py-2 rounded-lg"
                style={{ color: "var(--status-error)", background: "var(--status-error-bg)", border: "0.5px solid var(--status-error)" }}
              >
                {error}
              </p>
            )}

            {/* Client name */}
            <div>
              <label className="flex items-center gap-1.5 mb-1.5 text-[11px] font-semibold uppercase tracking-wider"
                style={{ color: "var(--text-3)", fontFamily: "var(--font-mono)" }}>
                <User className="w-3 h-3" /> Client Name *
              </label>
              <input
                value={clientName}
                onChange={e => setClientName(e.target.value)}
                placeholder="Acme Corporation / John Smith"
                className="ui-input"
              />
            </div>

            {/* Project type */}
            <div>
              <label className="flex items-center gap-1.5 mb-1.5 text-[11px] font-semibold uppercase tracking-wider"
                style={{ color: "var(--text-3)", fontFamily: "var(--font-mono)" }}>
                <Briefcase className="w-3 h-3" /> Project Type *
              </label>
              <select
                value={projectType}
                onChange={e => setProjectType(e.target.value)}
                className="ui-input"
              >
                <option value="">Select project type</option>
                {PROJECT_TYPES.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
                <option value="other">Other (describe below)</option>
              </select>
              {projectType === "other" && (
                <input
                  value={customProject}
                  onChange={e => setCustomProject(e.target.value)}
                  placeholder="Describe the project type..."
                  className="ui-input mt-2"
                />
              )}
            </div>

            {/* Budget + Deadline */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="flex items-center gap-1.5 mb-1.5 text-[11px] font-semibold uppercase tracking-wider"
                  style={{ color: "var(--text-3)", fontFamily: "var(--font-mono)" }}>
                  <DollarSign className="w-3 h-3" /> Budget (₹)
                </label>
                <input
                  value={budget}
                  onChange={e => setBudget(e.target.value)}
                  placeholder="50,000"
                  className="ui-input"
                />
              </div>
              <div>
                <label className="flex items-center gap-1.5 mb-1.5 text-[11px] font-semibold uppercase tracking-wider"
                  style={{ color: "var(--text-3)", fontFamily: "var(--font-mono)" }}>
                  <Calendar className="w-3 h-3" /> Deadline
                </label>
                <input
                  value={deadline}
                  onChange={e => setDeadline(e.target.value)}
                  placeholder="4 weeks / 30 June"
                  className="ui-input"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="flex items-center gap-1.5 mb-1.5 text-[11px] font-semibold uppercase tracking-wider"
                style={{ color: "var(--text-3)", fontFamily: "var(--font-mono)" }}>
                <FileText className="w-3 h-3" /> Project Details
              </label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Describe the project briefly — what does the client need? Any specific requirements, tech stack, goals..."
                rows={3}
                className="ui-input resize-none"
              />
              <p className="text-[11px] mt-1.5" style={{ color: "var(--text-3)" }}>
                More detail = better proposal. Even a few sentences help a lot.
              </p>
            </div>

            {/* Generate button */}
            <button
              onClick={handleGenerate}
              className="btn-primary w-full justify-center py-3 text-[13px] mt-2"
            >
              <Sparkles className="w-4 h-4" />
              Generate Proposal with AI
              <ChevronRight className="w-4 h-4" />
            </button>

            <p className="text-center text-[11px]" style={{ color: "var(--text-3)" }}>
              Powered by Google Gemini · Free · Takes ~5 seconds
            </p>
          </div>
        )}
      </div>
    </div>
  )
}