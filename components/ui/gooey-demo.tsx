"use client"

import * as React from "react"
import { GooeyFilter } from "@/components/ui/gooey-filter"

// =========================
// 🧬 GOOEY DEMO - MOTION UI HERO BLOCK
// UniMentorAI Design System (Marketing + AI Visual Layer)
// =========================

interface GooeyDemoProps {
  strength?: number
  className?: string
  title?: string
  subtitle?: string
}

export const GooeyDemo = React.memo(function GooeyDemo({
  strength = 12,
  className,
  title = "AI is thinking...",
  subtitle = "Unified learning intelligence in motion"
}: GooeyDemoProps) {

  return (
    <section
      className={
        "relative min-h-[420px] flex flex-col items-center justify-center rounded-2xl overflow-hidden " +
        "bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 " +
        className
      }
    >

      {/* ========================= */}
      {/* 🧬 GOO FILTER ENGINE */}
      {/* ========================= */}
      <GooeyFilter id="goo" strength={strength} />

      {/* ========================= */}
      {/* 🧠 TEXT CONTENT (HERO UX) */}
      {/* ========================= */}
      <div className="text-center mb-10 z-10">
        <h2 className="text-white text-2xl font-semibold tracking-tight">
          {title}
        </h2>

        <p className="text-white/60 text-sm mt-2">
          {subtitle}
        </p>
      </div>

      {/* ========================= */}
      {/* ⚡ GOOEY ANIMATION SYSTEM */}
      {/* ========================= */}
      <div
        className="relative flex gap-6 z-10"
        style={{ filter: "url(#goo)" }}
      >

        {/* 🔴 LEFT BLOB */}
        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-pink-500 to-red-400 shadow-lg animate-[moveLeft_2s_ease-in-out_infinite]" />

        {/* 🟢 CENTER BLOB */}
        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-green-400 to-lime-400 shadow-lg animate-[moveCenter_2s_ease-in-out_infinite]" />

        {/* 🔵 RIGHT BLOB */}
        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 shadow-lg animate-[moveRight_2s_ease-in-out_infinite]" />
      </div>

      {/* ========================= */}
      {/* 🌌 BACKGROUND GLOW EFFECT */}
      {/* ========================= */}
      <div className="absolute inset-0 opacity-30 blur-3xl">
        <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-purple-500 rounded-full -translate-x-1/2 -translate-y-1/2 animate-pulse" />
      </div>

    </section>
  )
})