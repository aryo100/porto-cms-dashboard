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
import { Check, ChevronsUpDown, Plus, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { SkillDialog } from "@/components/experience/skill-dialog"
import { useCMSStore } from "@/lib/store"

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
  emptyMessage = "No skills yet. Create one here.",
}: SkillMultiSelectProps) {
  const [open, setOpen] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)
  const addSkill = useCMSStore((state) => state.addSkill)

  const toggle = (skill: string) => {
    onChange(value.includes(skill) ? value.filter((v) => v !== skill) : [...value, skill])
  }

  const createSkill = async (skill: Parameters<typeof addSkill>[0]) => {
    const name = skill.name?.trim()
    if (!name) throw new Error("Enter a skill name.")
    if (options.some((option) => option.toLowerCase() === name.toLowerCase())) {
      throw new Error("This skill already exists. Select it from the list.")
    }
    await addSkill({ ...skill, name })
    onChange(value.includes(name) ? value : [...value, name])
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <Label>{label}</Label>
        <Button type="button" variant="outline" size="sm" className="h-8 gap-1.5" onClick={() => { setOpen(false); setCreateOpen(true) }}>
          <Plus className="h-3.5 w-3.5" /> Create skill
        </Button>
      </div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="h-auto min-h-10 w-full justify-between gap-2 px-3 py-2"
          >
            <span className={value.length === 0 ? "text-muted-foreground" : ""}>{value.length === 0 ? placeholder : `${value.length} selected`}</span>
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
      {value.length > 0 && <div className="flex flex-wrap gap-1.5">
        {value.map((skill) => <Badge key={skill} variant="secondary" className="gap-1">
          {skill}
          <button type="button" aria-label={`Remove ${skill}`} onClick={() => toggle(skill)} className="rounded-sm hover:text-destructive">
            <X className="h-3 w-3" />
          </button>
        </Badge>)}
      </div>}
      {createOpen && <SkillDialog open={createOpen} onOpenChange={setCreateOpen} onSave={createSkill} />}
    </div>
  )
}
