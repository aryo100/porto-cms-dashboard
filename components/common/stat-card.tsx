import type { LucideIcon } from "lucide-react"
import type { ReactNode } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface StatCardProps {
  title: string
  value: ReactNode
  footer?: ReactNode
  icon: LucideIcon
}

export function StatCard({ title, value, footer, icon: Icon }: StatCardProps) {
  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-6 w-6 text-primary" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {footer && <p className="text-xs text-muted-foreground">{footer}</p>}
      </CardContent>
    </Card>
  )
}