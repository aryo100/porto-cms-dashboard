"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Skill {
  id?: number
  name: string
  category: string
  level: number
  years: number
}

interface SkillDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  skill?: Skill
  onSave: (skill: Skill) => void
}

export function SkillDialog({ open, onOpenChange, skill, onSave }: SkillDialogProps) {
  const [formData, setFormData] = useState<Skill>({
    name: skill?.name || "",
    category: skill?.category || "Programming",
    level: skill?.level || 50,
    years: skill?.years || 1,
    ...skill,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
    onOpenChange(false)
  }

  const categories = ["Programming", "Frontend", "Backend", "Cloud", "DevOps", "Database", "Mobile", "Design"]

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

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{skill ? "Update Skill" : "Add Skill"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
