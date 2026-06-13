"use client"

import React, { useState } from 'react'

export default function DiagnosticPage() {
  const [color, setColor] = useState("red")

  return (
    <div className="flex items-center justify-center h-screen" style={{ background: color }}>
      Home Page
    </div>
  )
}