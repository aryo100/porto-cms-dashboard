"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { WorkExperienceDialog } from "@/components/experience/work-experience-dialog"
import { EducationDialog } from "@/components/experience/education-dialog"
import { SkillDialog } from "@/components/experience/skill-dialog"
import { AchievementDialog } from "@/components/experience/achievement-dialog"
import { useCMSStore } from "@/lib/store"
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Briefcase,
  GraduationCap,
  Award,
  Code,
  Calendar,
  MapPin,
  Building,
  Star,
} from "lucide-react"

const skillCategories = ["All", "Programming", "Frontend", "Backend", "Cloud", "DevOps", "Database"]

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

  const filteredSkills = skills.filter((skill) => {
    const matchesSearch = skill.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedSkillCategory === "All" || skill.category === selectedSkillCategory
    return matchesSearch && matchesCategory
  })

  const totalYearsExperience = new Date().getFullYear() - 2019
  const currentPosition = workExperience.find((exp) => exp.current)

  const handleSaveWorkExperience = (experienceData: any) => {
    if (workDialog.experience) {
      updateWorkExperience(workDialog.experience.id, experienceData)
    } else {
      addWorkExperience(experienceData)
    }
  }

  const handleDeleteWorkExperience = (id: number) => {
    deleteWorkExperience(id)
  }

  const handleSaveEducation = (educationData: any) => {
    if (educationDialog.education) {
      updateEducation(educationDialog.education.id, educationData)
    } else {
      addEducation(educationData)
    }
  }

  const handleDeleteEducation = (id: number) => {
    deleteEducation(id)
  }

  const handleSaveSkill = (skillData: any) => {
    if (skillDialog.skill) {
      updateSkill(skillDialog.skill.id, skillData)
    } else {
      addSkill(skillData)
    }
  }

  const handleDeleteSkill = (id: number) => {
    deleteSkill(id)
  }

  const handleSaveAchievement = (achievementData: any) => {
    if (achievementDialog.achievement) {
      updateAchievement(achievementDialog.achievement.id, achievementData)
    } else {
      addAchievement(achievementData)
    }
  }

  const handleDeleteAchievement = (id: number) => {
    deleteAchievement(id)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Experience</h1>
            <p className="text-muted-foreground">Manage your professional journey, skills, and achievements</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2 bg-transparent">
              <Award className="h-4 w-4" />
              Export Resume
            </Button>
            <Button className="gap-2" onClick={() => setWorkDialog({ open: true })}>
              <Plus className="h-4 w-4" />
              Add Experience
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Years Experience</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalYearsExperience}+</div>
              <p className="text-xs text-muted-foreground">Professional experience</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Companies</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{workExperience.length}</div>
              <p className="text-xs text-muted-foreground">Organizations worked</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Skills</CardTitle>
              <Code className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{skills.length}</div>
              <p className="text-xs text-muted-foreground">Technical skills</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Certifications</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{achievements.filter((a) => a.type === "Certification").length}</div>
              <p className="text-xs text-muted-foreground">Active certifications</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for different sections */}
        <Tabs defaultValue="work" className="space-y-6">
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
                    Add Position
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {workExperience.map((exp, index) => (
                    <div key={exp.id} className="relative">
                      {/* Timeline line */}
                      {index < workExperience.length - 1 && (
                        <div className="absolute left-6 top-12 h-full w-px bg-border" />
                      )}

                      <div className="flex gap-4">
                        {/* Timeline dot */}
                        <div
                          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 ${
                            exp.current ? "border-primary bg-primary" : "border-border bg-background"
                          }`}
                        >
                          <Briefcase
                            className={`h-5 w-5 ${exp.current ? "text-primary-foreground" : "text-muted-foreground"}`}
                          />
                        </div>

                        {/* Content */}
                        <div className="flex-1 space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-foreground">{exp.position}</h3>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Building className="h-4 w-4" />
                                <span>{exp.company}</span>
                                <span>•</span>
                                <MapPin className="h-4 w-4" />
                                <span>{exp.location}</span>
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
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  className="gap-2"
                                  onClick={() => setWorkDialog({ open: true, experience: exp })}
                                >
                                  <Edit className="h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="gap-2 text-destructive"
                                  onClick={() => handleDeleteWorkExperience(exp.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>

                          <p className="text-sm text-muted-foreground">{exp.description}</p>

                          {/* Achievements */}
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium">Key Achievements:</h4>
                            <ul className="space-y-1">
                              {exp.achievements.map((achievement, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                                  <Star className="h-3 w-3 mt-0.5 text-primary shrink-0" />
                                  {achievement}
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Technologies */}
                          <div className="flex flex-wrap gap-1">
                            {exp.technologies.map((tech) => (
                              <Badge key={tech} variant="outline" className="text-xs">
                                {tech}
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
                    <div key={edu.id} className="flex gap-4 p-4 border rounded-lg">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <GraduationCap className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-foreground">{edu.degree}</h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Building className="h-4 w-4" />
                              <span>{edu.institution}</span>
                              <span>•</span>
                              <MapPin className="h-4 w-4" />
                              <span>{edu.location}</span>
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
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                className="gap-2"
                                onClick={() => setEducationDialog({ open: true, education: edu })}
                              >
                                <Edit className="h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="gap-2 text-destructive"
                                onClick={() => handleDeleteEducation(edu.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        {/* Achievements */}
                        <div className="space-y-1">
                          <h4 className="text-sm font-medium">Achievements:</h4>
                          <div className="flex flex-wrap gap-1">
                            {edu.achievements.map((achievement, i) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {achievement}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Coursework */}
                        <div className="space-y-1">
                          <h4 className="text-sm font-medium">Relevant Coursework:</h4>
                          <div className="flex flex-wrap gap-1">
                            {edu.coursework.map((course, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {course}
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
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Search skills..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-full sm:w-60"
                      />
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="gap-2 bg-transparent">
                          Category: {selectedSkillCategory}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {skillCategories.map((category) => (
                          <DropdownMenuItem key={category} onClick={() => setSelectedSkillCategory(category)}>
                            {category}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Button className="gap-2" onClick={() => setSkillDialog({ open: true })}>
                      <Plus className="h-4 w-4" />
                      Add Skill
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {filteredSkills.map((skill) => (
                    <div key={skill.id} className="space-y-2 p-4 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-foreground">{skill.name}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Badge variant="outline" className="text-xs">
                              {skill.category}
                            </Badge>
                            <span>•</span>
                            <span>{skill.years} years</span>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              className="gap-2"
                              onClick={() => setSkillDialog({ open: true, skill: skill })}
                            >
                              <Edit className="h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="gap-2 text-destructive"
                              onClick={() => handleDeleteSkill(skill.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span>Proficiency</span>
                          <span className="font-medium">{skill.level}%</span>
                        </div>
                        <Progress value={skill.level} className="h-2" />
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
                  <CardTitle>Certifications & Awards</CardTitle>
                  <Button className="gap-2" onClick={() => setAchievementDialog({ open: true })}>
                    <Plus className="h-4 w-4" />
                    Add Achievement
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Achievement</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {achievements.map((achievement) => (
                      <TableRow key={achievement.id}>
                        <TableCell>
                          <div className="space-y-1">
                            <p className="font-medium text-foreground">{achievement.title}</p>
                            <p className="text-sm text-muted-foreground">{achievement.issuer}</p>
                            {achievement.credentialId && (
                              <p className="text-xs text-muted-foreground">ID: {achievement.credentialId}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={achievement.type === "Certification" ? "default" : "secondary"}>
                            {achievement.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(achievement.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {achievement.expiryDate ? (
                            <div className="space-y-1">
                              <Badge
                                variant={new Date(achievement.expiryDate) > new Date() ? "default" : "destructive"}
                              >
                                {new Date(achievement.expiryDate) > new Date() ? "Active" : "Expired"}
                              </Badge>
                              <p className="text-xs text-muted-foreground">
                                Expires: {new Date(achievement.expiryDate).toLocaleDateString()}
                              </p>
                            </div>
                          ) : (
                            <Badge variant="secondary">Permanent</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                className="gap-2"
                                onClick={() => setAchievementDialog({ open: true, achievement: achievement })}
                              >
                                <Edit className="h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="gap-2 text-destructive"
                                onClick={() => handleDeleteAchievement(achievement.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Dialog Components */}
        <WorkExperienceDialog
          open={workDialog.open}
          onOpenChange={(open) => setWorkDialog({ open })}
          experience={workDialog.experience}
          onSave={handleSaveWorkExperience}
        />

        <EducationDialog
          open={educationDialog.open}
          onOpenChange={(open) => setEducationDialog({ open })}
          education={educationDialog.education}
          onSave={handleSaveEducation}
        />

        <SkillDialog
          open={skillDialog.open}
          onOpenChange={(open) => setSkillDialog({ open })}
          skill={skillDialog.skill}
          onSave={handleSaveSkill}
        />

        <AchievementDialog
          open={achievementDialog.open}
          onOpenChange={(open) => setAchievementDialog({ open })}
          achievement={achievementDialog.achievement}
          onSave={handleSaveAchievement}
        />
      </div>
    </DashboardLayout>
  )
}
