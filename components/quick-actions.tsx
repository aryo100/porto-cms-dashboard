"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Upload, Edit, Eye } from "lucide-react"
import Link from "next/link"

const actions = [
  {
    title: "Add Project",
    description: "Create a new project showcase",
    icon: Plus,
    color: "bg-primary hover:bg-primary/90",
    href: "/projects",
  },
  {
    title: "Write Blog Post",
    description: "Share your thoughts and insights",
    icon: Edit,
    color: "bg-accent hover:bg-accent/90",
    href: "/blog",
  },
  {
    title: "Upload Certificate",
    description: "Add new certifications",
    icon: Upload,
    color: "bg-secondary hover:bg-secondary/90 text-secondary-foreground",
    href: "/experience",
  },
  {
    title: "Preview Site",
    description: "View your live portfolio",
    icon: Eye,
    color: "bg-muted hover:bg-muted/90 text-muted-foreground",
    href: "#",
  },
]

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {actions.map((action) => (
            <Link key={action.title} href={action.href}>
              <Button
                variant="outline"
                className={`h-auto p-4 flex flex-col items-start gap-2 transition-all duration-200 hover:scale-105 ${action.color} w-full`}
              >
                <action.icon className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">{action.title}</div>
                  <div className="text-xs opacity-80">{action.description}</div>
                </div>
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
