"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
import { apiAssetUrl, apiDeleteUpload, apiUpload } from "@/lib/api-client"
import { AiGenerateDialog } from "@/components/ai/ai-generate-dialog"
import { useAiFormHistory } from "@/lib/use-ai-form-history"

interface Achievement {
  id?: number
  title: string
  description?: string | null
  issuer: string
  date: string
  url: string | null
  image?: string | null
  logo?: string | null
  type: string
}

interface AchievementDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  achievement?: Achievement
  onSave: (achievement: Achievement) => Promise<void>
}

export function AchievementDialog({ open, onOpenChange, achievement, onSave }: AchievementDialogProps) {
  const { value: formData, setValue: setFormData, applyAi, undoAi, redoAi, canUndo, canRedo } = useAiFormHistory<Achievement>({
    title: achievement?.title || "",
    description: achievement?.description || "",
    issuer: achievement?.issuer || "",
    date: achievement?.date || "",
    url: achievement?.url || "",
    image: achievement?.image || "",
    logo: achievement?.logo || "",
    type: achievement?.type || "Certification",
    ...achievement,
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const draftUploads = useRef(new Set<string>())

  useEffect(() => () => {
    for (const url of draftUploads.current) void apiDeleteUpload(url).catch(() => {})
  }, [])

  const uploadMedia = async (file: File | undefined, field: "image" | "logo") => {
    if (!file) return
    setLoading(true); setError("")
    try {
      const uploaded = await apiUpload(file)
      const previous = formData[field]
      draftUploads.current.add(uploaded.url)
      if (previous && draftUploads.current.has(previous)) {
        await apiDeleteUpload(previous)
        draftUploads.current.delete(previous)
      }
      setFormData((current) => ({ ...current, [field]: uploaded.url }))
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Failed to upload media")
    } finally { setLoading(false) }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.image && !formData.logo) { setError("Add a logo when there is no image."); return }
    setLoading(true)
    setError("")
    try {
      await onSave({ ...formData, url: formData.url || null, image: formData.image || null, logo: formData.logo || null })
      draftUploads.current.delete(formData.image || "")
      draftUploads.current.delete(formData.logo || "")
      onOpenChange(false)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Failed to save achievement")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-md overflow-y-auto">
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
            <Label htmlFor="achievement-description">Card subtitle</Label>
            <Textarea id="achievement-description" rows={3} value={formData.description || ""} onChange={(event) => setFormData((previous) => ({ ...previous, description: event.target.value }))} placeholder="What this credential or achievement represents" />
            <AiGenerateDialog kind="achievement" title={formData.title} context={{ issuer: formData.issuer, date: formData.date, type: formData.type, image: formData.image || "", logo: formData.logo || "", currentDescription: formData.description || "" }} onApply={(draft) => applyAi((current) => ({ ...current, description: draft.fields.description as string, issuer: draft.fields.issuer as string, date: draft.fields.date as string, type: draft.fields.type as string, logo: current.logo || (draft.fields.logo as string | undefined) || "" }))} onUndo={undoAi} onRedo={redoAi} canUndo={canUndo} canRedo={canRedo} />
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
                  <SelectItem value="Achievement">Achievement</SelectItem>
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

          <div className="grid gap-4 sm:grid-cols-2">
            {([ ["image", "Card image (optional)"], ["logo", "Logo (required without image)"] ] as const).map(([field, label]) => <div key={field} className="space-y-2">
              <Label htmlFor={`achievement-${field}`}>{label}</Label>
              <Input id={`achievement-${field}`} value={formData[field] || ""} onChange={(e) => setFormData((prev) => ({ ...prev, [field]: e.target.value }))} placeholder={field === "image" ? "/assets/golden-record/photo.gif" : "/voyager/icon.svg"} />
              <label className="inline-flex cursor-pointer items-center rounded-md border px-3 py-2 text-xs hover:bg-muted">Upload {field}<input type="file" accept={field === "logo" ? "image/png,image/webp,image/avif,image/svg+xml" : "image/png,image/jpeg,image/webp,image/avif"} className="hidden" disabled={loading} onChange={(event) => { void uploadMedia(event.target.files?.[0], field); event.target.value = "" }} /></label>
              {field === "logo" && <p className="text-xs text-muted-foreground">Use a transparent logo. The portfolio tints it gold.</p>}
              {formData[field] && <p className="truncate text-xs text-muted-foreground" title={formData[field] || ""}>{formData[field]}</p>}
              {formData[field]?.startsWith("/api/v1/uploads/") && <img src={apiAssetUrl(formData[field] || "")} alt={`${field} preview`} className="h-20 w-full rounded-md border object-contain p-2" />}
            </div>)}
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
