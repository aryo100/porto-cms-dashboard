"use client"

import { useMemo, useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { skillIconNames } from "@/lib/skill-icon-names"
import { SkillIcon } from "./skill-icon"

const iconLabel = (name: string) => name.replaceAll("-", " ")

export function SkillIconPicker({ value, onChange }: { value: string; onChange: (name: string) => void }) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const matches = useMemo(() => {
    const query = search.trim().toLowerCase().replaceAll(" ", "-")
    return skillIconNames.filter((name) => name.includes(query)).slice(0, 60)
  }, [search])

  return (
    <Popover open={open} onOpenChange={(next) => { setOpen(next); if (!next) setSearch("") }}>
      <PopoverTrigger asChild>
        <Button type="button" variant="outline" role="combobox" aria-expanded={open} aria-label="Choose a skill icon" className="w-full justify-between font-normal">
          <span className="flex items-center gap-2"><SkillIcon name={value} className="h-4 w-4" />{iconLabel(value)}</span>
          <ChevronsUpDown className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[var(--radix-popover-trigger-width)] p-0">
        <Command shouldFilter={false}>
          <CommandInput value={search} onValueChange={setSearch} placeholder="Search Lucide icons..." />
          <CommandList>
            <CommandEmpty>No icons found.</CommandEmpty>
            {matches.map((name) => (
              <CommandItem key={name} value={name} onSelect={() => { onChange(name); setOpen(false) }}>
                <SkillIcon name={name} className="h-4 w-4" />
                <span className="capitalize">{iconLabel(name)}</span>
                {name === value && <Check className="ml-auto h-4 w-4" />}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
