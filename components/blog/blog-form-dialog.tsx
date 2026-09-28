"use client"

import type React from "react"

import { useState } from "react"
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
import { Loader2 } from "lucide-react"

interface BlogPost {
  id?: number
  title: string
  slug: string
  date: string
  description: string
  content: string[]
}

interface BlogFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  post?: BlogPost
  onSave: (post: BlogPost) => void
}

export function BlogFormDialog({ open, onOpenChange, post, onSave }: BlogFormDialogProps) {
  const [formData, setFormData] = useState({
    title: post?.title || "",
    slug: post?.slug || "",
    date: post?.date || "",
    description: post?.description || "",
    contentText: (post?.content ?? []).join("\n\n"),
  })

  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 500))

    const slug =
      formData.slug ||
      formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")

    const content = formData.contentText
      .split(/\n\s*\n/)
      .map((para) => para.trim())
      .filter(Boolean)

    onSave({
      title: formData.title,
      slug,
      date: formData.date,
      description: formData.description,
      content,
    })
    onOpenChange(false)
    setLoading(false)
  }

  const generateSlug = () => {
    if (formData.title) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
      setFormData((prev) => ({ ...prev, slug }))
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{post ? "Edit Blog Post" : "Write New Blog Post"}</DialogTitle>
          <DialogDescription>
            {post ? "Update your blog article" : "Create a new article for your blog"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Enter your article title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">URL Slug</Label>
            <div className="flex gap-2">
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                placeholder="url-friendly-slug"
              />
              <Button type="button" onClick={generateSlug} variant="outline">
                Generate
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">yoursite.com/blog/{formData.slug || "your-post-slug"}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                value={formData.date}
                onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                placeholder="February 2024"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Brief summary of the article"
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={formData.contentText}
              onChange={(e) => setFormData((prev) => ({ ...prev, contentText: e.target.value }))}
              placeholder={"Write your article content here...\n\nSeparate paragraphs with a blank line."}
              rows={12}
              className="font-mono text-sm"
              required
            />
            <p className="text-xs text-muted-foreground">Separate paragraphs with a blank line.</p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {post ? "Update Post" : "Create Post"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}