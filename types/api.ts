// Backend API contract types — source of truth for frontend integration.
// See docs/api-contract.md for the full contract.

// ---------------------------------------------------------------------------
// Enums (canonical values)
// ---------------------------------------------------------------------------

export type ProjectStatus = "Completed" | "Upcoming" | "Legacy"
export type ProjectCategory = "Web Development" | "Mobile App" | "Desktop App" | "API" | "Open Source" | "Other"

export type BlogPostCategory = "Tutorial" | "Opinion" | "Career" | "Tech Review"

export type SkillCategory = "Programming" | "Frontend" | "Backend" | "Cloud" | "DevOps" | "Database" | "Mobile" | "Design"

export type AchievementType = "Certification" | "Award" | "External"

export type UserRole = "admin" | "editor" | "viewer"

// ---------------------------------------------------------------------------
// Common
// ---------------------------------------------------------------------------

export interface ApiError {
  error: string
  details?: Record<string, unknown>
  status?: number
}

export interface ListResponse<T> {
  data: T[]
  total: number
  limit: number
  offset: number
}

export interface DeleteResponse {
  success: true
  id: number
}

export interface ListQuery {
  q?: string
  limit?: number
  offset?: number
  [field: string]: string | number | boolean | undefined
}

// ---------------------------------------------------------------------------
// 1. Projects
// ---------------------------------------------------------------------------

export interface Project {
  id: number
  title: string
  description: string
  status: ProjectStatus
  category: ProjectCategory
  tags: string[]
  startDate: string | null
  endDate: string | null
  client: string
  teamMembers: string[]
  technologies: string[]
  githubUrl: string
  liveUrl: string
  image: string
  createdAt: string
  updatedAt: string
}

export type ProjectInput = Omit<Project, "id" | "createdAt" | "updatedAt">
export type ProjectPatch = Partial<ProjectInput>

// ---------------------------------------------------------------------------
// 2. Blog Posts
// ---------------------------------------------------------------------------

export interface BlogPost {
  id: number
  title: string
  slug: string
  date: string
  description: string
  content: string[]
  createdAt: string
  updatedAt: string
}

export type BlogPostInput = Omit<BlogPost, "id" | "createdAt" | "updatedAt">
export type BlogPostPatch = Partial<BlogPostInput>

// ---------------------------------------------------------------------------
// 3. Work Experience
// ---------------------------------------------------------------------------

export interface WorkExperience {
  id: number
  company: string
  position: string
  location: string
  startDate: string
  endDate: string | null
  current: boolean
  description: string
  achievements: string[]
  technologies: string[]
}

export type WorkExperienceInput = Omit<WorkExperience, "id">
export type WorkExperiencePatch = Partial<WorkExperienceInput>

// ---------------------------------------------------------------------------
// 4. Education
// ---------------------------------------------------------------------------

export interface Education {
  id: number
  institution: string
  degree: string
  location: string
  startDate: string
  endDate: string
  gpa: string | null
  achievements: string[]
  coursework: string[]
}

export type EducationInput = Omit<Education, "id">
export type EducationPatch = Partial<EducationInput>

// ---------------------------------------------------------------------------
// 5. Skills
// ---------------------------------------------------------------------------

export interface Skill {
  id: number
  name: string
  category: SkillCategory
  level: number
  years: number
  color: string
  icon: string
  showOnPortfolio: boolean
}

export type SkillInput = Omit<Skill, "id">
export type SkillPatch = Partial<SkillInput>

// ---------------------------------------------------------------------------
// 6. Achievements
// ---------------------------------------------------------------------------

export interface Achievement {
  id: number
  title: string
  issuer: string
  date: string
  url: string | null
  type: AchievementType
}

export type AchievementInput = Omit<Achievement, "id">
export type AchievementPatch = Partial<AchievementInput>

// ---------------------------------------------------------------------------
// 7. Settings
// ---------------------------------------------------------------------------

export interface Settings {
  profile: {
    name: string
    email: string
    bio: string
    location: string
    website: string
    avatar: string
    cv?: { url: string; name: string; size: number } | null
  }
  siteConfig: {
    siteTitle: string
    tagline: string
    description: string
    primaryColor: string
    theme: string
    language: string
  }
  seo: {
    metaTitle: string
    metaDescription: string
    keywords: string
    googleAnalytics: string
    googleSearchConsole: string
    sitemap: boolean
    robots: boolean
  }
  socialLinks: {
    github: string
    linkedin: string
    twitter: string
    email: string
  }
  backup: {
    autoBackup: boolean
    backupFrequency: string
    lastBackup: string
  }
}

export type SettingsPatch = Partial<Settings>

// ---------------------------------------------------------------------------
// 8. Auth
// ---------------------------------------------------------------------------

export interface User {
  id: number
  name: string
  email: string
  role: UserRole
  createdAt: string
  updatedAt: string
}

export interface AuthCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  token: string
  user: User
}

// ---------------------------------------------------------------------------
// 9. Uploads
// ---------------------------------------------------------------------------

export interface UploadResult {
  url: string
  name: string
  size: number
  type: string
  ext: string
}

// ---------------------------------------------------------------------------
// 10. Page Content (public website pages)
// ---------------------------------------------------------------------------

export type PageKey = "home" | "blog" | "projects" | "experience" | "site"

export interface SiteBrand {
  name: string
  icon: string
  logoText: string
}

export interface SiteNavLink {
  href: string
  label: string
}

export interface SiteSocialLink {
  icon: string
  href: string
  label: string
}

export interface SiteFooter {
  copyrightName: string
  rightsText: string
  socials: SiteSocialLink[]
}

export interface HeroContent {
  greeting: string
  name: string
  tagline: string
  bio: string
  avatar: { src: string; alt: string }
}

export interface CtaButton {
  label: string
  href: string
  variant: "primary" | "outline"
  icon: string
}

export interface TechStackItem {
  name: string
  icon: string
  colorClass: string
}

export interface SocialCard {
  title: string
  description: string
  href: string
  ctaLabel: string
  theme: string
  icon: string
  download: boolean
}

export interface PageIntro {
  headline: string
  description?: string
  subheading?: string
}

export interface BlogEntry {
  type: "award" | "blog"
  title: string
  date: string
  description: string
  link: string
}

interface PageContentBase {
  page: PageKey
  updatedAt?: string
}

export interface HomePageContent extends PageContentBase {
  page: "home"
  hero: HeroContent
  ctaButtons: CtaButton[]
  techStack: TechStackItem[]
  socialCards: SocialCard[]
}

export interface BlogPageContent extends PageContentBase {
  page: "blog"
  intro: PageIntro
  entries: BlogEntry[]
}

export interface ProjectsPageContent extends PageContentBase {
  page: "projects"
  intro: PageIntro
}

export interface ExperiencePageContent extends PageContentBase {
  page: "experience"
  intro: PageIntro
}

export interface SitePageContent extends PageContentBase {
  page: "site"
  brand: SiteBrand
  nav: SiteNavLink[]
  footer: SiteFooter
}

export type PageContent =
  | HomePageContent
  | BlogPageContent
  | ProjectsPageContent
  | ExperiencePageContent
  | SitePageContent

// ---------------------------------------------------------------------------
// 11. Stats
// ---------------------------------------------------------------------------

export interface Stats {
  totalProjects: number
  activeProjects: number
  completedProjects: number
  totalBlogPosts: number
  publishedPosts: number
  totalViews: number
  totalComments: number
  totalSkills: number
  certifications: number
}
