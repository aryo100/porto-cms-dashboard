"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { X, Plus, Loader2 } from "lucide-react"

interface Education {
  id?: number
  institution: string
  degree: string
  location: string
  startDate: string
  endDate: string
  gpa: string | null
  achievements: string[]
  coursework: string[]
}

interface EducationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  education?: Education
  onSave: (education: Education) => Promise<void>
}

export function EducationDialog({ open, onOpenChange, education, onSave }: EducationDialogProps) {
  const [formData, setFormData] = useState<Education>({
    institution: education?.institution || "",
    degree: education?.degree || "",
    location: education?.location || "",
    startDate: education?.startDate || "",
    endDate: education?.endDate || "",
    gpa: education?.gpa || "",
    achievements: education?.achievements || [],
    coursework: education?.coursework || [],
    ...education,
  })

  const [newAchievement, setNewAchievement] = useState("")
  const [newCourse, setNewCourse] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      await onSave({ ...formData, gpa: formData.gpa || null })
      onOpenChange(false)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Failed to save education")
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

  const addCourse = () => {
    if (newCourse.trim() && !formData.coursework.includes(newCourse.trim())) {
      setFormData((prev) => ({
        ...prev,
        coursework: [...prev.coursework, newCourse.trim()],
      }))
      setNewCourse("")
    }
  }

  const removeCourse = (course: string) => {
    setFormData((prev) => ({
      ...prev,
      coursework: prev.coursework.filter((c) => c !== course),
    }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{education ? "Edit Education" : "Add Education"}</DialogTitle>
          <DialogDescription>
            {education ? "Update your education details" : "Add a new educational qualification"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="degree">Degree/Certificate</Label>
            <Input
              id="degree"
              value={formData.degree}
              onChange={(e) => setFormData((prev) => ({ ...prev, degree: e.target.value }))}
              placeholder="Bachelor of Science in Computer Science"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="institution">Institution</Label>
            <Input
              id="institution"
              value={formData.institution}
              onChange={(e) => setFormData((prev) => ({ ...prev, institution: e.target.value }))}
              placeholder="University of Technology"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                placeholder="Boston, MA"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gpa">GPA (Optional)</Label>
              <Input
                id="gpa"
                value={formData.gpa || ""}
                onChange={(e) => setFormData((prev) => ({ ...prev, gpa: e.target.value }))}
                placeholder="3.8/4.0"
              />
            </div>
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
                value={formData.endDate}
                onChange={(e) => setFormData((prev) => ({ ...prev, endDate: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Achievements & Honors</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newAchievement}
                onChange={(e) => setNewAchievement(e.target.value)}
                placeholder="Add achievement"
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addAchievement())}
              />
              <Button type="button" onClick={addAchievement} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.achievements.map((achievement, index) => (
                <Badge key={index} variant="secondary" className="gap-1">
                  {achievement}
                  <button
                    type="button"
                    onClick={() => removeAchievement(index)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Relevant Coursework</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newCourse}
                onChange={(e) => setNewCourse(e.target.value)}
                placeholder="Add course"
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addCourse())}
              />
              <Button type="button" onClick={addCourse} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.coursework.map((course) => (
                <Badge key={course} variant="outline" className="gap-1">
                  {course}
                  <button type="button" onClick={() => removeCourse(course)} className="ml-1 hover:text-destructive">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {education ? "Update Education" : "Add Education"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
