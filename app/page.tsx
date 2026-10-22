import { DashboardLayout } from "@/components/dashboard-layout"
import { DashboardStats } from "@/components/dashboard-stats"
import { QuickActions } from "@/components/quick-actions"
import { RecentActivity } from "@/components/recent-activity"
import { PreviewSection } from "@/components/preview-section"
import { PageHeader } from "@/components/common/page-header"

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader title="Welcome back!" description="Manage your portfolio content and track your professional presence." />

        <DashboardStats />

        <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.5fr)_minmax(0,1.2fr)]">
          <QuickActions />
          <RecentActivity />
          <PreviewSection />
        </div>
      </div>
    </DashboardLayout>
  )
}
