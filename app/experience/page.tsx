"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PageHeader } from "@/components/common/page-header"
import { StatCard } from "@/components/common/stat-card"
import { SearchInput } from "@/components/common/search-input"
import { FilterDropdown } from "@/components/common/filter-dropdown"
import { RowActions } from "@/components/common/row-actions"
import { IconLink } from "@/components/common/icon-link"
import { ConfirmDeleteDialog } from "@/components/common/confirm-delete-dialog"
import { WorkExperienceDialog } from "@/components/experience/work-experience-dialog"
import { EducationDialog } from "@/components/experience/education-dialog"
import { SkillDialog } from "@/components/experience/skill-dialog"
import { AchievementDialog } from "@/components/experience/achievement-dialog"
import { useCMSStore } from "@/lib/store"
import { SkillIcon } from "@/components/experience/skill-icon"
import { jsPDF } from "jspdf"
import {
  Plus,
  Briefcase,
  GraduationCap,
  Award,
  Code,
  Calendar,
  MapPin,
  Building,
  Star,
  ExternalLink,
  Download,
} from "lucide-react"

const skillCategories = ["All", "Programming", "Frontend", "Backend", "Cloud", "DevOps", "Database", "Mobile", "Design"]

function SkillIconPreview({ icon, color }: { icon: string; color: string }) {
  return <SkillIcon name={icon} className="h-4 w-4" style={{ color: color || "#64748b" }} />
}

type DeleteTarget = { type: "work" | "education" | "skill" | "achievement"; id: number; title: string }

