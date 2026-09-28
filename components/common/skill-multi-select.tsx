"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Check, ChevronsUpDown, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface SkillMultiSelectProps {
  label: string
  value: string[]
  onChange: (value: string[]) => void
  options: string[]
  placeholder?: string
  emptyMessage?: string
}

export function SkillMultiSelect({
  label,
  value,
  onChange,
  options,
  placeholder = "Select skills",
  emptyMessage = "No skills yet — add them on the Experience page.",
}: SkillMultiSelectProps) {
  const [open, setOpen] = useState(false)

  const toggle = (skill: string) => {
    onChange(value.includes(skill) ? value.filter((v) => v !== skill) : [...value, skill])
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="h-auto min-h-10 w-full justify-between gap-2 px-3 py-2"
          >
            <div className="flex flex-wrap gap-1.5">
              {value.length === 0 ? (
                <span className="text-muted-foreground">{placeholder}</span>
              ) : (
                value.map((skill) => (
                  <Badge key={skill} variant="secondary" className="gap-1">
                    {skill}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggle(skill)
                      }}
                      className="rounded-sm hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))
              )}
            </div>
            <ChevronsUpDown className="h-4 w-4 shrink-0 text-muted-foreground" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search skills..." />
            <CommandList>
              {options.length === 0 ? (
                <CommandEmpty>{emptyMessage}</CommandEmpty>
              ) : (
                <CommandEmpty>No skill found.</CommandEmpty>
              )}
              <CommandGroup>
                {options.map((skill) => (
                  <CommandItem key={skill} value={skill} onSelect={() => toggle(skill)}>
                    <Check className={cn("mr-2 h-4 w-4", value.includes(skill) ? "opacity-100" : "opacity-0")} />
                    {skill}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}