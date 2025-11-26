"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Eye, Users, FileText } from "lucide-react"

const stats = [
  {
    title: "Total Views",
    value: "12,543",
    change: "+12.5%",
    changeType: "positive" as const,
    icon: Eye,
  },
  {
    title: "Active Projects",
    value: "8",
    change: "+2",
    changeType: "positive" as const,
    icon: FileText,
  },
  {
    title: "Blog Readers",
    value: "2,847",
    change: "+8.2%",
    changeType: "positive" as const,
    icon: Users,
  },
  {
    title: "Growth Rate",
    value: "24.3%",
    change: "+4.1%",
    changeType: "positive" as const,
    icon: TrendingUp,
  },
]

export function DashboardStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="transition-all duration-200 hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-primary font-medium">{stat.change}</span>
              {" from last month"}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
