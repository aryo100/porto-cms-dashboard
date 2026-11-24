"use client"

import { useState, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useCMSStore } from "@/lib/store"
import type { ContentOptionKind } from "@/types/api"
import { Check, ChevronsUpDown, Loader2, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

export function ContentOptionSelectField({ kind, label, value, onChange, disabled = false }: {
  kind: ContentOptionKind
  label: string
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}) {
  const allOptions = useCMSStore((state) => state.contentOptions)
  const records = useCMSStore((state) => kind === "project-category" ? state.projects : state.skills)
  const options = allOptions.filter((item) => item.kind === kind)
  const namesByKey = new Map<string, string>()
  for (const candidate of [value, ...options.map((item) => item.name), ...records.map((item) => item.category)]) {
    const name = candidate?.trim()
    if (name && !namesByKey.has(name.toLocaleLowerCase())) namesByKey.set(name.toLocaleLowerCase(), name)
  }
  const names = [...namesByKey.values()].sort((a, b) => a.localeCompare(b))
  const addOption = useCMSStore((state) => state.addContentOption)
  const [open, setOpen] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)
  const [draft, setDraft] = useState("")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const create = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const name = draft.trim()
    if (!name) return
    if (names.some((option) => option.toLocaleLowerCase() === name.toLocaleLowerCase())) {
      setError("This category already exists. Select it from the list.")
      return
    }
    setSaving(true)
    setError("")
    try {
      const option = await addOption(kind, name)
      onChange(option.name)
      setDraft("")
      setCreateOpen(false)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to create category")
    } finally {
      setSaving(false)
    }
  }

  return <div className="min-w-0 space-y-2">
    <div className="flex items-center justify-between gap-2">
      <Label>{label}</Label>
      <Button type="button" variant="outline" size="sm" className="h-8 gap-1.5" onClick={() => { setOpen(false); setCreateOpen(true) }} disabled={disabled}>
        <Plus className="h-3.5 w-3.5" /> Create category
      </Button>
    </div>
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button type="button" variant="outline" role="combobox" aria-expanded={open} aria-label={`Select ${kind === "project-category" ? "project" : "skill"} category`} className="h-10 w-full min-w-0 justify-between gap-2 px-3 font-normal" disabled={disabled}>
          <span className={cn("truncate", !value && "text-muted-foreground")}>{value || `Select ${label.toLowerCase()}`}</span>
          <ChevronsUpDown className="h-4 w-4 shrink-0 text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search categories..." />
          <CommandList>
            <CommandEmpty>{names.length ? "No category found." : "No categories yet. Create one here."}</CommandEmpty>
            <CommandGroup>
              {names.map((name) => <CommandItem key={name} value={name} onSelect={() => { onChange(name); setOpen(false) }}>
                <Check className={cn("mr-2 h-4 w-4", value === name ? "opacity-100" : "opacity-0")} />
                <span className="truncate">{name}</span>
              </CommandItem>)}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
    <Dialog open={createOpen} onOpenChange={(next) => { if (saving) return; setCreateOpen(next); if (!next) { setDraft(""); setError("") } }}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Create {kind === "project-category" ? "project" : "skill"} category</DialogTitle>
          <DialogDescription>Add a category and select it for this item.</DialogDescription>
        </DialogHeader>
        <form onSubmit={(event) => { void create(event) }} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`new-${kind}`}>Category name</Label>
            <Input id={`new-${kind}`} value={draft} onChange={(event) => setDraft(event.target.value)} maxLength={80} placeholder="Category name" autoFocus required />
          </div>
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setCreateOpen(false)} disabled={saving}>Cancel</Button>
            <Button type="submit" disabled={saving || !draft.trim()}>{saving && <Loader2 className="h-4 w-4 animate-spin" />} Create category</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  </div>
}
