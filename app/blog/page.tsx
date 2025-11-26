"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { BlogFormDialog } from "@/components/blog/blog-form-dialog"
import { DeleteBlogDialog } from "@/components/blog/delete-blog-dialog"
import { useCMSStore } from "@/lib/store"
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Calendar,
  FileText,
  TrendingUp,
  MessageSquare,
  Clock,
  ExternalLink,
} from "lucide-react"

interface BlogPost {
  id: number
  title: string
  slug: string
  excerpt: string
  content: string
  status: string
  category: string
  tags: string[]
  author: string
  publishedAt: string | null
  updatedAt: string
  readTime: string
  views: number
  comments: number
  likes: number
  featured: boolean
  seoTitle: string
  metaDescription: string
}

const categories = ["All", "Tutorial", "Opinion", "Career", "Tech Review"]
const statusOptions = ["All", "Published", "Draft", "Scheduled"]

export default function BlogPage() {
  const { blogPosts, addBlogPost, updateBlogPost, deleteBlogPost } = useCMSStore()

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedStatus, setSelectedStatus] = useState("All")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingPost, setEditingPost] = useState<any>(undefined)
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; post: any | null }>({
    open: false,
    post: null,
  })

  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory
    const matchesStatus = selectedStatus === "All" || post.status === selectedStatus

    return matchesSearch && matchesCategory && matchesStatus
  })

  const totalViews = blogPosts.reduce((sum, post) => sum + post.views, 0)
  const totalComments = blogPosts.reduce((sum, post) => sum + post.comments, 0)
  const publishedPosts = blogPosts.filter((post) => post.status === "Published")

  const handleSavePost = (postData: any) => {
    if (editingPost) {
      updateBlogPost(editingPost.id, postData)
    } else {
      addBlogPost(postData)
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

  const confirmDelete = () => {
    if (deleteDialog.post) {
      deleteBlogPost(deleteDialog.post.id)
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
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Blog Posts</h1>
            <p className="text-muted-foreground">Create and manage your blog content with SEO optimization</p>
          </div>
          <Button className="gap-2" onClick={handleAddPost}>
            <Plus className="h-4 w-4" />
            Write New Post
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{blogPosts.length}</div>
              <p className="text-xs text-muted-foreground">+3 from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Published</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{publishedPosts.length}</div>
              <p className="text-xs text-muted-foreground">Live articles</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalViews.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Comments</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalComments}</div>
              <p className="text-xs text-muted-foreground">Engagement rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search posts, tags..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full sm:w-80"
                  />
                </div>

                <div className="flex gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="gap-2 bg-transparent">
                        <Filter className="h-4 w-4" />
                        Category: {selectedCategory}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {categories.map((category) => (
                        <DropdownMenuItem key={category} onClick={() => setSelectedCategory(category)}>
                          {category}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="gap-2 bg-transparent">
                        <Filter className="h-4 w-4" />
                        Status: {selectedStatus}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {statusOptions.map((status) => (
                        <DropdownMenuItem key={status} onClick={() => setSelectedStatus(status)}>
                          {status}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Post</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Performance</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPosts.map((post) => (
                  <TableRow key={post.id} className="h-20">
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-foreground line-clamp-1">{post.title}</p>
                          {post.featured && (
                            <Badge variant="secondary" className="text-xs">
                              Featured
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 max-w-md">{post.excerpt}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {post.readTime}
                          <span>•</span>
                          <span>/{post.slug}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Badge variant="outline">{post.category}</Badge>
                        <div className="flex flex-wrap gap-1">
                          {post.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {post.tags.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{post.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          post.status === "Published"
                            ? "default"
                            : post.status === "Scheduled"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {post.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Eye className="h-3 w-3" />
                          {post.views.toLocaleString()}
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <MessageSquare className="h-3 w-3" />
                          {post.comments}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      <div className="space-y-1 text-sm">
                        {post.publishedAt && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(post.publishedAt).toLocaleDateString()}
                          </div>
                        )}
                        <div className="text-xs">Updated: {new Date(post.updatedAt).toLocaleDateString()}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {post.status === "Published" && (
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" asChild>
                            <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem className="gap-2">
                              <Eye className="h-4 w-4" />
                              Preview
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2" onClick={() => handleEditPost(post)}>
                              <Edit className="h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2">
                              <TrendingUp className="h-4 w-4" />
                              Analytics
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2 text-destructive" onClick={() => handleDeletePost(post)}>
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <BlogFormDialog open={isFormOpen} onOpenChange={setIsFormOpen} post={editingPost} onSave={handleSavePost} />

        <DeleteBlogDialog
          open={deleteDialog.open}
          onOpenChange={(open) => setDeleteDialog({ open, post: null })}
          postTitle={deleteDialog.post?.title || ""}
          onConfirm={confirmDelete}
        />
      </div>
    </DashboardLayout>
  )
}
