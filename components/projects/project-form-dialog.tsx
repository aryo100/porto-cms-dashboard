"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { SkillMultiSelect } from "@/components/common/skill-multi-select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCMSStore } from "@/lib/store"
import { apiAssetUrl, apiDeleteUpload, apiUpload } from "@/lib/api-client"
import { Loader2, ImagePlus, Trash2, RefreshCw } from "lucide-react"

interface Project {
  id?: number
  title: string
  description: string
  status: string
  category: string
  techStack: string[]
  technologies?: string[]
  githubUrl: string
  liveUrl: string
  image: string
}

interface ProjectFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  project?: Project
  onSave: (project: Project) => Promise<void>
}

export function ProjectFormDialog({ open, onOpenChange, project, onSave }: ProjectFormDialogProps) {
  const [formData, setFormData] = useState<Project>({
    title: project?.title || "",
    description: project?.description || "",
    status: project?.status || "Completed",
    category: project?.category || "Web Development",
    techStack: project?.techStack ?? project?.technologies ?? [],
    githubUrl: project?.githubUrl || "",
    liveUrl: project?.liveUrl || "",
    image: project?.image || "",
    ...project,
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const draftUploads = useRef(new Set<string>())
  const skills = useCMSStore((state) => state.skills)
  const skillNames = skills.map((skill) => skill.name)

  useEffect(() => () => {
    for (const url of draftUploads.current) void apiDeleteUpload(url).catch(() => {})
  }, [])

  const discardDrafts = async (keep?: string) => {
    for (const url of draftUploads.current) {
      if (url === keep) continue
      await apiDeleteUpload(url)
      draftUploads.current.delete(url)
    }
  }

  const closeDialog = async () => {
    if (loading) return
    try {
      await discardDrafts()
      onOpenChange(false)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Gagal menghapus gambar sementara")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      await onSave({ ...formData, technologies: formData.techStack })
      draftUploads.current.delete(formData.image)
      await discardDrafts()
      onOpenChange(false)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Gagal menyimpan project")
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith("image/")) return
    setLoading(true)
    setError("")
    try {
      const uploaded = await apiUpload(file)
      draftUploads.current.add(uploaded.url)
      await discardDrafts(uploaded.url)
      setFormData((prev) => ({ ...prev, image: uploaded.url }))
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Gagal mengunggah gambar")
    } finally {
      setLoading(false)
      e.target.value = ""
    }
  }

  const updateTechStack = (tags: string[]) => {
    setFormData((prev) => ({ ...prev, techStack: tags }))
  }

  const removeImage = async () => {
    if (draftUploads.current.has(formData.image)) {
      setLoading(true)
      try {
        await apiDeleteUpload(formData.image)
        draftUploads.current.delete(formData.image)
      } catch (cause) {
        setError(cause instanceof Error ? cause.message : "Gagal menghapus gambar")
        setLoading(false)
        return
      }
      setLoading(false)
    }
    setFormData((prev) => ({ ...prev, image: "" }))
  }

  return (
    <Dialog open={open} onOpenChange={(next) => { if (!next) void closeDialog(); else onOpenChange(true) }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{project ? "Edit Project" : "Add New Project"}</DialogTitle>
          <DialogDescription>
            {project ? "Update your project details" : "Create a new project for your portfolio"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Project Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Enter project title"
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
                  <SelectItem value="Web Development">Web Development</SelectItem>
                  <SelectItem value="Mobile App">Mobile App</SelectItem>
                  <SelectItem value="Desktop App">Desktop App</SelectItem>
                  <SelectItem value="API">API</SelectItem>
                  <SelectItem value="Open Source">Open Source</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your project"
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Upcoming">Upcoming</SelectItem>
                  <SelectItem value="Legacy">Legacy</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Project Image</Label>
              <div className="flex items-end gap-4">
                <label className="group relative flex h-32 w-44 cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-md border border-dashed bg-muted/50 text-muted-foreground transition-colors hover:bg-accent">
                  {formData.image ? (
                    <>
                      <img src={apiAssetUrl(formData.image)} alt="Project preview" className="absolute inset-0 h-full w-full object-cover" />
                      <span className="absolute inset-0 flex items-center justify-center bg-black/0 text-white opacity-0 transition-opacity group-hover:bg-black/40 group-hover:opacity-100">
                        <RefreshCw className="h-5 w-5" />
                      </span>
                    </>
                  ) : (
                    <>
                      <ImagePlus className="h-6 w-6" />
                      <span className="text-sm">Upload Image</span>
                    </>
                  )}
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={loading} />
                </label>
                {formData.image && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => { void removeImage() }}
                    disabled={loading}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>

          <SkillMultiSelect
            label="Tech Stack"
            value={formData.techStack}
            onChange={updateTechStack}
            options={skillNames}
            placeholder="Select technologies from your skills"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="githubUrl">GitHub URL</Label>
              <Input
                id="githubUrl"
                value={formData.githubUrl}
                onChange={(e) => setFormData((prev) => ({ ...prev, githubUrl: e.target.value }))}
                placeholder="https://github.com/username/repo"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="liveUrl">Live Demo URL</Label>
              <Input
                id="liveUrl"
                value={formData.liveUrl}
                onChange={(e) => setFormData((prev) => ({ ...prev, liveUrl: e.target.value }))}
                placeholder="https://your-project.com"
              />
            </div>
          </div>

          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => { void closeDialog() }} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {project ? "Update Project" : "Create Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
