"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PageHeader } from "@/components/common/page-header"
import { StatCard } from "@/components/common/stat-card"
import { SearchInput } from "@/components/common/search-input"
import { FilterDropdown } from "@/components/common/filter-dropdown"
import { RowActions } from "@/components/common/row-actions"
import { ConfirmDeleteDialog } from "@/components/common/confirm-delete-dialog"
import { BlogFormDialog } from "@/components/blog/blog-form-dialog"
import { useCMSStore } from "@/lib/store"
import { Plus, ArrowUpDown, FileText, Type, BookOpen } from "lucide-react"

interface BlogPost {
  id: number
  title: string
  slug: string
  date: string
  description: string
  content: string[]
  createdAt: string
  updatedAt: string
}

const sortOptions = ["Newest", "Oldest"]

export default function BlogPage() {
  const { blogPosts, addBlogPost, updateBlogPost, deleteBlogPost } = useCMSStore()

  const [searchTerm, setSearchTerm] = useState("")
  const [sortOption, setSortOption] = useState("Newest")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingPost, setEditingPost] = useState<any>(undefined)
  const [focusedId, setFocusedId] = useState<number | null>(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const q = params.get("q")
    if (q) setSearchTerm(q)
    if (params.get("new") === "post") {
      setEditingPost(undefined)
      setIsFormOpen(true)
    }
    const focus = params.get("focus")
    if (focus) setFocusedId(Number(focus))
  }, [])

  useEffect(() => {
    if (focusedId !== null) {
      document.getElementById(`post-row-${focusedId}`)?.scrollIntoView({ behavior: "smooth", block: "center" })
    }
  }, [focusedId])
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; post: any | null }>({
    open: false,
    post: null,
  })

  const filteredPosts = blogPosts.filter((post) => {
    const q = searchTerm.toLowerCase()
    const matchesSearch = q
      ? [post.title, post.description, post.slug, ...(post.content ?? [])].some((field) =>
          field?.toLowerCase().includes(q),
        )
      : true
    return matchesSearch
  })

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    const aTime = new Date(a.createdAt).getTime()
    const bTime = new Date(b.createdAt).getTime()
    return sortOption === "Oldest" ? aTime - bTime : bTime - aTime
  })

  const totalWords = blogPosts.reduce(
    (sum, post) => sum + (post.content ?? []).reduce((s, para) => s + para.split(/\s+/).length, 0),
    0,
  )
  const avgWords = blogPosts.length ? Math.round(totalWords / blogPosts.length) : 0
  const longestPost = blogPosts.reduce(
    (max, post) => {
      const words = (post.content ?? []).reduce((s, para) => s + para.split(/\s+/).length, 0)
      return words > (max?.words ?? 0) ? { title: post.title, words } : max
    },
    undefined as { title: string; words: number } | undefined,
  )

  const handleSavePost = async (postData: any) => {
    if (editingPost) {
      await updateBlogPost(editingPost.id, postData)
    } else {
      await addBlogPost(postData)
    }
    setEditingPost(undefined)
  }

  const handleEditPost = (post: any) => {
    setEditingPost(post)
    setIsFormOpen(true)
  }

  const handleDeletePost = (post: any) => {
    setDeleteDialog({ open: true, post })
  }

  const confirmDelete = async () => {
    if (deleteDialog.post) {
      await deleteBlogPost(deleteDialog.post.id)
    }
    setDeleteDialog({ open: false, post: null })
  }

  const handleAddPost = () => {
    setEditingPost(undefined)
    setIsFormOpen(true)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader title="Blog Posts" description="Manage your blog articles">
          <Button className="gap-2" onClick={handleAddPost}>
            <Plus className="h-4 w-4" />
            Write New Post
          </Button>
        </PageHeader>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <StatCard title="Total Posts" value={blogPosts.length} footer="Articles on your blog" icon={FileText} />
          <StatCard title="Avg Words / Post" value={avgWords.toLocaleString("en-US")} footer="Across all posts" icon={Type} />
          <StatCard
            title="Longest Post"
            value={longestPost ? longestPost.words.toLocaleString("en-US") : "—"}
            footer={longestPost ? `${longestPost.title} · ${longestPost.words} words` : "No posts yet"}
            icon={BookOpen}
          />
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <SearchInput placeholder="Search posts..." value={searchTerm} onChange={setSearchTerm} />

              <div className="flex gap-2">
                <FilterDropdown
                  label="Sort"
                  options={sortOptions}
                  value={sortOption}
                  onChange={setSortOption}
                  icon={ArrowUpDown}
                />
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <Table className="min-w-[560px] table-fixed">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50%]">Post</TableHead>
                  <TableHead className="w-[25%]">Slug</TableHead>
                  <TableHead className="w-[15%]">Date</TableHead>
                  <TableHead className="w-[10%] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedPosts.map((post) => (
                  <TableRow
                    key={post.id}
                    id={`post-row-${post.id}`}
                    className={`h-16 ${focusedId === post.id ? "bg-primary/10" : ""}`}
                  >
                    <TableCell>
                      <div className="min-w-0 space-y-1">
                        <p className="truncate font-medium text-foreground" title={post.title}>{post.title}</p>
                        <p className="line-clamp-2 max-w-md break-all whitespace-normal text-sm text-muted-foreground" title={post.description}>{post.description}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="truncate text-sm text-muted-foreground" title={`/${post.slug}`}>/{post.slug}</p>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{post.date}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end">
                        <RowActions
                          onEdit={() => handleEditPost(post)}
                          onDelete={() => handleDeletePost(post)}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {isFormOpen && <BlogFormDialog open={isFormOpen} onOpenChange={setIsFormOpen} post={editingPost} onSave={handleSavePost} />}

        <ConfirmDeleteDialog
          open={deleteDialog.open}
          onOpenChange={(open) => setDeleteDialog({ open, post: null })}
          title="Delete Blog Post"
          description={
            <>
              Are you sure you want to delete "{deleteDialog.post?.title || ""}"? This action cannot be undone and will
              remove the post from your blog.
            </>
          }
          confirmLabel="Delete Post"
          onConfirm={confirmDelete}
        />
      </div>
    </DashboardLayout>
  )
}
