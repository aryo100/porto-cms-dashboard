import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
      <Card role="status" aria-label="Loading login page" className="w-full max-w-md">
        <span className="sr-only">Loading login page...</span>
        <CardHeader className="space-y-4">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-4 w-64 max-w-full" />
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2"><Skeleton className="h-4 w-16" /><Skeleton className="h-10 w-full" /></div>
          <div className="space-y-2"><Skeleton className="h-4 w-20" /><Skeleton className="h-10 w-full" /></div>
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    </main>
  )
}
