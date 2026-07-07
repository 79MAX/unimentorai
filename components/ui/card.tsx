"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

// =========================
// 🧠 UNI MENTOR AI CARD SYSTEM
// SHADCN + STRIPE LEVEL UI PRIMITIVE
// =========================

type CardVariant = "default" | "outline" | "glass" | "ai"

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant
}

// =========================
// 🧱 MAIN CARD CONTAINER
// =========================

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          // =========================
          // BASE CARD STYLES
          // =========================
          "rounded-xl border p-4 transition-all",

          // =========================
          // VARIANTS
          // =========================
          variant === "default" &&
            "bg-white border-gray-200 shadow-sm",

          variant === "outline" &&
            "bg-transparent border-gray-300",

          variant === "glass" &&
            "bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg",

          variant === "ai" &&
            "bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-indigo-500/30 ai-glow",

          className
        )}
        {...props}
      />
    )
  }
)

Card.displayName = "Card"

---

# =========================
# 🧠 CARD HEADER
# =========================

export const CardHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn("flex flex-col space-y-1.5 mb-3", className)}
      {...props}
    />
  )
}

CardHeader.displayName = "CardHeader"

---

# =========================
# 📦 CARD CONTENT
# =========================

export const CardContent = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={cn("text-sm text-gray-600", className)} {...props} />
  )
}

CardContent.displayName = "CardContent"

---

# =========================
# 🧾 CARD FOOTER
# =========================

export const CardFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn("flex items-center justify-between mt-4", className)}
      {...props}
    />
  )
}

CardFooter.displayName = "CardFooter"