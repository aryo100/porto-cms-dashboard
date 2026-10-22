"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import type { LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  FolderOpen,
  FileText,
  Briefcase,
  GraduationCap,
  Code,
  Award,
  Settings,
  Loader2,
  LogOut,
  Menu,
  Search,
} from "lucide-react"
import { useAuthStore } from "@/lib/auth-store"
import { useCMSStore } from "@/lib/store"

interface TopNavbarProps {
  onMenuClick: () => void
}

interface ResultItem {
  section: string
  icon: LucideIcon
  label: string
  path: string
}

const settingsEntries = [
  { label: "Personal Website", keywords: "website url live site preview" },
  { label: "Profile & Bio", keywords: "profile name email bio location avatar" },
  { label: "Site Config", keywords: "site title tagline description theme color language" },
  { label: "SEO Settings", keywords: "seo meta title description keywords analytics sitemap" },
  { label: "Social Links", keywords: "social github linkedin twitter" },
]

export function TopNavbar({ onMenuClick }: TopNavbarProps) {
  const router = useRouter()
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const projects = useCMSStore((state) => state.projects)
  const blogPosts = useCMSStore((state) => state.blogPosts)
  const workExperience = useCMSStore((state) => state.workExperience)
  const education = useCMSStore((state) => state.education)
  const skills = useCMSStore((state) => state.skills)
  const achievements = useCMSStore((state) => state.achievements)

  const [query, setQuery] = useState("")
  const [open, setOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return [] as ResultItem[]
    const match = (...texts: (string | null | undefined)[]) => texts.some((t) => t?.toLowerCase().includes(q))

    const items: ResultItem[] = []

    projects
      .filter((p) => match(p.title, p.description, p.category, ...(p.tags ?? [])))
      .slice(0, 3)
      .forEach((p) =>
        items.push({
          section: "Projects",
          icon: FolderOpen,
          label: p.title,
          path: `/projects?q=${encodeURIComponent(p.title)}`,
        }),
      )

    blogPosts
      .filter((p) => match(p.title, p.description, p.slug, ...(p.content ?? [])))
      .slice(0, 3)
      .forEach((p) =>
        items.push({
          section: "Blog Posts",
          icon: FileText,
          label: p.title,
          path: `/blog?q=${encodeURIComponent(p.title)}`,
        }),
      )

    workExperience
      .filter((e) => match(e.position, e.company, e.description))
      .slice(0, 3)
      .forEach((e) =>
        items.push({
          section: "Experience",
          icon: Briefcase,
          label: `${e.position} — ${e.company}`,
          path: `/experience?focus=${e.id}&type=work`,
        }),
      )

    education
      .filter((e) => match(e.institution, e.degree))
      .slice(0, 3)
      .forEach((e) =>
        items.push({
          section: "Education",
          icon: GraduationCap,
          label: `${e.degree} — ${e.institution}`,
          path: `/experience?focus=${e.id}&type=education`,
        }),
      )

    skills
      .filter((s) => match(s.name, s.category))
      .slice(0, 3)
      .forEach((s) =>
        items.push({
          section: "Skills",
          icon: Code,
          label: s.name,
          path: `/experience?focus=${s.id}&type=skills`,
        }),
      )

    achievements
      .filter((a) => match(a.title, a.issuer))
      .slice(0, 3)
      .forEach((a) =>
        items.push({
          section: "Achievements",
          icon: Award,
          label: a.title,
          path: `/experience?focus=${a.id}&type=achievement`,
        }),
      )

    settingsEntries
      .filter((s) => match(s.label, s.keywords))
      .slice(0, 4)
      .forEach((s) =>
        items.push({ section: "Settings", icon: Settings, label: s.label, path: "/settings" }),
      )

    return items
  }, [query, projects, blogPosts, workExperience, education, skills, achievements])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const navigate = (path: string) => {
    setOpen(false)
    setQuery("")
    router.push(path)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (results.length > 0) navigate(results[0].path)
      else navigate(`/projects?q=${encodeURIComponent(query.trim())}`)
    }
  }

  const handleLogout = async () => {
    setLoggingOut(true)
    await new Promise((resolve) => setTimeout(resolve, 400))
    logout()
    router.replace("/login")
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center gap-4 px-4 lg:px-6">
        {/* Mobile Menu Button */}
        <Button variant="ghost" size="sm" className="lg:hidden" onClick={onMenuClick}>
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open sidebar</span>
        </Button>
        <span className="shrink-0 text-sm font-semibold text-foreground lg:hidden">Porto Control</span>

        {/* Search Bar */}
        <div ref={searchRef} className="relative flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search everything..."
              className="pl-10 bg-muted/50 border-0 focus-visible:ring-1"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setOpen(true)
              }}
              onFocus={() => setOpen(true)}
              onKeyDown={handleKeyDown}
            />
          </div>

          {open && query.trim() && (
            <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-80 overflow-auto rounded-md border bg-popover text-popover-foreground shadow-md">
              {results.length === 0 ? (
                <p className="p-3 text-sm text-muted-foreground">No results found</p>
              ) : (
                <div className="p-1">
                  {results.map((item, i) => (
                    <div key={`${item.section}-${i}`}>
                      {(i === 0 || results[i - 1].section !== item.section) && (
                        <p className="px-2 py-1 text-xs font-medium text-muted-foreground">{item.section}</p>
                      )}
                      <button
                        onClick={() => navigate(item.path)}
                        className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent"
                      >
                        <item.icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                        <span className="truncate">{item.label}</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Side Actions */}
        <div className="ml-auto flex items-center gap-2">
          {user?.email && <span className="hidden text-sm text-muted-foreground sm:inline">{user.email}</span>}
          <Button variant="outline" size="sm" onClick={handleLogout} disabled={loggingOut}>
            {loggingOut ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
            <span>Logout</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
