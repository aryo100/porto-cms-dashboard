"use client"

import Link from "next/link"
import type { LucideIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Upload, Edit, ExternalLink } from "lucide-react"
import { useCMSStore } from "@/lib/store"

interface QuickActionTileProps {
  title: string
  description: string
  icon: LucideIcon
  href: string
  external?: boolean
}

function QuickActionTile({ title, description, icon: Icon, href, external }: QuickActionTileProps) {
  return (
    <Button
      asChild
      variant="ghost"
      className="h-auto w-full justify-start gap-3 p-3 rounded-lg border bg-muted/30 hover:bg-muted/60 hover:text-foreground"
    >
      <Link
        href={href}
        {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
        className="flex min-w-0 items-center gap-3"
      >
        <div className="p-2 rounded-md bg-primary/10 shrink-0">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div className="min-w-0 text-left">
          <div className="truncate font-medium" title={title}>{title}</div>
          <div className="truncate text-sm text-muted-foreground" title={description}>{description}</div>
        </div>
      </Link>
    </Button>
  )
}

export function QuickActions() {
  const website = useCMSStore((state) => state.site.website)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <QuickActionTile
          title="Add Project"
          description="Create a new project showcase"
          icon={Plus}
          href="/projects?new=project"
        />
        <QuickActionTile
          title="Write Blog Post"
          description="Share your thoughts and insights"
          icon={Edit}
          href="/blog?new=post"
        />
        <QuickActionTile
          title="Upload Certificate"
          description="Add new certifications"
          icon={Upload}
          href="/experience?new=certificate"
        />
        <QuickActionTile
          title="Preview Site"
          description="View your live portfolio"
          icon={ExternalLink}
          href={website}
          external
        />
      </CardContent>
    </Card>
  )
}
