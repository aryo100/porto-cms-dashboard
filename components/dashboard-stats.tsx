"use client"

import { StatCard } from "@/components/common/stat-card"
import { useCMSStore } from "@/lib/store"
import { Code, FileText, FolderOpen } from "lucide-react"

export function DashboardStats() {
  const stats = useCMSStore((state) => state.dashboardStats)

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <StatCard title="Projects" value={stats?.totalProjects ?? 0} footer={`${stats?.completedProjects ?? 0} completed`} icon={FolderOpen} />
      <StatCard title="Blog Posts" value={stats?.totalBlogPosts ?? 0} footer="Published articles" icon={FileText} />
      <StatCard title="Skills" value={stats?.totalSkills ?? 0} footer="Skills in your profile" icon={Code} />
    </div>
  )
}
