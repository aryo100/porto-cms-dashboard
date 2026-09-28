import type { LucideIcon } from "lucide-react"
import { Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface FilterDropdownProps {
  label: string
  options: string[]
  value: string
  onChange: (value: string) => void
  icon?: LucideIcon
}

export function FilterDropdown({
  label,
  options,
  value,
  onChange,
  icon: Icon = Filter,
}: FilterDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2 bg-transparent">
          <Icon className="h-4 w-4" />
          {label}: {value}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {options.map((option) => (
          <DropdownMenuItem key={option} onClick={() => onChange(option)}>
            {option}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}