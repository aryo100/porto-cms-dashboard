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

        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.5fr_1.2fr]">
          <QuickActions />
          <RecentActivity />
          <PreviewSection />
        </div>
      </div>
    </DashboardLayout>
  )
}