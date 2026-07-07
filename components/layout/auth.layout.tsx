"use client"

import { ReactNode } from "react"
import { GraduationCap } from "lucide-react"
import { cn } from "@/lib/utils"

// =========================
// 🧠 AUTH LAYOUT
// UNI MENTOR AI
// =========================

interface AuthLayoutProps {
  children: ReactNode
  title?: string
  subtitle?: string
  className?: string
}

export default function AuthLayout({
  children,
  title = "Welcome to UniMentorAI",
  subtitle = "Learn. Teach. Progress.",
  className
}: AuthLayoutProps) {
  return (
    <main
      className={cn(
        "min-h-screen",
        "grid lg:grid-cols-2",
        "bg-background",
        className
      )}
    >
      {/* ========================= */}
      {/* LEFT SIDE */}
      {/* ========================= */}

      <section
        className={cn(
          "hidden lg:flex",
          "relative overflow-hidden",
          "items-center justify-center",
          "bg-gradient-to-br",
          "from-indigo-600",
          "via-purple-600",
          "to-indigo-900",
          "text-white"
        )}
      >
        {/* Decorative Glow */}
        <div
          className="
          absolute
          h-[500px]
          w-[500px]
          rounded-full
          bg-white/10
          blur-3xl
          "
        />

        <div
          className="
          relative z-10
          max-w-lg
          px-10
          text-center
          "
        >
          <div
            className="
            mx-auto mb-6
            flex h-20 w-20
            items-center justify-center
            rounded-3xl
            bg-white/10
            backdrop-blur
            "
          >
            <GraduationCap size={42} />
          </div>

          <h1
            className="
            text-5xl
            font-bold
            leading-tight
            "
          >
            UniMentorAI
          </h1>

          <p
            className="
            mt-6
            text-xl
            text-indigo-100
            "
          >
            AI-powered learning platform built
            for students, teachers and professionals.
          </p>

          <div
            className="
            mt-10
            grid
            gap-4
            text-left
            "
          >
            <FeatureItem>
              Personalized AI Mentor
            </FeatureItem>

            <FeatureItem>
              Multilingual Learning
            </FeatureItem>

            <FeatureItem>
              Global Certificates
            </FeatureItem>

            <FeatureItem>
              AI Video Tutoring
            </FeatureItem>
          </div>
        </div>
      </section>

      {/* ========================= */}
      {/* RIGHT SIDE */}
      {/* ========================= */}

      <section
        className="
        flex
        min-h-screen
        items-center
        justify-center
        px-6
        py-12
        "
      >
        <div
          className="
          w-full
          max-w-md
          "
        >
          <div className="mb-8 text-center">
            <h2
              className="
              text-3xl
              font-bold
              "
            >
              {title}
            </h2>

            <p
              className="
              mt-2
              text-muted-foreground
              "
            >
              {subtitle}
            </p>
          </div>

          {children}
        </div>
      </section>
    </main>
  )
}

// =========================
// FEATURE ITEM
// =========================

function FeatureItem({
  children
}: {
  children: ReactNode
}) {
  return (
    <div
      className="
      flex
      items-center
      gap-3
      rounded-xl
      bg-white/10
      px-4
      py-3
      backdrop-blur
      "
    >
      <div
        className="
        h-2
        w-2
        rounded-full
        bg-white
        "
      />

      <span>{children}</span>
    </div>
  )
}