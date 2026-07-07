"use client"

import { ReactNode, useState } from "react"
import {
  BookOpen,
  Brain,
  ChevronLeft,
  ChevronRight,
  Layers,
  MessageSquare,
  CheckCircle
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

// =========================
// 🧠 LEARNING LAYOUT
// UNI MENTOR AI
// =========================

interface LearningLayoutProps {
  children: ReactNode
  title?: string
  courseTitle?: string
}

export default function LearningLayout({
  children,
  title = "Lesson",
  courseTitle = "Course"
}: LearningLayoutProps) {

  const [focusMode, setFocusMode] = useState(false)

  return (
    <div
      className={cn(
        "min-h-screen bg-background text-foreground",
        focusMode && "bg-black text-white"
      )}
    >
      {/* ========================= */}
      {/* TOP BAR */}
      {/* ========================= */}

      <header
        className="
        sticky
        top-0
        z-40
        border-b
        bg-background/80
        backdrop-blur
        "
      >
        <div
          className="
          flex
          items-center
          justify-between
          px-6
          py-4
          "
        >
          {/* LEFT */}
          <div className="flex items-center gap-4">
            <BookOpen className="h-5 w-5 text-indigo-600" />

            <div>
              <p className="text-xs text-muted-foreground">
                {courseTitle}
              </p>

              <h1 className="font-semibold">
                {title}
              </h1>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-3">
            <Badge variant="ai">
              AI Mentor Active
            </Badge>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFocusMode(!focusMode)}
            >
              {focusMode ? "Exit Focus" : "Focus Mode"}
            </Button>
          </div>
        </div>
      </header>

      {/* ========================= */}
      {/* MAIN CONTENT GRID */}
      {/* ========================= */}

      <div
        className="
        grid
        grid-cols-1
        lg:grid-cols-12
        min-h-[calc(100vh-64px)]
        "
      >

        {/* ========================= */}
        {/* LEFT NAV (LESSONS) */}
        {/* ========================= */}

        <aside
          className={cn(
            "hidden lg:block border-r p-4",
            focusMode && "hidden"
          )}
        >
          <div className="space-y-3">

            <h2 className="text-sm font-semibold flex items-center gap-2">
              <Layers className="h-4 w-4" />
              Chapters
            </h2>

            {["Intro", "Basics", "Practice", "Quiz"].map((item, i) => (
              <button
                key={item}
                className="
                w-full
                text-left
                rounded-lg
                px-3
                py-2
                text-sm
                hover:bg-muted
                flex
                items-center
                justify-between
                "
              >
                {item}

                {i < 2 && (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                )}
              </button>
            ))}
          </div>
        </aside>

        {/* ========================= */}
        {/* MAIN CONTENT */}
        {/* ========================= */}

        <main
          className={cn(
            "col-span-1 lg:col-span-8 p-6",
            focusMode && "lg:col-span-12"
          )}
        >
          {children}
        </main>

        {/* ========================= */}
        {/* AI ASSISTANT PANEL */}
        {/* ========================= */}

        <aside
          className={cn(
            "hidden lg:block border-l p-4",
            focusMode && "hidden"
          )}
        >
          <div className="space-y-4">

            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-indigo-600" />
              <h2 className="font-semibold">
                AI Mentor
              </h2>
            </div>

            <div
              className="
              rounded-xl
              border
              p-3
              text-sm
              bg-muted/50
              "
            >
              Ask me anything about this lesson
            </div>

            <Button
              variant="ai"
              className="w-full"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Ask AI
            </Button>

          </div>
        </aside>
      </div>

      {/* ========================= */}
      {/* NAVIGATION FOOTER */}
      {/* ========================= */}

      <footer
        className="
        fixed
        bottom-0
        left-0
        right-0
        border-t
        bg-background/90
        backdrop-blur
        "
      >
        <div
          className="
          flex
          items-center
          justify-between
          px-6
          py-3
          "
        >
          <Button variant="ghost" size="sm">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>

          <Button variant="ai">
            Next Lesson
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </footer>
    </div>
  )
}