"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { SkillIconPicker } from "./skill-icon-picker"
import { skillIconNames } from "@/lib/skill-icon-names"
import { AiGenerateDialog } from "@/components/ai/ai-generate-dialog"
import { useAiFormHistory } from "@/lib/use-ai-form-history"
import { SkillImpactList } from "./skill-impact-list"
import { useCMSStore } from "@/lib/store"

interface Skill {
  id?: number
  name: string
  category: string
  level: number
  years: number
  color: string
  icon: string
  showOnPortfolio: boolean
}

interface SkillDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  skill?: Skill
  onSave: (skill: Skill) => Promise<void>
}

export function SkillDialog({ open, onOpenChange, skill, onSave }: SkillDialogProps) {
  const { value: formData, setValue: setFormData, applyAi, undoAi, redoAi, canUndo, canRedo } = useAiFormHistory<Skill>({
    name: skill?.name || "",
    category: skill?.category || "Programming",
    level: skill?.level || 50,
    years: skill?.years || 1,
    color: skill?.color || "#64748b",
    icon: skill?.icon || "code",
    showOnPortfolio: skill?.showOnPortfolio ?? true,
    ...skill,
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const duplicate = useCMSStore((state) => state.skills.find((item) => item.id !== skill?.id && item.name === formData.name.trim()))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setLoading(true)
    setError("")
    try {
      await onSave({ ...formData, name: formData.name.trim() })
      onOpenChange(false)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Failed to save skill")
    } finally {
      setLoading(false)
    }
  }

  const categories = ["Languages", "Frontend", "Experience", "Backend", "Data & Content", "Workflow", "Interface Tools", "Programming", "Cloud", "DevOps", "Database", "Mobile", "Design"]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{skill ? "Edit Skill" : "Add Skill"}</DialogTitle>
          <DialogDescription>
            {skill ? "Update your skill details" : "Add a new technical skill to your profile"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Skill Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="JavaScript"
              required
            />
            <AiGenerateDialog kind="skill" title={formData.name} context={{ category: formData.category, level: formData.level, years: formData.years, color: formData.color, icon: formData.icon }} onApply={(draft) => applyAi((current) => {
              const icon = String(draft.fields.icon).toLowerCase().replace(/\s+/g, "-")
              return { ...current, category: draft.fields.category as string, level: draft.fields.level as number, years: draft.fields.years as number, color: draft.fields.color as string, icon: (skillIconNames as readonly string[]).includes(icon) ? icon : "code" }
            })} onUndo={undoAi} onRedo={redoAi} canUndo={canUndo} canRedo={canRedo} />
            {skill && formData.name.trim() !== skill.name && <>
              {duplicate && <p className="rounded-md border border-amber-500/40 bg-amber-500/10 p-3 text-sm">“{duplicate.name}” already exists. Saving will merge this skill into it and keep the existing skill’s category, icon, color, and proficiency.</p>}
              <SkillImpactList name={skill.name} action={duplicate ? "merge" : "rename"} />
            </>}
            {!skill && duplicate && <p className="text-sm text-destructive">This skill already exists. Select it instead of creating another.</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Skill Icon</Label>
            <SkillIconPicker value={formData.icon} onChange={(icon) => setFormData((prev) => ({ ...prev, icon }))} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="skill-color">Skill Color</Label>
            <div className="flex items-center gap-3">
              <Input id="skill-color" type="color" value={formData.color} onChange={(event) => setFormData((prev) => ({ ...prev, color: event.target.value }))} className="h-10 w-16 cursor-pointer p-1" />
              <Input aria-label="Skill color hex" value={formData.color} onChange={(event) => setFormData((prev) => ({ ...prev, color: event.target.value }))} pattern="#[0-9a-fA-F]{6}" maxLength={7} className="w-28" required />
              <span className="text-sm text-muted-foreground">Badge portfolio</span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <Label htmlFor="show-on-portfolio">Show on portfolio</Label>
            <Switch id="show-on-portfolio" checked={formData.showOnPortfolio} onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, showOnPortfolio: checked }))} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="years">Years of Experience</Label>
            <Input
              id="years"
              type="number"
              min="0"
              max="20"
              value={formData.years}
              onChange={(e) => setFormData((prev) => ({ ...prev, years: Number.parseInt(e.target.value) || 0 }))}
              required
            />
          </div>

          <div className="space-y-3">
            <Label>Proficiency Level: {formData.level}%</Label>
            <Slider
              value={[formData.level]}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, level: value[0] }))}
              max={100}
              min={0}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Beginner</span>
              <span>Intermediate</span>
              <span>Expert</span>
            </div>
          </div>

          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || (!skill && Boolean(duplicate))}>
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {skill ? duplicate ? "Merge Skills" : "Update Skill" : "Add Skill"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
