"use client"

import type React from "react"

import { useEffect, useRef, useState, type CSSProperties } from "react"
import { closestCenter, DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core"
import { arrayMove, SortableContext, rectSortingStrategy, sortableKeyboardCoordinates, useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { SkillMultiSelect } from "@/components/common/skill-multi-select"
import { ContentOptionSelectField } from "@/components/common/content-option-fields"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useCMSStore } from "@/lib/store"
import { apiAssetUrl, apiDeleteUpload, apiUpload } from "@/lib/api-client"
import { AiGenerateDialog } from "@/components/ai/ai-generate-dialog"
import { useAiFormHistory } from "@/lib/use-ai-form-history"
import { GripVertical, Loader2, ImagePlus, Trash2 } from "lucide-react"

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
  mobileImage: string
  galleryImages: string[]
  mobileGalleryImages: string[]
  scrollAnimation: boolean | null
  previewAnimation: "scroll" | "gallery"
  desktopAnimation?: ProjectAnimation | null
  mobileAnimation?: ProjectAnimation | null
}

type ProjectAnimation = "off" | "scroll" | "fade" | "slide"

interface ProjectFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  project?: Project
  onSave: (project: Project) => Promise<void>
}

const scrollPreviewSize = {
  image: { width: 800, height: 1500 },
  mobileImage: { width: 320, height: 1600 },
} as const

type ProjectImageField = keyof typeof scrollPreviewSize
type ImageDimensions = { width: number; height: number }

function SortableProjectImage({ url, index, label, loading, removing, onRemove, onLoad }: {
  url: string
  index: number
  label: string
  loading: boolean
  removing: boolean
  onRemove: () => void
  onLoad?: (event: React.SyntheticEvent<HTMLImageElement>) => void
}) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({ id: url, disabled: loading })
  const style: CSSProperties = { transform: CSS.Translate.toString(transform), transition, zIndex: isDragging ? 10 : undefined, opacity: isDragging ? 0.75 : undefined }
  return <div ref={setNodeRef} style={style} className={`relative h-28 w-20 overflow-hidden rounded-md border bg-muted ${isDragging ? "shadow-lg ring-2 ring-primary" : ""}`}>
    <img src={apiAssetUrl(url)} alt={`${label} ${index + 1}`} draggable={false} className="h-full w-full object-cover" onLoad={onLoad} />
    <button type="button" ref={setActivatorNodeRef} {...attributes} {...listeners} aria-label={`Drag ${label.toLowerCase()} ${index + 1} to reorder`} className="absolute inset-x-0 top-0 bottom-7 flex cursor-grab justify-end p-1 active:cursor-grabbing" style={{ touchAction: "none" }} disabled={loading}><GripVertical className="h-4 w-4 rounded bg-background/90" /></button>
    <span className="pointer-events-none absolute left-1 top-1 rounded bg-background/90 px-1 text-[10px]">{index === 0 ? "Cover" : index + 1}</span>
    <div className="absolute inset-x-0 bottom-0 flex justify-end bg-background/90">
      <button type="button" aria-label={`Remove ${label.toLowerCase()} ${index + 1}`} className="p-1" disabled={loading} onClick={onRemove}>{removing ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}</button>
    </div>
    {removing && <span role="status" aria-live="polite" className="absolute inset-x-0 bottom-7 bg-background/90 py-1 text-center text-[10px]">Removing image...</span>}
  </div>
}

