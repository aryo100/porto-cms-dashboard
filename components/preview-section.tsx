"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Code, Palette, Layout, Clock } from "lucide-react"

const previewSections = [
  {
    title: "Hero Section",
    description: "Main landing area with introduction",
    icon: Layout,
    lastUpdated: "Updated Jul 15, 2024",
  },
  {
    title: "Tech Stack",
    description: "Skills and technologies carousel",
    icon: Code,
    lastUpdated: "Updated Jul 10, 2024",
  },
  {
    title: "Project Grid",
    description: "Featured projects showcase",
    icon: Palette,
    lastUpdated: "Updated Jul 12, 2024",
  },
]

export function PreviewSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Portfolio Preview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {previewSections.map((section) => (
          <div key={section.title} className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-primary/10">
                <section.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="font-medium">{section.title}</div>
                <div className="text-sm text-muted-foreground">{section.description}</div>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              {section.lastUpdated}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
