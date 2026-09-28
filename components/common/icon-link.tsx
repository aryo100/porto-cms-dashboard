import type { LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

interface IconLinkProps {
  href: string
  icon: LucideIcon
  label?: string
  external?: boolean
}

export function IconLink({ href, icon: Icon, label, external = true }: IconLinkProps) {
  return (
    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" asChild>
      <a
        href={href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        aria-label={label}
      >
        <Icon className="h-4 w-4" />
      </a>
    </Button>
  )
}