export function ProjectFormDialog({ open, onOpenChange, project, onSave }: ProjectFormDialogProps) {
  const { value: formData, setValue: setFormData, applyAi, undoAi, redoAi, canUndo, canRedo } = useAiFormHistory<Project>({
    title: project?.title || "",
    description: project?.description || "",
    status: project?.status || "Completed",
    category: project?.category || "",
    techStack: project?.techStack ?? project?.technologies ?? [],
    githubUrl: project?.githubUrl || "",
    liveUrl: project?.liveUrl || "",
    ...project,
    image: project?.image || project?.galleryImages?.[0] || "",
    galleryImages: project?.image ? project?.galleryImages ?? [] : project?.galleryImages?.slice(1) ?? [],
    mobileImage: project?.mobileImage || project?.mobileGalleryImages?.[0] || "",
    mobileGalleryImages: project?.mobileImage ? project?.mobileGalleryImages ?? [] : project?.mobileGalleryImages?.slice(1) ?? [],
    scrollAnimation: project?.scrollAnimation ?? (project ? null : false),
    previewAnimation: project?.previewAnimation ?? "scroll",
    desktopAnimation: project?.desktopAnimation ?? (project ? null : "off"),
    mobileAnimation: project?.mobileAnimation ?? (project ? null : "off"),
  })

  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState<{ field: ProjectImageField; current: number; total: number } | null>(null)
  const [removingImage, setRemovingImage] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [imageDimensions, setImageDimensions] = useState<Record<string, ImageDimensions>>({})
  const draftUploads = useRef(new Set<string>())
  const dragSensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )
  const skills = useCMSStore((state) => state.skills)
  const skillNames = skills.map((skill) => skill.name)

  useEffect(() => () => {
    for (const url of draftUploads.current) void apiDeleteUpload(url).catch(() => {})
  }, [])

  const discardDrafts = async (keep: string[] = []) => {
    for (const url of draftUploads.current) {
      if (keep.includes(url)) continue
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
      setError(cause instanceof Error ? cause.message : "Failed to remove temporary image")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.category.trim()) { setError("Choose or add one project category"); return }
    setSaving(true)
    setLoading(true)
    setError("")
    try {
      await onSave({ ...formData, technologies: formData.techStack })
      for (const url of [formData.image, formData.mobileImage, ...formData.galleryImages, ...formData.mobileGalleryImages]) draftUploads.current.delete(url)
      await discardDrafts()
      onOpenChange(false)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Failed to save project")
    } finally {
      setSaving(false)
      setLoading(false)
    }
  }

  const imagesFor = (field: ProjectImageField) => [formData[field], ...(field === "image" ? formData.galleryImages : formData.mobileGalleryImages)].filter(Boolean)

  const withImages = (current: Project, field: ProjectImageField, images: string[]): Project => field === "image"
    ? { ...current, image: images[0] ?? "", galleryImages: images.slice(1) }
    : { ...current, mobileImage: images[0] ?? "", mobileGalleryImages: images.slice(1) }

  const handleImagesUpload = async (event: React.ChangeEvent<HTMLInputElement>, field: ProjectImageField) => {
    const files = Array.from(event.currentTarget.files ?? [])
    event.currentTarget.value = ""
    if (!files.length) return
    if (files.some((file) => !file.type.startsWith("image/"))) { setError("Select image files only"); return }
    if (imagesFor(field).length + files.length > 9) { setError("Add up to 9 images per preview"); return }
    setLoading(true)
    setError("")
    const uploaded: string[] = []
    try {
      for (const [index, file] of files.entries()) {
        setUploading({ field, current: index + 1, total: files.length })
        const result = await apiUpload(file)
        uploaded.push(result.url)
        draftUploads.current.add(result.url)
      }
      setFormData((current) => withImages(current, field, [...[current[field], ...(field === "image" ? current.galleryImages : current.mobileGalleryImages)].filter(Boolean), ...uploaded]))
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Failed to upload images")
    } finally {
      setUploading(null)
      setLoading(false)
    }
  }

  const removeImageAt = async (field: ProjectImageField, index: number) => {
    const url = imagesFor(field)[index]
    if (!url) return
    if (draftUploads.current.has(url)) {
      setLoading(true)
      setRemovingImage(url)
      try {
        await apiDeleteUpload(url)
        draftUploads.current.delete(url)
      } catch (cause) {
        setError(cause instanceof Error ? cause.message : "Failed to remove image")
        setRemovingImage(null)
        setLoading(false)
        return
      }
      setRemovingImage(null)
      setLoading(false)
    }
    setFormData((current) => {
      const images = [current[field], ...(field === "image" ? current.galleryImages : current.mobileGalleryImages)].filter(Boolean)
      images.splice(index, 1)
      return withImages(current, field, images)
    })
  }

  const reorderImages = (field: ProjectImageField, event: DragEndEvent) => {
    if (!event.over || event.active.id === event.over.id) return
    setFormData((current) => {
      const images = [current[field], ...(field === "image" ? current.galleryImages : current.mobileGalleryImages)].filter(Boolean)
      const from = images.indexOf(String(event.active.id))
      const to = images.indexOf(String(event.over!.id))
      return from < 0 || to < 0 ? current : withImages(current, field, arrayMove(images, from, to))
    })
  }

  const updateTechStack = (tags: string[]) => {
    setFormData((prev) => ({ ...prev, techStack: tags }))
  }

  const legacyScrolls = (field: ProjectImageField) => {
    const dimensions = imageDimensions[formData[field]]
    if (!formData[field] || !dimensions) return false
    const expected = scrollPreviewSize[field]
    return /\.jpe?g$/i.test(formData[field]) && dimensions.width === expected.width && dimensions.height === expected.height
  }

  const animationFor = (field: ProjectImageField): ProjectAnimation => {
    const selected = field === "image" ? formData.desktopAnimation : formData.mobileAnimation
    if (selected) return selected
    if (formData.scrollAnimation === true) return formData.previewAnimation === "gallery" ? field === "image" ? "fade" : "slide" : "scroll"
    if (formData.scrollAnimation === false) return "off"
    return legacyScrolls(field) ? "scroll" : "off"
  }

  const imageStatus = (field: ProjectImageField) => {
    const dimensions = imageDimensions[formData[field]]
    if (!formData[field] || !dimensions) return null
    const gallery = field === "image" ? formData.galleryImages : formData.mobileGalleryImages
    const animation = animationFor(field)
    const mode = animation === "fade" || animation === "slide" ? gallery.length ? `${animation === "fade" ? "Fade" : "Slide"} on hover` : "Add another image for this animation" : animation === "scroll" ? "Scrolls on hover when taller than the preview" : "Static cover"
    return `${dimensions.width} × ${dimensions.height} · ${mode}`
  }

  const savedImages = project ? [project.image, project.mobileImage, ...(project.galleryImages ?? []), ...(project.mobileGalleryImages ?? [])].filter(Boolean) : []
  const currentImages = [formData.image, formData.mobileImage, ...formData.galleryImages, ...formData.mobileGalleryImages].filter(Boolean)
  const hasSavedImageRemoval = savedImages.some((url) => !currentImages.includes(url))

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

            <ContentOptionSelectField kind="project-category" label="Category" value={formData.category} onChange={(value) => setFormData((prev) => ({ ...prev, category: value }))} disabled={loading} />
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
            <AiGenerateDialog kind="project" title={formData.title} context={{ category: formData.category, technologies: formData.techStack, currentDescription: formData.description }} onApply={(draft) => applyAi((current) => ({ ...current, description: draft.fields.description as string, category: draft.fields.category as string, status: draft.fields.status as string, techStack: draft.fields.technologies as string[] }))} onUndo={undoAi} onRedo={redoAi} canUndo={canUndo} canRedo={canRedo} />
          </div>

          <div><h3 className="text-sm font-medium">Project images</h3><p className="text-xs text-muted-foreground">Each preview appears only when its images are uploaded. Animation is set separately for web and mobile.</p></div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {([
              { field: "image", label: "Desktop Images", sample: "/samples/porto-project-desktop.jpg", sampleLabel: "Optional sample: Desktop · 800 × 1500 JPG" },
              { field: "mobileImage", label: "Mobile Images (optional)", sample: "/samples/porto-project-mobile.jpg", sampleLabel: "Optional sample: Mobile · 320 × 1600 JPG" },
            ] as const).map(({ field, label, sample, sampleLabel }) => {
              const images = imagesFor(field)
              const animationKey = field === "image" ? "desktopAnimation" : "mobileAnimation"
              const animation = animationFor(field)
              return <div key={field} className="space-y-2">
                <Label htmlFor={`${field}-upload`}>{label}</Label>
                <div className="flex flex-wrap items-center gap-2">
                  <Switch id={`${field}-animation`} aria-label={`Enable ${field === "image" ? "web" : "mobile"} animation`} checked={animation !== "off"} onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, [animationKey]: checked ? "scroll" : "off" }))} disabled={loading} />
                  <Label htmlFor={`${field}-animation`}>Animation</Label>
                  <Select value={animation === "off" ? "scroll" : animation} onValueChange={(value: ProjectAnimation) => setFormData((prev) => ({ ...prev, [animationKey]: value }))} disabled={animation === "off" || loading}>
                    <SelectTrigger aria-label={`${field === "image" ? "Web" : "Mobile"} animation type`} className="w-28"><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="scroll">Scroll</SelectItem><SelectItem value="fade">Fade</SelectItem><SelectItem value="slide">Slide</SelectItem></SelectContent>
                  </Select>
                </div>
                <div className="flex flex-wrap gap-2">
                  <DndContext sensors={dragSensors} collisionDetection={closestCenter} onDragEnd={(event) => reorderImages(field, event)}>
                    <SortableContext items={images} strategy={rectSortingStrategy} disabled={loading}>
                      {images.map((url, index) => <SortableProjectImage key={url} url={url} index={index} label={label} loading={loading} removing={removingImage === url} onRemove={() => { void removeImageAt(field, index) }} onLoad={(event) => {
                        const node = event.currentTarget
                        setImageDimensions((current) => ({ ...current, [url]: { width: node.naturalWidth, height: node.naturalHeight } }))
                      }} />)}
                    </SortableContext>
                  </DndContext>
                  {uploading?.field === field
                    ? <div role="status" aria-live="polite" className="flex h-28 w-20 flex-col items-center justify-center gap-2 rounded-md border border-dashed bg-muted/50 text-center text-xs text-muted-foreground"><Loader2 className="h-5 w-5 animate-spin" /><span>Uploading {uploading.current}/{uploading.total}</span></div>
                    : images.length < 9 && <label htmlFor={`${field}-upload`} className="flex h-28 w-20 cursor-pointer flex-col items-center justify-center gap-1 rounded-md border border-dashed text-xs text-muted-foreground hover:bg-accent"><ImagePlus className="h-5 w-5" /> Add images</label>}
                  <input id={`${field}-upload`} type="file" accept="image/*" multiple className="sr-only" onChange={(event) => { void handleImagesUpload(event, field) }} disabled={loading} />
                </div>
                <p className="text-xs text-muted-foreground">Drag images to set the order. The first image is the cover.</p>
                <a href={sample} target="_blank" rel="noopener noreferrer" className="inline-block text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground">{sampleLabel}</a>
                {imageStatus(field) && <p className="text-xs text-muted-foreground">{imageStatus(field)}</p>}
              </div>
            })}

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
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {saving && hasSavedImageRemoval ? "Saving and removing images..." : project ? "Update Project" : "Create Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
