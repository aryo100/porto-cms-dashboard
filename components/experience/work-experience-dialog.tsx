"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { SkillMultiSelect } from "@/components/common/skill-multi-select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useCMSStore } from "@/lib/store"
import { X, Plus, Loader2 } from "lucide-react"

interface WorkExperience {
  id?: number
  company: string
  position: string
  location: string
  startDate: string
  endDate: string | null
  current: boolean
  description: string
  achievements: string[]
  technologies: string[]
}

interface WorkExperienceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  experience?: WorkExperience
  onSave: (experience: WorkExperience) => Promise<void>
}

export function WorkExperienceDialog({ open, onOpenChange, experience, onSave }: WorkExperienceDialogProps) {
  const [formData, setFormData] = useState<WorkExperience>({
    company: experience?.company || "",
    position: experience?.position || "",
    location: experience?.location || "",
    startDate: experience?.startDate || "",
    endDate: experience?.endDate || "",
    current: experience?.current || false,
    description: experience?.description || "",
    achievements: experience?.achievements || [],
    technologies: experience?.technologies || [],
    ...experience,
  })

  const [newAchievement, setNewAchievement] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const skills = useCMSStore((state) => state.skills)
  const skillNames = skills.map((skill) => skill.name)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      await onSave(formData)
      onOpenChange(false)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Gagal menyimpan pengalaman kerja")
    } finally {
      setLoading(false)
    }
  }

  const addAchievement = () => {
    if (newAchievement.trim()) {
      setFormData((prev) => ({
        ...prev,
        achievements: [...prev.achievements, newAchievement.trim()],
      }))
      setNewAchievement("")
    }
  }

  const removeAchievement = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index),
    }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{experience ? "Edit Work Experience" : "Add Work Experience"}</DialogTitle>
          <DialogDescription>
            {experience ? "Update your work experience details" : "Add a new position to your work history"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="position">Position Title</Label>
              <Input
                id="position"
                value={formData.position}
                onChange={(e) => setFormData((prev) => ({ ...prev, position: e.target.value }))}
                placeholder="Senior Software Engineer"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => setFormData((prev) => ({ ...prev, company: e.target.value }))}
                placeholder="TechCorp Inc."
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
              placeholder="San Francisco, CA"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData((prev) => ({ ...prev, startDate: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate || ""}
                onChange={(e) => setFormData((prev) => ({ ...prev, endDate: e.target.value || null }))}
                disabled={formData.current}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="current"
              checked={formData.current}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({ ...prev, current: checked, endDate: checked ? null : prev.endDate }))
              }
            />
            <Label htmlFor="current">I currently work here</Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Job Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your role and responsibilities"
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Key Achievements</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newAchievement}
                onChange={(e) => setNewAchievement(e.target.value)}
                placeholder="Add an achievement"
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addAchievement())}
              />
              <Button type="button" onClick={addAchievement} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2">
              {formData.achievements.map((achievement, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                  <span className="flex-1 text-sm">{achievement}</span>
                  <button
                    type="button"
                    onClick={() => removeAchievement(index)}
                    className="text-destructive hover:text-destructive/80"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <SkillMultiSelect
            label="Technologies Used"
            value={formData.technologies}
            onChange={(techs) => setFormData((prev) => ({ ...prev, technologies: techs }))}
            options={skillNames}
            placeholder="Select technologies from your skills"
          />

          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {experience ? "Update Experience" : "Add Experience"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
