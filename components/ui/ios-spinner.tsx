"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

// =========================
// 🔄 IOS / APPLE-STYLE SPINNER
// UniMentorAI - Premium Loading Component
// =========================

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg"
  label?: string
}

export const Spinner = React.memo(function Spinner({
  className,
  size = "md",
  label = "Loading...",
  ...props
}: SpinnerProps) {
  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center",
        size === "sm" && "h-3 w-3",
        size === "md" && "h-5 w-5",
        size === "lg" && "h-8 w-8",
        className
      )}
      role="status"
      aria-label={label}
      {...props}
    >
      {/* 12 blades for smooth iOS-like rotation */}
      {Array.from({ length: 12 }).map((_, i) => (
        <span key={i} className="spinner-blade" />
      ))}

      {/* Screen reader support */}
      <span className="sr-only">{label}</span>
    </div>
  )
})