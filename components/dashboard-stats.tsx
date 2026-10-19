"use client"

import { StatCard } from "@/components/common/stat-card"
import { useCMSStore } from "@/lib/store"
import { Code, FileText, FolderOpen } from "lucide-react"

export function DashboardStats() {
  const projects = useCMSStore((state) => state.projects)
  const blogPosts = useCMSStore((state) => state.blogPosts)
  const skills = useCMSStore((state) => state.skills)

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <StatCard title="Projects" value={projects.length} footer={`${projects.filter((item) => item.status === "Completed").length} completed`} icon={FolderOpen} />
      <StatCard title="Blog Posts" value={blogPosts.length} footer="Published articles" icon={FileText} />
      <StatCard title="Skills" value={skills.length} footer="Skills in your profile" icon={Code} />
    </div>
  )
}
