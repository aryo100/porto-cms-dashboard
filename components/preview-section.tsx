"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Code, Palette, Layout } from "lucide-react"

const previewSections = [
  {
    title: "Hero Section",
    description: "Main landing area with introduction",
    icon: Layout,
    status: "Updated",
  },
  {
    title: "Tech Stack",
    description: "Skills and technologies carousel",
    icon: Code,
    status: "Needs Update",
  },
  {
    title: "Project Grid",
    description: "Featured projects showcase",
    icon: Palette,
    status: "Updated",
  },
]

export function PreviewSection() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Portfolio Preview</CardTitle>
        <Button variant="outline" size="sm">
          <ExternalLink className="mr-2 h-4 w-4" />
          View Live Site
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {previewSections.map((section) => (
          <div key={section.title} className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-primary/10">
                <section.icon className="h-4 w-4 text-primary" />
              </div>
              <div>
                <div className="font-medium">{section.title}</div>
                <div className="text-sm text-muted-foreground">{section.description}</div>
              </div>
            </div>
            <Badge
              variant={section.status === "Updated" ? "default" : "secondary"}
              className={section.status === "Updated" ? "bg-primary text-primary-foreground" : ""}
            >
              {section.status}
            </Badge>
          </div>
        ))}

        {/* Mini Preview */}
        <div className="mt-4 p-4 rounded-lg border bg-gradient-to-br from-primary/5 to-accent/5">
          <div className="text-sm font-medium mb-2">Live Preview</div>
          <div className="space-y-2">
            <div className="h-2 bg-primary/20 rounded w-3/4"></div>
            <div className="h-2 bg-muted rounded w-1/2"></div>
            <div className="flex gap-2 mt-3">
              <div className="h-8 w-8 bg-primary/30 rounded"></div>
              <div className="h-8 w-8 bg-accent/30 rounded"></div>
              <div className="h-8 w-8 bg-secondary/50 rounded"></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
