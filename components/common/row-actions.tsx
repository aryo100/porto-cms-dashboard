import type { LucideIcon } from "lucide-react"
import { MoreHorizontal, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export interface RowActionItem {
  label: string
  icon: LucideIcon
  onClick: () => void
}

interface RowActionsProps {
  onEdit: () => void
  onDelete: () => void
  extraItems?: RowActionItem[]
}

export function RowActions({ onEdit, onDelete, extraItems = [] }: RowActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {extraItems.map((item) => (
          <DropdownMenuItem key={item.label} className="gap-2" onClick={item.onClick}>
            <item.icon className="h-4 w-4" />
            {item.label}
          </DropdownMenuItem>
        ))}
        <DropdownMenuItem className="gap-2" onClick={onEdit}>
          <Edit className="h-4 w-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-2 text-destructive" onClick={onDelete}>
          <Trash2 className="h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}