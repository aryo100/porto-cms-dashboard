"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronRight } from "lucide-react"
import { apiRequest } from "@/lib/api-client"
import { Skeleton } from "@/components/ui/skeleton"

interface ActivityItem {
  id: number
  title: string
  type: string
  status: string
  lastModified: string
  target: string
}

export function RecentActivity() {
  const router = useRouter()
  const [items, setItems] = useState<ActivityItem[]>([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    void apiRequest<{ data: ActivityItem[] }>("/activity?limit=8")
      .then((result) => { if (active) setItems(result.data) })
      .catch((cause) => { if (active) setError(cause instanceof Error ? cause.message : "Failed to load activity") })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  const targetFor = (item: ActivityItem) => {
    const types: Record<string, string> = { Experience: "work", Education: "education", Skill: "skills", Achievement: "achievement" }
    const type = types[item.type]
    return type ? `${item.target}&type=${type}` : item.target
  }

  return (
    <Card>
      <CardHeader><CardTitle>Recent Activity</CardTitle></CardHeader>
      <CardContent>
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        {loading && <div role="status" aria-label="Loading activity" className="space-y-4">
          <span className="sr-only">Loading activity...</span>
          {Array.from({ length: 4 }, (_, index) => <div key={index} className="flex items-center gap-3 border-b pb-4"><div className="flex-1 space-y-2"><Skeleton className="h-4 w-3/4" /><Skeleton className="h-3 w-24" /></div><Skeleton className="h-6 w-16" /></div>)}
        </div>}
        {!loading && !error && items.length === 0 && <p className="text-sm text-muted-foreground">No recent activity yet.</p>}
        {items.length > 0 && <Table>
          <TableHeader><TableRow><TableHead>Title</TableHead><TableHead>Type</TableHead><TableHead>Status</TableHead><TableHead className="w-[40px]" /></TableRow></TableHeader>
          <TableBody>{items.map((item) => (
            <TableRow key={`${item.type}-${item.id}`} className="h-16 cursor-pointer transition-colors hover:bg-accent/50" onClick={() => router.push(targetFor(item))}>
              <TableCell><div className="font-medium">{item.title}</div><div className="text-sm text-muted-foreground">{item.lastModified}</div></TableCell>
              <TableCell><Badge variant="outline">{item.type}</Badge></TableCell>
              <TableCell><Badge variant="secondary">{item.status}</Badge></TableCell>
              <TableCell><ChevronRight className="h-4 w-4 text-muted-foreground" /></TableCell>
            </TableRow>
          ))}</TableBody>
        </Table>}
      </CardContent>
    </Card>
  )
}
