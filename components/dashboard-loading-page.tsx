import { DashboardContentSkeleton } from "@/components/dashboard-content-skeleton"
import { DashboardShell } from "@/components/dashboard-shell"

export function DashboardLoadingPage({ pathname }: { pathname: string }) {
  return (
    <DashboardShell>
      <DashboardContentSkeleton pathname={pathname} />
    </DashboardShell>
  )
}
