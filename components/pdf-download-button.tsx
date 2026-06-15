"use client"

import { useState } from "react"
import { Download, Loader2, Sun, Moon } from "lucide-react"

type Props = {
  targetId: string
  filename: string
  label?: string
}

export function PDFDownloadButton({ targetId, filename, label = "Download PDF" }: Props) {
  const [loading, setLoading] = useState(false)
  const [lightMode, setLightMode] = useState(false)

  async function handleDownload() {
    setLoading(true)
    try {
      const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
        import("jspdf"),
        import("html2canvas"),
      ])

      const element = document.getElementById(targetId)
      if (!element) throw new Error("Target element not found")

      // ── If light mode, inject temporary print styles ──
      let styleTag: HTMLStyleElement | null = null
      if (lightMode) {
        styleTag = document.createElement("style")
        styleTag.id = "pdf-light-override"
        styleTag.textContent = `
          #${targetId} {
            background: #ffffff !important;
            color: #0a0a0c !important;
          }
          #${targetId} * {
            background-color: transparent !important;
            color: #0a0a0c !important;
            border-color: #e5e5e5 !important;
          }
          #${targetId} h1,
          #${targetId} h2,
          #${targetId} h3,
          #${targetId} h4,
          #${targetId} strong {
            color: #0a0a0c !important;
          }
          #${targetId} p,
          #${targetId} li,
          #${targetId} td,
          #${targetId} th,
          #${targetId} span {
            color: #3a3a3c !important;
          }
          #${targetId} [style*="background"] {
            background: #f5f5f7 !important;
          }
          #${targetId} table,
          #${targetId} th,
          #${targetId} td {
            border-color: #e5e5e5 !important;
          }
          #${targetId} .rounded-2xl,
          #${targetId} .rounded-xl {
            background: #ffffff !important;
            box-shadow: 0 1px 4px rgba(0,0,0,0.08) !important;
          }
        `
        document.head.appendChild(styleTag)
        // Small wait for styles to apply
        await new Promise(r => setTimeout(r, 80))
      }

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: lightMode ? "#ffffff" : "#0a0a0c",
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
      })

      // ── Remove injected styles immediately after capture ──
      if (styleTag) {
        document.head.removeChild(styleTag)
      }

      const imgData = canvas.toDataURL("image/png")
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      })

      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      const imgWidth = pageWidth
      const imgHeight = (canvas.height * pageWidth) / canvas.width

      let heightLeft = imgHeight
      let position = 0

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      while (heightLeft > 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      pdf.save(filename)
    } catch (error) {
      console.error("PDF generation failed:", error)
      alert("Failed to generate PDF. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-2">

      {/* Dark / Light toggle */}
      <div
        className="flex items-center rounded-lg overflow-hidden"
        style={{ border: "0.5px solid var(--hairline)" }}
      >
        <button
          onClick={() => setLightMode(false)}
          title="Dark PDF"
          className="flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-medium transition-colors"
          style={{
            background: !lightMode ? "rgba(255,255,255,0.1)" : "transparent",
            color: !lightMode ? "var(--text)" : "var(--text-3)",
            borderRight: "0.5px solid var(--hairline)",
          }}
        >
          <Moon className="w-3 h-3" />
          <span className="hidden sm:inline">Dark</span>
        </button>
        <button
          onClick={() => setLightMode(true)}
          title="Light PDF"
          className="flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-medium transition-colors"
          style={{
            background: lightMode ? "rgba(255,255,255,0.1)" : "transparent",
            color: lightMode ? "var(--text)" : "var(--text-3)",
          }}
        >
          <Sun className="w-3 h-3" />
          <span className="hidden sm:inline">Light</span>
        </button>
      </div>

      {/* Download button */}
      <button
        onClick={handleDownload}
        disabled={loading}
        className="btn-ghost flex items-center gap-1.5 text-[13px] disabled:opacity-50"
      >
        {loading
          ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
          : <Download className="w-3.5 h-3.5" />
        }
        {loading ? "Generating..." : label}
      </button>
    </div>
  )
}