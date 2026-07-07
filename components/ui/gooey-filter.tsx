"use client"

import * as React from "react"

// =========================
// 🧬 GOOEY FILTER - UI PRIMITIVE
// UniMentorAI Design System (Motion Layer)
// =========================

interface GooeyFilterProps {
  id?: string
  strength?: number
  className?: string
}

// Predefined performance-safe strengths (CTO decision)
const PRESETS = {
  low: 6,
  medium: 10,
  high: 16,
} as const

export const GooeyFilter = React.memo(function GooeyFilter({
  id = "goo-filter",
  strength = PRESETS.medium,
  className,
}: GooeyFilterProps) {
  return (
    <svg
      className={className ?? "absolute w-0 h-0 pointer-events-none"}
      aria-hidden="true"
    >
      <defs>
        <filter id={id} colorInterpolationFilters="sRGB">

          {/* Blur stage */}
          <feGaussianBlur
            in="SourceGraphic"
            stdDeviation={strength}
            result="blur"
          />

          {/* Goo transformation matrix */}
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="
              1 0 0 0 0  
              0 1 0 0 0  
              0 0 1 0 0  
              0 0 0 18 -8"
            result="goo"
          />

          {/* Composite final output */}
          <feComposite
            in="SourceGraphic"
            in2="goo"
            operator="atop"
          />

        </filter>
      </defs>
    </svg>
  )
})