export default function ExperiencePage() {
  const {
    workExperience,
    education,
    skills,
    achievements,
    addWorkExperience,
    updateWorkExperience,
    deleteWorkExperience,
    addEducation,
    updateEducation,
    deleteEducation,
    addSkill,
    updateSkill,
    deleteSkill,
    addAchievement,
    updateAchievement,
    deleteAchievement,
  } = useCMSStore()

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSkillCategory, setSelectedSkillCategory] = useState("All")
  const [workDialog, setWorkDialog] = useState<{ open: boolean; experience?: any }>({ open: false })
  const [educationDialog, setEducationDialog] = useState<{ open: boolean; education?: any }>({ open: false })
  const [skillDialog, setSkillDialog] = useState<{ open: boolean; skill?: any }>({ open: false })
  const [achievementDialog, setAchievementDialog] = useState<{ open: boolean; achievement?: any }>({ open: false })
  const [activeTab, setActiveTab] = useState("work")
  const [focused, setFocused] = useState<
    { type: "work" | "education" | "skills" | "achievement"; id: number } | null
  >(null)
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get("new") === "certificate") {
      setAchievementDialog({ open: true })
      setActiveTab("achievements")
    }
    const focus = params.get("focus")
    const type = params.get("type")
    if (focus && (type === "work" || type === "education" || type === "skills" || type === "achievement")) {
      setFocused({ type, id: Number(focus) })
      setActiveTab(type === "achievement" ? "achievements" : type)
    }
  }, [])

  useEffect(() => {
    if (focused) {
      document
        .getElementById(`focus-${focused.type}-${focused.id}`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" })
    }
  }, [focused])

  const filteredSkills = skills.filter((skill) => {
    const matchesSearch = skill.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedSkillCategory === "All" || skill.category === selectedSkillCategory
    return matchesSearch && matchesCategory
  })

  const totalYearsExperience = workExperience.reduce((years, item) => {
    if (!item.startDate) return years
    const start = new Date(item.startDate).getTime()
    const end = item.current ? Date.now() : item.endDate ? new Date(item.endDate).getTime() : start
    return years + Math.max(0, (end - start) / 31_557_600_000)
  }, 0)
  const currentPosition = workExperience.find((exp) => exp.current)

  const handleSaveWorkExperience = async (experienceData: any) => {
    if (workDialog.experience) {
      await updateWorkExperience(workDialog.experience.id, experienceData)
    } else {
      await addWorkExperience(experienceData)
    }
  }

  const handleSaveEducation = async (educationData: any) => {
    if (educationDialog.education) {
      await updateEducation(educationDialog.education.id, educationData)
    } else {
      await addEducation(educationData)
    }
  }

  const handleSaveSkill = async (skillData: any) => {
    if (skillDialog.skill) {
      await updateSkill(skillDialog.skill.id, skillData)
    } else {
      await addSkill(skillData)
    }
  }

  const handleSaveAchievement = async (achievementData: any) => {
    if (achievementDialog.achievement) {
      await updateAchievement(achievementDialog.achievement.id, achievementData)
    } else {
      await addAchievement(achievementData)
    }
  }

  const profile = useCMSStore((state) => state.profile)

  const formatMonthYear = (date: string) =>
    new Date(date).toLocaleDateString("en-US", { month: "short", year: "numeric" })

  const handleExportResume = () => {
    const doc = new jsPDF({ unit: "pt", format: "letter" })
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    const margin = 54
    const contentWidth = pageWidth - margin * 2
    let y = margin

    const ensureSpace = (needed: number) => {
      if (y + needed > pageHeight - margin) {
        doc.addPage()
        y = margin
      }
    }

    const write = (text: string, size = 10, style: "normal" | "bold" | "italic" = "normal", indent = 0) => {
      doc.setFont("helvetica", style)
      doc.setFontSize(size)
      const lines = doc.splitTextToSize(text, contentWidth - indent)
      for (const line of lines) {
        ensureSpace(16)
        doc.text(line, margin + indent, y)
        y += 14
      }
    }

    const section = (title: string) => {
      ensureSpace(34)
      y += 12
      doc.setFont("helvetica", "bold")
      doc.setFontSize(12)
      doc.text(title.toUpperCase(), margin, y)
      y += 10
      doc.setDrawColor(80, 80, 80)
      doc.setLineWidth(0.75)
      doc.line(margin, y, pageWidth - margin, y)
      y += 14
    }

    write(profile.name || "Your Name", 20, "bold")
    if (profile.email) write(profile.email, 10, "normal")

    section("Work Experience")
    workExperience.forEach((exp, i) => {
      if (i > 0) y += 8
      write(`${exp.position} - ${exp.company}`, 11, "bold")
      write(exp.location, 9)
      write(`${formatMonthYear(exp.startDate)} - ${exp.current ? "Present" : formatMonthYear(exp.endDate!)}`, 9, "italic")
      write(exp.description, 10)
      exp.achievements.forEach((a) => write(`- ${a}`, 10, "normal", 10))
      if (exp.technologies.length) write(`Technologies: ${exp.technologies.join(", ")}`, 9)
    })

    section("Education")
    education.forEach((edu, i) => {
      if (i > 0) y += 8
      write(`${edu.degree} - ${edu.institution}`, 11, "bold")
      write(edu.location, 9)
      write(`${formatMonthYear(edu.startDate)} - ${formatMonthYear(edu.endDate)}`, 9, "italic")
      if (edu.gpa) write(`GPA: ${edu.gpa}`, 10)
      edu.achievements.forEach((a) => write(`- ${a}`, 10, "normal", 10))
    })

    section("Skills")
    skills.forEach((skill) => write(`- ${skill.name} (${skill.category}, ${skill.level}%)`, 10))

    section("Certifications & Achievements")
    achievements.forEach((ach) => {
      write(`- ${ach.title} - ${ach.issuer} (${ach.date})`, 10)
      if (ach.url) write(ach.url, 9)
    })

    doc.save("resume.pdf")
  }

  const confirmDelete = async () => {
    if (!deleteTarget) return
    switch (deleteTarget.type) {
      case "work":
        await deleteWorkExperience(deleteTarget.id)
        break
      case "education":
        await deleteEducation(deleteTarget.id)
        break
      case "skill":
        await deleteSkill(deleteTarget.id)
        break
      case "achievement":
        await deleteAchievement(deleteTarget.id)
        break
    }
    setDeleteTarget(null)
  }

  const deleteMeta: Record<DeleteTarget["type"], { title: string; confirmLabel: string }> = {
    work: { title: "Delete Work Experience", confirmLabel: "Delete Experience" },
    education: { title: "Delete Education", confirmLabel: "Delete Education" },
    skill: { title: "Delete Skill", confirmLabel: "Delete Skill" },
    achievement: { title: "Delete Achievement", confirmLabel: "Delete Achievement" },
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader title="Experience" description="Manage your professional journey, skills, and achievements">
          <Button variant="outline" className="gap-2 bg-transparent" onClick={handleExportResume}>
            <Download className="h-4 w-4" />
            Export Resume
          </Button>
        </PageHeader>

        <div className="grid gap-4 md:grid-cols-4">
          <StatCard
            title="Years Experience"
            value={Math.round(totalYearsExperience)}
            footer="Professional experience"
            icon={Briefcase}
          />
          <StatCard title="Companies" value={new Set(workExperience.map((item) => item.company)).size} footer="Organizations worked" icon={Building} />
          <StatCard title="Skills" value={skills.length} footer="Technical skills" icon={Code} />
          <StatCard
            title="Certifications"
            value={achievements.filter((a) => a.type === "Certification").length}
            footer="Active certifications"
            icon={Award}
          />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="work">Work Experience</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          {/* Work Experience Tab */}
          <TabsContent value="work" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Work Experience</CardTitle>
                  <Button className="gap-2" onClick={() => setWorkDialog({ open: true })}>
                    <Plus className="h-4 w-4" />
                    Add Experience
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {workExperience.map((exp, index) => (
                    <div
                      key={exp.id}
                      id={`focus-work-${exp.id}`}
                      className={`relative rounded-lg p-2 -m-2 transition-colors ${
                        focused?.type === "work" && focused.id === exp.id
                          ? "bg-primary/10 ring-2 ring-primary/40"
                          : ""
                      }`}
                    >
                      {index < workExperience.length - 1 && (
                        <div className="absolute left-8 top-8 h-full w-px bg-border" />
                      )}

                      <div className="flex gap-4">
                        <div
                          className={`relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 ${
                            exp.current ? "border-primary bg-primary" : "border-border bg-background"
                          }`}
                        >
                          <Briefcase
                            className={`h-5 w-5 ${exp.current ? "text-primary-foreground" : "text-muted-foreground"}`}
                          />
                        </div>

                        <div className="min-w-0 flex-1 space-y-3">
                          <div className="flex min-w-0 items-start justify-between gap-2">
                            <div className="min-w-0">
                              <h3 className="truncate font-semibold text-foreground" title={exp.position}>{exp.position}</h3>
                              <div className="flex min-w-0 items-center gap-2 text-sm text-muted-foreground">
                                <Building className="h-4 w-4 shrink-0" />
                                <span className="truncate" title={exp.company}>{exp.company}</span>
                                <span>•</span>
                                <MapPin className="h-4 w-4 shrink-0" />
                                <span className="truncate" title={exp.location}>{exp.location}</span>
                              </div>
                              <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                                <Calendar className="h-4 w-4" />
                                <span>
                                  {new Date(exp.startDate).toLocaleDateString("en-US", {
                                    month: "short",
                                    year: "numeric",
                                  })}{" "}
                                  -{" "}
                                  {exp.current
                                    ? "Present"
                                    : new Date(exp.endDate!).toLocaleDateString("en-US", {
                                        month: "short",
                                        year: "numeric",
                                      })}
                                </span>
                                {exp.current && (
                                  <Badge variant="secondary" className="ml-2">
                                    Current
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <RowActions
                              onEdit={() => setWorkDialog({ open: true, experience: exp })}
                              onDelete={() =>
                                setDeleteTarget({ type: "work", id: exp.id, title: exp.position })
                              }
                            />
                          </div>

                          <p className="line-clamp-3 break-all text-sm text-muted-foreground" title={exp.description}>{exp.description}</p>

                          <div className="space-y-2">
                            <h4 className="text-sm font-medium">Key Achievements:</h4>
                            <ul className="space-y-1">
                              {exp.achievements.map((achievement, i) => (
                                <li key={i} className="flex min-w-0 items-start gap-2 text-sm text-muted-foreground">
                                  <Star className="h-3 w-3 mt-0.5 text-primary shrink-0" />
                                  <span className="truncate" title={achievement}>{achievement}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="flex flex-wrap gap-1">
                            {exp.technologies.map((tech) => (
                              <Badge key={tech} variant="outline" className="max-w-full text-xs">
                                <span className="truncate" title={tech}>{tech}</span>
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Education Tab */}
          <TabsContent value="education" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Education</CardTitle>
                  <Button className="gap-2" onClick={() => setEducationDialog({ open: true })}>
                    <Plus className="h-4 w-4" />
                    Add Education
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {education.map((edu) => (
                    <div
                      key={edu.id}
                      id={`focus-education-${edu.id}`}
                      className={`flex gap-4 p-4 border rounded-lg transition-colors ${
                        focused?.type === "education" && focused.id === edu.id
                          ? "bg-primary/10 ring-2 ring-primary/40"
                          : ""
                      }`}
                    >
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <GraduationCap className="h-6 w-6 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1 space-y-2">
                        <div className="flex min-w-0 items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h3 className="truncate font-semibold text-foreground" title={edu.degree}>{edu.degree}</h3>
                            <div className="flex min-w-0 items-center gap-2 text-sm text-muted-foreground">
                              <Building className="h-4 w-4 shrink-0" />
                              <span className="truncate" title={edu.institution}>{edu.institution}</span>
                              <span>•</span>
                              <MapPin className="h-4 w-4 shrink-0" />
                              <span className="truncate" title={edu.location}>{edu.location}</span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>
                                  {new Date(edu.startDate).toLocaleDateString("en-US", {
                                    month: "short",
                                    year: "numeric",
                                  })}{" "}
                                  -{" "}
                                  {new Date(edu.endDate).toLocaleDateString("en-US", {
                                    month: "short",
                                    year: "numeric",
                                  })}
                                </span>
                              </div>
                              {edu.gpa && <Badge variant="secondary">GPA: {edu.gpa}</Badge>}
                            </div>
                          </div>
                          <RowActions
                            onEdit={() => setEducationDialog({ open: true, education: edu })}
                            onDelete={() =>
                              setDeleteTarget({ type: "education", id: edu.id, title: edu.degree })
                            }
                          />
                        </div>

                        <div className="space-y-1">
                          <h4 className="text-sm font-medium">Achievements:</h4>
                          <div className="flex flex-wrap gap-1">
                            {edu.achievements.map((achievement, i) => (
                              <Badge key={i} variant="outline" className="max-w-full text-xs">
                                <span className="truncate" title={achievement}>{achievement}</span>
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-1">
                          <h4 className="text-sm font-medium">Relevant Coursework:</h4>
                          <div className="flex flex-wrap gap-1">
                            {edu.coursework.map((course, i) => (
                              <Badge key={i} variant="secondary" className="max-w-full text-xs">
                                <span className="truncate" title={course}>{course}</span>
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Skills Tab */}
          <TabsContent value="skills" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <CardTitle>Technical Skills</CardTitle>
                  <div className="flex flex-wrap gap-2">
                    <SearchInput
                      placeholder="Search skills..."
                      value={searchTerm}
                      onChange={setSearchTerm}
                      className="sm:w-60"
                    />
                    <FilterDropdown
                      label="Category"
                      options={skillCategories}
                      value={selectedSkillCategory}
                      onChange={setSelectedSkillCategory}
                    />
                    <Button className="gap-2" onClick={() => setSkillDialog({ open: true })}>
                      <Plus className="h-4 w-4" />
                      Add Skill
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid min-w-0 gap-4 md:grid-cols-2">
                  {filteredSkills.map((skill) => (
                    <div
                      key={skill.id}
                      id={`focus-skill-${skill.id}`}
                      className={`min-w-0 space-y-2 rounded-lg border p-4 transition-colors ${
                        focused?.type === "skills" && focused.id === skill.id
                          ? "bg-primary/10 ring-2 ring-primary/40"
                          : ""
                      }`}
                    >
                      <div className="flex min-w-0 items-center justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="flex min-w-0 items-center gap-2 font-medium text-foreground"><SkillIconPreview icon={skill.icon} color={skill.color} /><span className="truncate" title={skill.name}>{skill.name}</span></h3>
                          <div className="flex min-w-0 items-center gap-2 text-sm text-muted-foreground">
                            <Badge variant="outline" className="max-w-[55%] text-xs">
                              <span className="truncate" title={skill.category}>{skill.category}</span>
                            </Badge>
                            <span>•</span>
                            <span>{skill.years} years</span>
                            {skill.showOnPortfolio && <Badge variant="secondary" className="text-xs">Porto</Badge>}
                          </div>
                        </div>
                        <RowActions
                          onEdit={() => setSkillDialog({ open: true, skill: skill })}
                          onDelete={() => setDeleteTarget({ type: "skill", id: skill.id, title: skill.name })}
                        />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span>Proficiency</span>
                          <span className="font-medium">{skill.level}%</span>
                        </div>
                        <Progress value={skill.level} indicatorColor={skill.color} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Certifications, Awards & Links</CardTitle>
                  <Button className="gap-2" onClick={() => setAchievementDialog({ open: true })}>
                    <Plus className="h-4 w-4" />
                    Add Achievement
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table className="min-w-[560px] table-fixed">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[45%]">Achievement</TableHead>
                      <TableHead className="w-[25%]">Type</TableHead>
                      <TableHead className="w-[15%]">Date</TableHead>
                      <TableHead className="w-[15%] text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {achievements.map((achievement) => (
                      <TableRow
                        key={achievement.id}
                        id={`focus-achievement-${achievement.id}`}
                        className={
                          focused?.type === "achievement" && focused.id === achievement.id ? "bg-primary/10" : ""
                        }
                      >
                        <TableCell>
                          <div className="min-w-0 space-y-1">
                            <p className="truncate font-medium text-foreground" title={achievement.title}>{achievement.title}</p>
                            <div className="flex min-w-0 items-center gap-2 text-sm text-muted-foreground">
                              <span className="truncate" title={achievement.issuer}>{achievement.issuer}</span>
                              {achievement.url && (
                                <IconLink href={achievement.url} icon={ExternalLink} label="Open link" />
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={achievement.type === "Certification" ? "default" : "secondary"} className="max-w-full">
                            <span className="truncate" title={achievement.type}>{achievement.type}</span>
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{achievement.date}</TableCell>
                        <TableCell className="text-right">
                          <RowActions
                            onEdit={() => setAchievementDialog({ open: true, achievement: achievement })}
                            onDelete={() =>
                              setDeleteTarget({ type: "achievement", id: achievement.id, title: achievement.title })
                            }
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {workDialog.open && <WorkExperienceDialog
          open={workDialog.open}
          onOpenChange={(open) => setWorkDialog({ open })}
          experience={workDialog.experience}
          onSave={handleSaveWorkExperience}
        />}

        {educationDialog.open && <EducationDialog
          open={educationDialog.open}
          onOpenChange={(open) => setEducationDialog({ open })}
          education={educationDialog.education}
          onSave={handleSaveEducation}
        />}

        {skillDialog.open && <SkillDialog
          open={skillDialog.open}
          onOpenChange={(open) => setSkillDialog({ open })}
          skill={skillDialog.skill}
          onSave={handleSaveSkill}
        />}

        {achievementDialog.open && <AchievementDialog
          open={achievementDialog.open}
          onOpenChange={(open) => setAchievementDialog({ open })}
          achievement={achievementDialog.achievement}
          onSave={handleSaveAchievement}
        />}

        <ConfirmDeleteDialog
          open={deleteTarget !== null}
          onOpenChange={(open) => {
            if (!open) setDeleteTarget(null)
          }}
          title={deleteTarget ? deleteMeta[deleteTarget.type].title : ""}
          description={
            <>
              Are you sure you want to delete "{deleteTarget?.title || ""}"? This action cannot be undone.
            </>
          }
          confirmLabel={deleteTarget ? deleteMeta[deleteTarget.type].confirmLabel : ""}
          onConfirm={confirmDelete}
        />
      </div>
    </DashboardLayout>
  )
}
