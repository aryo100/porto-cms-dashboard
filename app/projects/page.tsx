"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ProjectFormDialog } from "@/components/projects/project-form-dialog"
import { DeleteProjectDialog } from "@/components/projects/delete-project-dialog"
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
  FolderOpen,
  TrendingUp,
  Users,
  DollarSign,
  ExternalLink,
  Github,
  Star,
} from "lucide-react"

interface Project {
  id: number
  title: string
  description: string
  status: string
  category: string
  technologies: string[]
  featured: boolean
  progress: number
  createdAt: string
  image: string
  githubUrl: string
  liveUrl: string | null
  tags: string[]
  budget: number
  priority: string
}

const categories = ["All", "Web Development", "Mobile App", "Desktop App", "API", "Other"]
const statusOptions = ["All", "Planning", "In Progress", "Completed", "On Hold", "Cancelled"]
const priorityOptions = ["All", "Low", "Medium", "High", "Critical"]

export default function ProjectsPage() {
  const { projects, addProject, updateProject, deleteProject } = useCMSStore()

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedStatus, setSelectedStatus] = useState("All")
  const [selectedPriority, setSelectedPriority] = useState("All")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<any>(undefined)
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; project: any | null }>({
    open: false,
    project: null,
  })

  const filteredProjects = (projects || []).filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.tags || []).some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === "All" || project.category === selectedCategory
    const matchesStatus = selectedStatus === "All" || project.status === selectedStatus
    const matchesPriority = selectedPriority === "All" || project.priority === selectedPriority

    return matchesSearch && matchesCategory && matchesStatus && matchesPriority
  })

  const totalBudget = (projects || []).reduce((sum, project) => sum + (project.budget || 0), 0)
  const completedProjects = (projects || []).filter((project) => project.status === "Completed")
  const inProgressProjects = (projects || []).filter((project) => project.status === "In Progress")

  const handleSaveProject = (projectData: any) => {
    if (editingProject) {
      updateProject(editingProject.id, projectData)
    } else {
      addProject(projectData)
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
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Projects</h1>
            <p className="text-muted-foreground">Manage your portfolio projects and track their progress</p>
          </div>
          <Button className="gap-2" onClick={handleAddProject}>
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
              <FolderOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{(projects || []).length}</div>
              <p className="text-xs text-muted-foreground">+2 from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedProjects.length}</div>
              <p className="text-xs text-muted-foreground">Successfully delivered</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inProgressProjects.length}</div>
              <p className="text-xs text-muted-foreground">Active projects</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalBudget.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Project value</p>
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
                    placeholder="Search projects..."
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

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="gap-2 bg-transparent">
                        <Filter className="h-4 w-4" />
                        Priority: {selectedPriority}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {priorityOptions.map((priority) => (
                        <DropdownMenuItem key={priority} onClick={() => setSelectedPriority(priority)}>
                          {priority}
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
                  <TableHead>Project</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Tech Stack</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProjects.map((project) => (
                  <TableRow key={project.id} className="h-16">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-16 rounded-md bg-muted flex items-center justify-center">
                          <FolderOpen className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-foreground truncate">{project.title}</p>
                            {project.featured && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
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
                        {(project.technologies || []).slice(0, 2).map((tech) => (
                          <Badge key={tech} variant="outline" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                        {(project.technologies || []).length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{(project.technologies || []).length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={project.status === "Completed" ? "default" : "secondary"}>{project.status}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all duration-300"
                            style={{ width: `${project.progress || 0}%` }}
                          />
                        </div>
                        <span className="text-xs">{project.progress || 0}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(project.createdAt).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {project.githubUrl && (
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" asChild>
                            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                              <Github className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                        {project.liveUrl && (
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" asChild>
                            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
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
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2" onClick={() => handleEditProject(project)}>
                              <Edit className="h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="gap-2 text-destructive"
                              onClick={() => handleDeleteProject(project)}
                            >
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

        <ProjectFormDialog
          open={isFormOpen}
          onOpenChange={setIsFormOpen}
          project={editingProject}
          onSave={handleSaveProject}
        />

        <DeleteProjectDialog
          open={deleteDialog.open}
          onOpenChange={(open) => setDeleteDialog({ open, project: null })}
          projectTitle={deleteDialog.project?.title || ""}
          onConfirm={confirmDelete}
        />
      </div>
    </DashboardLayout>
  )
}
