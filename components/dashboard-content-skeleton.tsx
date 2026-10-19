import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface DashboardContentSkeletonProps {
  pathname: string
}

function StatSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-6 w-6 rounded-full" />
      </CardHeader>
      <CardContent className="space-y-3">
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-3 w-36 max-w-full" />
      </CardContent>
    </Card>
  )
}

function ListSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <Skeleton className="h-9 w-52 max-w-[50%]" />
        <Skeleton className="h-9 w-32" />
      </CardHeader>
      <CardContent className="space-y-1">
        {Array.from({ length: rows }, (_, index) => (
          <div key={index} className="flex items-center gap-4 border-t py-4">
            <div className="flex-1 space-y-2"><Skeleton className="h-4 w-2/3" /><Skeleton className="h-3 w-1/2" /></div>
            <Skeleton className="hidden h-5 w-24 sm:block" />
            <Skeleton className="hidden h-5 w-20 md:block" />
            <Skeleton className="h-8 w-8" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

function TimelineSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between"><Skeleton className="h-6 w-40" /><Skeleton className="h-9 w-36" /></CardHeader>
      <CardContent className="space-y-8">
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index} className="flex gap-4">
            <Skeleton className="h-12 w-12 shrink-0 rounded-full" />
            <div className="flex-1 space-y-3"><Skeleton className="h-5 w-56 max-w-full" /><Skeleton className="h-4 w-40" /><Skeleton className="h-4 w-64 max-w-full" /><Skeleton className="h-4 w-full" /></div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export function DashboardContentSkeleton({ pathname }: DashboardContentSkeletonProps) {
  const isDashboard = pathname === "/"
  const isSettings = pathname === "/settings"
  const isExperience = pathname === "/experience"
  const statCount = isExperience ? 4 : 3

  return (
    <div role="status" aria-label="Loading CMS content" className="space-y-6" aria-busy="true">
      <span className="sr-only">Loading content...</span>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-3"><Skeleton className="h-8 w-48" /><Skeleton className="h-4 w-72 max-w-full" /></div>
        {!isDashboard && <Skeleton className="h-9 w-36" />}
      </div>

      {!isSettings && <div className={`grid gap-4 md:grid-cols-2 ${isExperience ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
        {Array.from({ length: statCount }, (_, index) => <StatSkeleton key={index} />)}
      </div>}

      {isDashboard ? (
        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.5fr_1.2fr]">
          <ListSkeleton rows={4} />
          <ListSkeleton rows={5} />
          <ListSkeleton rows={4} />
        </div>
      ) : isSettings ? (
        <>
          <Skeleton className="h-10 w-full" />
          <Card><CardHeader><Skeleton className="h-6 w-44" /></CardHeader><CardContent className="space-y-6">
            <div className="flex items-center gap-5"><Skeleton className="h-24 w-24 rounded-full" /><Skeleton className="h-9 w-40" /></div>
            <div className="grid gap-4 md:grid-cols-2">{Array.from({ length: 4 }, (_, index) => <div key={index} className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-10 w-full" /></div>)}</div>
            <Skeleton className="h-24 w-full" />
          </CardContent></Card>
        </>
      ) : isExperience ? (
        <><Skeleton className="h-10 w-full" /><TimelineSkeleton /></>
      ) : (
        <>
          <ListSkeleton />
        </>
      )}
    </div>
  )
}
