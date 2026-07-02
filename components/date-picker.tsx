"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react"

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
]

// Quick-select options shown below the calendar
const QUICK = [
  { label: "Today",     days: 0 },
  { label: "+7 days",   days: 7 },
  { label: "+15 days",  days: 15 },
  { label: "+30 days",  days: 30 },
  { label: "+45 days",  days: 45 },
  { label: "+60 days",  days: 60 },
]

function toYMD(date: Date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

function fromYMD(ymd: string): Date | null {
  if (!ymd) return null
  const [y, m, d] = ymd.split("-").map(Number)
  return new Date(y, m - 1, d)
}

function formatDisplay(ymd: string): string {
  const d = fromYMD(ymd)
  if (!d) return ""
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Select due date",
  minDate,
}: {
  value: string
  onChange: (val: string) => void
  placeholder?: string
  minDate?: string
}) {
  const [open, setOpen] = useState(false)
  const [viewYear, setViewYear] = useState(() => {
    const d = fromYMD(value) ?? new Date()
    return d.getFullYear()
  })
  const [viewMonth, setViewMonth] = useState(() => {
    const d = fromYMD(value) ?? new Date()
    return d.getMonth()
  })

  const containerRef = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [open])

  // Sync view when value changes externally
  useEffect(() => {
    const d = fromYMD(value)
    if (d) {
      setViewYear(d.getFullYear())
      setViewMonth(d.getMonth())
    }
  }, [value])

  function openPicker() {
    const d = fromYMD(value) ?? new Date()
    setViewYear(d.getFullYear())
    setViewMonth(d.getMonth())
    setOpen(true)
  }

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
    else setViewMonth(m => m - 1)
  }

  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
    else setViewMonth(m => m + 1)
  }

  function selectDay(day: number) {
    const selected = new Date(viewYear, viewMonth, day)
    onChange(toYMD(selected))
    setOpen(false)
  }

  function selectQuick(days: number) {
    const d = addDays(new Date(), days)
    onChange(toYMD(d))
    setOpen(false)
  }

  // Build calendar grid
  const firstDay = new Date(viewYear, viewMonth, 1).getDay() // 0=Sun
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const today = toYMD(new Date())
  const minYMD = minDate ?? ""

  // Cells: null = empty padding, number = day
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
  // Pad to complete last row
  while (cells.length % 7 !== 0) cells.push(null)

  return (
    <div ref={containerRef} style={{ position: "relative", width: "100%" }}>
      {/* Trigger button — matches ui-input style */}
      <button
        type="button"
        onClick={openPicker}
        className="ui-input flex items-center gap-2 text-left"
        style={{
          color: value ? "var(--text)" : "var(--text-3)",
          cursor: "pointer",
          justifyContent: "space-between",
        }}
      >
        <span className="flex-1 truncate">
          {value ? formatDisplay(value) : placeholder}
        </span>
        <Calendar className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--text-3)" }} />
      </button>

      {/* Calendar dropdown */}
      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: 0,
            zIndex: 100,
            width: "280px",
            background: "#1c1c1f",
            border: "0.5px solid rgba(255,255,255,0.14)",
            borderRadius: "14px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.7), 0 0 0 0.5px rgba(255,255,255,0.06)",
            overflow: "hidden",
          }}
        >
          {/* Month navigation */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 12px 8px",
              borderBottom: "0.5px solid rgba(255,255,255,0.07)",
            }}
          >
            <button
              type="button"
              onClick={prevMonth}
              style={{
                width: "28px",
                height: "28px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "8px",
                background: "rgba(255,255,255,0.05)",
                color: "var(--text-3)",
                border: "none",
                cursor: "pointer",
                transition: "background 120ms",
              }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.09)")}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)")}
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--text)", letterSpacing: "-0.01em" }}>
                {MONTHS[viewMonth]}
              </p>
              <p style={{ fontSize: "11px", color: "var(--text-3)", marginTop: "1px", fontFamily: "var(--font-mono)" }}>
                {viewYear}
              </p>
            </div>

            <button
              type="button"
              onClick={nextMonth}
              style={{
                width: "28px",
                height: "28px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "8px",
                background: "rgba(255,255,255,0.05)",
                color: "var(--text-3)",
                border: "none",
                cursor: "pointer",
                transition: "background 120ms",
              }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.09)")}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)")}
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Day grid */}
          <div style={{ padding: "10px 10px 4px" }}>
            {/* Weekday headers */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", marginBottom: "4px" }}>
              {DAYS.map(d => (
                <div
                  key={d}
                  style={{
                    textAlign: "center",
                    fontSize: "10px",
                    fontWeight: 600,
                    color: "rgba(255,255,255,0.22)",
                    padding: "2px 0",
                    fontFamily: "var(--font-mono)",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  {d}
                </div>
              ))}
            </div>

            {/* Day cells */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "1px" }}>
              {cells.map((day, i) => {
                if (day === null) return <div key={`empty-${i}`} />

                const cellYMD = toYMD(new Date(viewYear, viewMonth, day))
                const isSelected = cellYMD === value
                const isToday = cellYMD === today
                const isPast = minYMD ? cellYMD < minYMD : false

                return (
                  <button
                    key={day}
                    type="button"
                    disabled={isPast}
                    onClick={() => selectDay(day)}
                    style={{
                      width: "100%",
                      aspectRatio: "1",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "7px",
                      fontSize: "12px",
                      fontWeight: isSelected ? 700 : isToday ? 600 : 400,
                      border: isToday && !isSelected ? "0.5px solid rgba(255,255,255,0.2)" : "none",
                      cursor: isPast ? "default" : "pointer",
                      transition: "all 120ms",
                      background: isSelected
                        ? "#ffffff"
                        : "transparent",
                      color: isSelected
                        ? "#0a0a0c"
                        : isPast
                        ? "rgba(255,255,255,0.12)"
                        : isToday
                        ? "var(--text)"
                        : "var(--text-2)",
                      opacity: isPast ? 0.4 : 1,
                    }}
                    onMouseEnter={e => {
                      if (!isSelected && !isPast) {
                        (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.08)"
                      }
                    }}
                    onMouseLeave={e => {
                      if (!isSelected) {
                        (e.currentTarget as HTMLElement).style.background = isSelected ? "#ffffff" : "transparent"
                      }
                    }}
                  >
                    {day}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Quick select */}
          <div
            style={{
              padding: "8px 10px 10px",
              borderTop: "0.5px solid rgba(255,255,255,0.07)",
              display: "flex",
              flexWrap: "wrap",
              gap: "4px",
            }}
          >
            {QUICK.map(q => (
              <button
                key={q.label}
                type="button"
                onClick={() => selectQuick(q.days)}
                style={{
                  padding: "4px 10px",
                  borderRadius: "20px",
                  fontSize: "11px",
                  fontWeight: 500,
                  background: "rgba(255,255,255,0.06)",
                  color: "var(--text-2)",
                  border: "0.5px solid rgba(255,255,255,0.10)",
                  cursor: "pointer",
                  transition: "all 120ms",
                  fontFamily: "var(--font-mono)",
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement
                  el.style.background = "rgba(255,255,255,0.12)"
                  el.style.color = "var(--text)"
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement
                  el.style.background = "rgba(255,255,255,0.06)"
                  el.style.color = "var(--text-2)"
                }}
              >
                {q.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
