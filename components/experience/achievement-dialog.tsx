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

interface Achievement {
  id?: number
  title: string
  issuer: string
  date: string
  credentialId: string | null
  expiryDate: string | null
  type: string
}

interface AchievementDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  achievement?: Achievement
  onSave: (achievement: Achievement) => void
}

export function AchievementDialog({ open, onOpenChange, achievement, onSave }: AchievementDialogProps) {
  const [formData, setFormData] = useState<Achievement>({
    title: achievement?.title || "",
    issuer: achievement?.issuer || "",
    date: achievement?.date || "",
    credentialId: achievement?.credentialId || "",
    expiryDate: achievement?.expiryDate || "",
    type: achievement?.type || "Certification",
    ...achievement,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      ...formData,
      credentialId: formData.credentialId || null,
      expiryDate: formData.expiryDate || null,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{achievement ? "Edit Achievement" : "Add Achievement"}</DialogTitle>
          <DialogDescription>
            {achievement ? "Update your achievement details" : "Add a new certification or award"}
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

          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData((prev) => ({ ...prev, type: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Certification">Certification</SelectItem>
                <SelectItem value="Award">Award</SelectItem>
                <SelectItem value="License">License</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Issue Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiryDate">Expiry Date (Optional)</Label>
              <Input
                id="expiryDate"
                type="date"
                value={formData.expiryDate || ""}
                onChange={(e) => setFormData((prev) => ({ ...prev, expiryDate: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="credentialId">Credential ID (Optional)</Label>
            <Input
              id="credentialId"
              value={formData.credentialId || ""}
              onChange={(e) => setFormData((prev) => ({ ...prev, credentialId: e.target.value }))}
              placeholder="AWS-CSA-2023-001"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{achievement ? "Update Achievement" : "Add Achievement"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
