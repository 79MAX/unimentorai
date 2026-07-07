"use client"

import { ReactNode } from "react"
import {
  LayoutDashboard,
  BookOpen,
  Brain,
  Award,
  BarChart3,
  CreditCard,
  Settings,
  Bell,
  Search,
  Globe,
  Menu
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Avatar } from "@/components/ui/avatar"

// =========================
// TYPES
// =========================

interface DashboardLayoutProps {
  children: ReactNode
}

// =========================
// NAVIGATION
// =========================

const navigation = [
  {
    name: "Dashboard",
    icon: LayoutDashboard
  },
  {
    name: "Courses",
    icon: BookOpen
  },
  {
    name: "AI Mentor",
    icon: Brain
  },
  {
    name: "Certificates",
    icon: Award
  },
  {
    name: "Analytics",
    icon: BarChart3
  },
  {
    name: "Billing",
    icon: CreditCard
  },
  {
    name: "Settings",
    icon: Settings
  }
]

// =========================
// LAYOUT
// =========================

export default function DashboardLayout({
  children
}: DashboardLayoutProps) {
  return (
    <div
      className="
      min-h-screen
      bg-background
      "
    >
      {/* ========================= */}
      {/* SIDEBAR */}
      {/* ========================= */}

      <aside
        className="
        fixed
        left-0
        top-0
        z-40
        hidden
        h-screen
        w-72
        border-r
        bg-card
        lg:flex
        lg:flex-col
        "
      >
        {/* LOGO */}
        <div
          className="
          flex
          h-20
          items-center
          border-b
          px-6
          "
        >
          <div
            className="
            flex
            items-center
            gap-3
            "
          >
            <Brain
              className="
              h-8
              w-8
              text-indigo-600
              "
            />

            <div>
              <h1
                className="
                font-bold
                "
              >
                UniMentorAI
              </h1>

              <p
                className="
                text-xs
                text-muted-foreground
                "
              >
                AI Learning Platform
              </p>
            </div>
          </div>
        </div>

        {/* NAVIGATION */}
        <nav
          className="
          flex-1
          p-4
          "
        >
          <div className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon

              return (
                <button
                  key={item.name}
                  className="
                  flex
                  w-full
                  items-center
                  gap-3
                  rounded-xl
                  px-4
                  py-3
                  text-sm
                  transition
                  hover:bg-muted
                  "
                >
                  <Icon className="h-5 w-5" />
                  {item.name}
                </button>
              )
            })}
          </div>
        </nav>

        {/* FOOTER */}
        <div
          className="
          border-t
          p-4
          "
        >
          <div
            className="
            rounded-xl
            border
            p-4
            "
          >
            <p
              className="
              text-sm
              font-medium
              "
            >
              PRO PLAN
            </p>

            <p
              className="
              mt-1
              text-xs
              text-muted-foreground
              "
            >
              Access premium AI tools
            </p>
          </div>
        </div>
      </aside>

      {/* ========================= */}
      {/* MAIN AREA */}
      {/* ========================= */}

      <div className="lg:pl-72">

        {/* HEADER */}

        <header
          className="
          sticky
          top-0
          z-30
          border-b
          bg-background/80
          backdrop-blur
          "
        >
          <div
            className="
            flex
            h-20
            items-center
            justify-between
            px-6
            "
          >
            {/* LEFT */}
            <div
              className="
              flex
              items-center
              gap-4
              "
            >
              <button
                className="
                lg:hidden
                "
              >
                <Menu className="h-6 w-6" />
              </button>

              <div
                className="
                hidden
                md:block
                w-80
                "
              >
                <Input
                  placeholder="Search courses, mentors..."
                  leftIcon={
                    <Search
                      className="
                      h-4
                      w-4
                      "
                    />
                  }
                />
              </div>
            </div>

            {/* RIGHT */}
            <div
              className="
              flex
              items-center
              gap-4
              "
            >
              <button>
                <Globe className="h-5 w-5" />
              </button>

              <button>
                <Bell className="h-5 w-5" />
              </button>

              <Avatar
                src="/images/avatar.png"
              />
            </div>
          </div>
        </header>

        {/* CONTENT */}

        <main
          className="
          p-6
          "
        >
          {children}
        </main>
      </div>
    </div>
  )
}