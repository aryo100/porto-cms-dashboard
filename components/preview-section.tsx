"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Layout } from "lucide-react"
import { apiRequest } from "@/lib/api-client"
import { Skeleton } from "@/components/ui/skeleton"

interface PageSummary { page: string; updatedAt: string }

export function PreviewSection() {
  const [pages, setPages] = useState<PageSummary[]>([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    void apiRequest<{ data: PageSummary[] }>("/content")
      .then((result) => { if (active) setPages(result.data) })
      .catch((cause) => { if (active) setError(cause instanceof Error ? cause.message : "Failed to load pages") })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  return (
    <Card>
      <CardHeader><CardTitle>Portfolio Pages</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        {loading && <div role="status" aria-label="Loading portfolio pages" className="space-y-4">
          <span className="sr-only">Loading portfolio pages...</span>
          {Array.from({ length: 4 }, (_, index) => <div key={index} className="flex items-center gap-3 rounded-lg border p-3"><Skeleton className="h-9 w-9" /><Skeleton className="h-4 flex-1" /><Skeleton className="h-3 w-16" /></div>)}
        </div>}
        {!loading && !error && pages.length === 0 && <p className="text-sm text-muted-foreground">No portfolio pages yet.</p>}
        {pages.map((page) => (
          <div key={page.page} className="flex min-w-0 items-center justify-between gap-3 rounded-lg border bg-muted/30 p-3">
            <div className="flex min-w-0 items-center gap-3"><div className="shrink-0 rounded-md bg-primary/10 p-2"><Layout className="h-5 w-5 text-primary" /></div><div className="truncate font-medium capitalize" title={page.page}>{page.page}</div></div>
            <div className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground"><Clock className="h-3.5 w-3.5" />{new Date(page.updatedAt).toLocaleDateString()}</div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
