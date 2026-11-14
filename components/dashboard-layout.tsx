"use client"

import type React from "react"

import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { DashboardContentSkeleton } from "@/components/dashboard-content-skeleton"
import { DashboardShell } from "@/components/dashboard-shell"
import { useAuthStore } from "@/lib/auth-store"
import { resourcesForPage, useCMSStore } from "@/lib/store"
import { Toaster } from "@/components/ui/sonner"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const hasHydrated = useAuthStore((state) => state.hasHydrated)
  const loadedResources = useCMSStore((state) => state.loadedResources)
  const loadErrors = useCMSStore((state) => state.loadErrors)
  const loadResources = useCMSStore((state) => state.loadResources)
  const reset = useCMSStore((state) => state.reset)
  const router = useRouter()
  const pathname = usePathname()
  const required = resourcesForPage(pathname)
  const loaded = required.every((key) => loadedResources[key])
  const error = required.map((key) => loadErrors[key]).find(Boolean)

  useEffect(() => {
    try { localStorage.removeItem("porto-control-ai-local-v1") } catch { /* Browser storage can be disabled. */ }
    if (!hasHydrated) return
    if (!isAuthenticated) {
      reset()
      router.replace("/login")
      return
    }
    void loadResources(required).catch(() => {})
  }, [hasHydrated, isAuthenticated, router, pathname, loadResources, reset])

  if (!hasHydrated || !isAuthenticated) return null

  return (
    <DashboardShell>
      {loaded ? children : error ? (
        <div role="alert" className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-center">
          <p className="text-destructive">{error}</p>
          <button className="text-primary underline" onClick={() => void loadResources(required).catch(() => {})}>Try again</button>
        </div>
      ) : <DashboardContentSkeleton pathname={pathname} />}
      <Toaster position="top-right" richColors />
    </DashboardShell>
  )
}
