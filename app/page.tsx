import { DashboardLayout } from "@/components/dashboard-layout"
import { DashboardStats } from "@/components/dashboard-stats"
import { QuickActions } from "@/components/quick-actions"
import { RecentActivity } from "@/components/recent-activity"
import { PreviewSection } from "@/components/preview-section"

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-balance">{"Welcome back, Alex!"}</h1>
          <p className="text-muted-foreground text-pretty">
            {"Manage your portfolio content and track your professional presence."}
          </p>
        </div>

        {/* Stats Overview */}
        <DashboardStats />

        {/* Quick Actions */}
        <QuickActions />

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          <RecentActivity />
          <PreviewSection />
        </div>
      </div>
    </DashboardLayout>
  )
}
