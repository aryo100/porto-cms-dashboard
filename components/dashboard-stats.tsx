"use client"

import { StatCard } from "@/components/common/stat-card"
import { Eye, FileText, Users } from "lucide-react"

const stats = [
  {
    title: "Total Views",
    value: "4,620",
    change: "+12.5%",
    icon: Eye,
  },
  {
    title: "Active Projects",
    value: "4",
    change: "+2",
    icon: FileText,
  },
  {
    title: "Blog Readers",
    value: "3,234",
    change: "+8.2%",
    icon: Users,
  },
]

export function DashboardStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat) => (
        <StatCard
          key={stat.title}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          footer={
            <>
              <span className="text-primary font-medium">{stat.change}</span>
              {" from last month"}
            </>
          }
        />
      ))}
    </div>
  )
}