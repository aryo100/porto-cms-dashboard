"use client"

import type React from "react"

import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { DashboardContentSkeleton } from "@/components/dashboard-content-skeleton"
import { DashboardShell } from "@/components/dashboard-shell"
import { useAuthStore } from "@/lib/auth-store"
import { useCMSStore } from "@/lib/store"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const hasHydrated = useAuthStore((state) => state.hasHydrated)
  const loaded = useCMSStore((state) => state.loaded)
  const error = useCMSStore((state) => state.error)
  const loadAll = useCMSStore((state) => state.loadAll)
  const reset = useCMSStore((state) => state.reset)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!hasHydrated) return
    if (!isAuthenticated) {
      reset()
      router.replace("/login")
      return
    }
    void loadAll()
  }, [hasHydrated, isAuthenticated, router, loadAll, reset])

  if (!hasHydrated || !isAuthenticated) return null

  return (
    <DashboardShell>
      {loaded ? children : error ? (
        <div role="alert" className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-center">
          <p className="text-destructive">{error}</p>
          <button className="text-primary underline" onClick={() => void loadAll()}>Coba lagi</button>
        </div>
      ) : <DashboardContentSkeleton pathname={pathname} />}
    </DashboardShell>
  )
}
