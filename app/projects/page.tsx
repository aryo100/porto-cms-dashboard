"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PageHeader } from "@/components/common/page-header"
import { StatCard } from "@/components/common/stat-card"
import { SearchInput } from "@/components/common/search-input"
import { FilterDropdown } from "@/components/common/filter-dropdown"
import { RowActions } from "@/components/common/row-actions"
import { StatusBadge } from "@/components/common/status-badge"
import { IconLink } from "@/components/common/icon-link"
import { ConfirmDeleteDialog } from "@/components/common/confirm-delete-dialog"
import { ProjectFormDialog } from "@/components/projects/project-form-dialog"
import { useCMSStore } from "@/lib/store"
import {
  Plus,
  ArrowUpDown,
  Calendar,
  FolderOpen,
  TrendingUp,
  Clock,
  ExternalLink,
  Github,
} from "lucide-react"

interface Project {
  id: number
  title: string
  description: string
  status: string
  category: string
  technologies: string[]
  createdAt: string
  image: string
  githubUrl: string
  liveUrl: string | null
  tags: string[]
}

const categories = ["All", "Web Development", "Mobile App", "Desktop App", "API", "Other"]
const statusOptions = ["All", "Completed", "Upcoming", "Legacy"]
const sortOptions = ["Newest", "Oldest", "Title A-Z", "Title Z-A"]

export default function ProjectsPage() {
  const { projects, addProject, updateProject, deleteProject } = useCMSStore()

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedStatus, setSelectedStatus] = useState("All")
  const [sortOption, setSortOption] = useState("Newest")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<any>(undefined)
  const [focusedId, setFocusedId] = useState<number | null>(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const q = params.get("q")
    if (q) setSearchTerm(q)
    if (params.get("new") === "project") {
      setEditingProject(undefined)
      setIsFormOpen(true)
    }
    const focus = params.get("focus")
    if (focus) setFocusedId(Number(focus))
  }, [])

  useEffect(() => {
    if (focusedId !== null) {
      document.getElementById(`project-row-${focusedId}`)?.scrollIntoView({ behavior: "smooth", block: "center" })
    }
  }, [focusedId])
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; project: any | null }>({
    open: false,
    project: null,
  })
  const [expandedTech, setExpandedTech] = useState<Set<number>>(new Set())

  const toggleTech = (id: number) => {
    setExpandedTech((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const filteredProjects = (projects || []).filter((project) => {
    const q = searchTerm.toLowerCase()
    const matchesSearch = q
      ? [
          project.title,
          project.description,
          project.category,
          project.status,
          project.client,
          ...(project.tags ?? []),
          ...(project.technologies ?? []),
        ].some((field) => field?.toLowerCase().includes(q))
      : true
    const matchesCategory = selectedCategory === "All" || project.category === selectedCategory
    const matchesStatus = selectedStatus === "All" || project.status === selectedStatus

    return matchesSearch && matchesCategory && matchesStatus
  })

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    switch (sortOption) {
      case "Oldest":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      case "Title A-Z":
        return a.title.localeCompare(b.title)
      case "Title Z-A":
        return b.title.localeCompare(a.title)
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }
  })

  const completedProjects = (projects || []).filter((project) => project.status === "Completed")
  const upcomingProjects = (projects || []).filter((project) => project.status === "Upcoming")

  const handleSaveProject = (projectData: any) => {
    const { techStack, ...data } = projectData
    if (editingProject) {
      updateProject(editingProject.id, data)
    } else {
      addProject(data)
    }
    setEditingProject(undefined)
  }

  const handleEditProject = (project: any) => {
    setEditingProject(project)
    setIsFormOpen(true)
  }

  const handleDeleteProject = (project: any) => {
    setDeleteDialog({ open: true, project })
  }

  const confirmDelete = () => {
    if (deleteDialog.project) {
      deleteProject(deleteDialog.project.id)
    }
    setDeleteDialog({ open: false, project: null })
  }

  const handleAddProject = () => {
    setEditingProject(undefined)
    setIsFormOpen(true)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader title="Projects" description="Manage your portfolio projects and track their progress">
          <Button className="gap-2" onClick={handleAddProject}>
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </PageHeader>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="Total Projects"
            value={(projects || []).length}
            footer={
              <>
                <span className="text-primary font-medium">+2</span>
                {" from last month"}
              </>
            }
            icon={FolderOpen}
          />
          <StatCard title="Completed" value={completedProjects.length} footer="Successfully delivered" icon={TrendingUp} />
          <StatCard title="Upcoming" value={upcomingProjects.length} footer="Upcoming work" icon={Clock} />
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <SearchInput
                placeholder="Search projects..."
                value={searchTerm}
                onChange={setSearchTerm}
              />

              <div className="flex flex-wrap gap-2 sm:justify-end">
                <FilterDropdown
                  label="Category"
                  options={categories}
                  value={selectedCategory}
                  onChange={setSelectedCategory}
                />
                <FilterDropdown
                  label="Status"
                  options={statusOptions}
                  value={selectedStatus}
                  onChange={setSelectedStatus}
                />
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Tech Stack</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedProjects.map((project) => (
                  <TableRow
                    key={project.id}
                    id={`project-row-${project.id}`}
                    className={`h-16 ${focusedId === project.id ? "bg-primary/10" : ""}`}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-16 items-center justify-center rounded-md bg-muted">
                          <FolderOpen className="h-6 w-6 text-primary" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-foreground truncate">{project.title}</p>
                          </div>
                          <p className="text-sm text-muted-foreground truncate">{project.description}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{project.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {(project.technologies || [])
                          .slice(0, expandedTech.has(project.id) ? undefined : 2)
                          .map((tech) => (
                            <Badge key={tech} variant="outline" className="text-xs">
                              {tech}
                            </Badge>
                          ))}
                        {(project.technologies || []).length > 2 && (
                          <button
                            type="button"
                            onClick={() => toggleTech(project.id)}
                            className="cursor-pointer rounded-md border px-1.5 py-0.5 text-xs text-muted-foreground transition-colors hover:bg-accent"
                          >
                            {expandedTech.has(project.id)
                              ? "− less"
                              : `+${(project.technologies || []).length - 2} more`}
                          </button>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge value={project.status} />
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(project.createdAt).toLocaleDateString("en-US")}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {project.githubUrl && <IconLink href={project.githubUrl} icon={Github} label="GitHub" />}
                        {project.liveUrl && (
                          <IconLink href={project.liveUrl} icon={ExternalLink} label="Live site" />
                        )}
                        <RowActions
                          onEdit={() => handleEditProject(project)}
                          onDelete={() => handleDeleteProject(project)}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <ProjectFormDialog
          open={isFormOpen}
          onOpenChange={setIsFormOpen}
          project={editingProject}
          onSave={handleSaveProject}
        />

        <ConfirmDeleteDialog
          open={deleteDialog.open}
          onOpenChange={(open) => setDeleteDialog({ open, project: null })}
          title="Delete Project"
          description={
            <>
              Are you sure you want to delete "{deleteDialog.project?.title || ""}"? This action cannot be undone.
            </>
          }
          confirmLabel="Delete Project"
          onConfirm={confirmDelete}
        />
      </div>
    </DashboardLayout>
  )
}