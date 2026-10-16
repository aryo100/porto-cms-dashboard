"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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

interface Achievement {
  id?: number
  title: string
  issuer: string
  date: string
  url: string | null
  type: string
}

interface AchievementDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  achievement?: Achievement
  onSave: (achievement: Achievement) => Promise<void>
}

export function AchievementDialog({ open, onOpenChange, achievement, onSave }: AchievementDialogProps) {
  const [formData, setFormData] = useState<Achievement>({
    title: achievement?.title || "",
    issuer: achievement?.issuer || "",
    date: achievement?.date || "",
    url: achievement?.url || "",
    type: achievement?.type || "Certification",
    ...achievement,
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      await onSave({ ...formData, url: formData.url || null })
      onOpenChange(false)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Gagal menyimpan pencapaian")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{achievement ? "Edit Achievement" : "Add Achievement"}</DialogTitle>
          <DialogDescription>
            {achievement ? "Update your achievement details" : "Add a new certification, award, or external link"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="AWS Certified Solutions Architect"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="issuer">Issuing Organization</Label>
            <Input
              id="issuer"
              value={formData.issuer}
              onChange={(e) => setFormData((prev) => ({ ...prev, issuer: e.target.value }))}
              placeholder="Amazon Web Services"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData((prev) => ({ ...prev, type: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Certification">Certification</SelectItem>
                  <SelectItem value="Award">Award</SelectItem>
                  <SelectItem value="External">External</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                value={formData.date}
                onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                placeholder="March 2024"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="url">URL (Optional)</Label>
            <Input
              id="url"
              type="url"
              value={formData.url || ""}
              onChange={(e) => setFormData((prev) => ({ ...prev, url: e.target.value }))}
              placeholder="https://credential.net/your-credential"
            />
            <p className="text-xs text-muted-foreground">Link to the credential, article, or external reference.</p>
          </div>

          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {achievement ? "Update Achievement" : "Add Achievement"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
