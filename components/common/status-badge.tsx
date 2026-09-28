import type { VariantProps } from "class-variance-authority"
import { Badge, badgeVariants } from "@/components/ui/badge"

type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>["variant"]>

interface StatusBadgeProps {
  value: string
  variantMap?: Record<string, BadgeVariant>
}

export function StatusBadge({ value, variantMap = {} }: StatusBadgeProps) {
  const variant =
    variantMap[value] ??
    (value === "Completed" || value === "Published" || value === "Active" ? "default" : "secondary")

  return <Badge variant={variant}>{value}</Badge>
}