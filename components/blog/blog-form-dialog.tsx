"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { X, Plus } from "lucide-react"

interface BlogPost {
  id?: number
  title: string
  slug: string
  excerpt: string
  content: string
  status: string
  category: string
  tags: string[]
  featured: boolean
  publishedAt: string | null
  readTime: string
  seoTitle: string
  metaDescription: string
}

interface BlogFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  post?: BlogPost
  onSave: (post: BlogPost) => void
}

export function BlogFormDialog({ open, onOpenChange, post, onSave }: BlogFormDialogProps) {
  const [formData, setFormData] = useState<BlogPost>({
    title: post?.title || "",
    slug: post?.slug || "",
    excerpt: post?.excerpt || "",
    content: post?.content || "",
    status: post?.status || "Draft",
    category: post?.category || "Tutorial",
    tags: post?.tags || [],
    featured: post?.featured || false,
    publishedAt: post?.publishedAt || null,
    readTime: post?.readTime || "5 min read",
    seoTitle: post?.seoTitle || "",
    metaDescription: post?.metaDescription || "",
    ...post,
  })

  const [newTag, setNewTag] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Auto-generate slug from title if empty
    if (!formData.slug && formData.title) {
      formData.slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
    }

    // Auto-generate SEO title if empty
    if (!formData.seoTitle && formData.title) {
      formData.seoTitle = formData.title
    }

    // Set publish date if status is Published and no date set
    if (formData.status === "Published" && !formData.publishedAt) {
      formData.publishedAt = new Date().toISOString().split("T")[0]
    }

    onSave(formData)
    onOpenChange(false)
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }))
      setNewTag("")
    }
  }

  const removeTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }))
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{post ? "Edit Blog Post" : "Write New Blog Post"}</DialogTitle>
          <DialogDescription>
            {post ? "Update your blog post content and settings" : "Create a new blog post with SEO optimization"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="content" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="seo">SEO</TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Post Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter your blog post title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData((prev) => ({ ...prev, excerpt: e.target.value }))}
                  placeholder="Brief description of your post"
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
                  placeholder="Write your blog post content here..."
                  rows={12}
                  className="font-mono text-sm"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Supports Markdown formatting. Rich text editor coming soon.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      <SelectItem value="Tutorial">Tutorial</SelectItem>
                      <SelectItem value="Opinion">Opinion</SelectItem>
                      <SelectItem value="Career">Career</SelectItem>
                      <SelectItem value="Tech Review">Tech Review</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

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
                      <SelectItem value="Draft">Draft</SelectItem>
                      <SelectItem value="Published">Published</SelectItem>
                      <SelectItem value="Scheduled">Scheduled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="readTime">Read Time</Label>
                  <Input
                    id="readTime"
                    value={formData.readTime}
                    onChange={(e) => setFormData((prev) => ({ ...prev, readTime: e.target.value }))}
                    placeholder="5 min read"
                  />
                </div>

                {(formData.status === "Published" || formData.status === "Scheduled") && (
                  <div className="space-y-2">
                    <Label htmlFor="publishedAt">Publish Date</Label>
                    <Input
                      id="publishedAt"
                      type="date"
                      value={formData.publishedAt || ""}
                      onChange={(e) => setFormData((prev) => ({ ...prev, publishedAt: e.target.value }))}
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add tag"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                  />
                  <Button type="button" onClick={addTag} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="gap-1">
                      {tag}
                      <button type="button" onClick={() => removeTag(tag)} className="ml-1 hover:text-destructive">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, featured: checked }))}
                />
                <Label htmlFor="featured">Featured Post (show on homepage)</Label>
              </div>
            </TabsContent>

            <TabsContent value="seo" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="slug">URL Slug</Label>
                  <div className="flex gap-2">
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                      placeholder="url-friendly-slug"
                    />
                    <Button type="button" onClick={generateSlug} size="sm" variant="outline">
                      Generate
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">yoursite.com/blog/{formData.slug || "your-post-slug"}</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="seoTitle">SEO Title</Label>
                  <Input
                    id="seoTitle"
                    value={formData.seoTitle}
                    onChange={(e) => setFormData((prev) => ({ ...prev, seoTitle: e.target.value }))}
                    placeholder="SEO optimized title"
                    maxLength={60}
                  />
                  <p className="text-xs text-muted-foreground">{formData.seoTitle.length}/60 characters</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="metaDescription">Meta Description</Label>
                <Textarea
                  id="metaDescription"
                  value={formData.metaDescription}
                  onChange={(e) => setFormData((prev) => ({ ...prev, metaDescription: e.target.value }))}
                  placeholder="Brief description for search engines"
                  rows={3}
                  maxLength={160}
                />
                <p className="text-xs text-muted-foreground">{formData.metaDescription.length}/160 characters</p>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Search Preview</h4>
                <div className="space-y-1">
                  <div className="text-blue-600 text-sm font-medium">
                    {formData.seoTitle || formData.title || "Your Post Title"}
                  </div>
                  <div className="text-green-700 text-xs">yoursite.com/blog/{formData.slug || "your-post-slug"}</div>
                  <div className="text-sm text-muted-foreground">
                    {formData.metaDescription || formData.excerpt || "Your post description will appear here..."}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{post ? "Update Post" : "Create Post"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
