import { create } from "zustand"
import { apiListAll, apiRequest } from "@/lib/api-client"
import type { Achievement, BlogPost, Education, Project, Settings, SettingsPatch, Skill, WorkExperience } from "@/types/api"

type Content = {
  projects: Project[]
  blogPosts: BlogPost[]
  workExperience: WorkExperience[]
  education: Education[]
  skills: Skill[]
  achievements: Achievement[]
}
export type ResourceKey = keyof Content
type CMSSettings = Pick<Settings, "profile" | "siteConfig" | "seo" | "socialLinks">

interface CMSStore extends Content {
  settings: CMSSettings | null
  site: { website: string }
  profile: { name: string; email: string }
  loading: boolean
  loaded: boolean
  error: string | null
  loadAll: () => Promise<void>
  reset: () => void
  addProject: (value: Partial<Project>) => Promise<void>
  updateProject: (id: number, value: Partial<Project>) => Promise<void>
  deleteProject: (id: number) => Promise<void>
  getProject: (id: number) => Project | undefined
  addBlogPost: (value: Partial<BlogPost>) => Promise<void>
  updateBlogPost: (id: number, value: Partial<BlogPost>) => Promise<void>
  deleteBlogPost: (id: number) => Promise<void>
  getBlogPost: (id: number) => BlogPost | undefined
  addWorkExperience: (value: Partial<WorkExperience>) => Promise<void>
  updateWorkExperience: (id: number, value: Partial<WorkExperience>) => Promise<void>
  deleteWorkExperience: (id: number) => Promise<void>
  addEducation: (value: Partial<Education>) => Promise<void>
  updateEducation: (id: number, value: Partial<Education>) => Promise<void>
  deleteEducation: (id: number) => Promise<void>
  addSkill: (value: Partial<Skill>) => Promise<void>
  updateSkill: (id: number, value: Partial<Skill>) => Promise<void>
  deleteSkill: (id: number) => Promise<void>
  addAchievement: (value: Partial<Achievement>) => Promise<void>
  updateAchievement: (id: number, value: Partial<Achievement>) => Promise<void>
  deleteAchievement: (id: number) => Promise<void>
  reorderResource: (key: ResourceKey, draggedId: number, targetId: number) => Promise<void>
  updateSettings: (value: SettingsPatch) => Promise<void>
}

const paths: Record<ResourceKey, string> = {
  projects: "/projects",
  blogPosts: "/blog-posts",
  workExperience: "/work-experience",
  education: "/education",
  skills: "/skills",
  achievements: "/achievements",
}

const fields: Record<ResourceKey, readonly string[]> = {
  projects: ["title", "description", "status", "category", "tags", "startDate", "endDate", "client", "teamMembers", "technologies", "githubUrl", "liveUrl", "image", "mobileImage"],
  blogPosts: ["title", "slug", "date", "description", "content"],
  workExperience: ["company", "position", "location", "startDate", "endDate", "current", "description", "achievements", "technologies"],
  education: ["institution", "degree", "location", "startDate", "endDate", "gpa", "achievements", "coursework"],
  skills: ["name", "category", "level", "years", "color", "icon", "showOnPortfolio"],
  achievements: ["title", "description", "issuer", "date", "url", "image", "logo", "type"],
}

function inputFor(key: ResourceKey, value: object): Record<string, unknown> {
  const source = value as Record<string, unknown>
  return Object.fromEntries(fields[key].filter((field) => source[field] !== undefined).map((field) => {
    const item = source[field]
    return [field, (field === "startDate" || field === "endDate") && item === "" ? null : item]
  }))
}

function normalizeProject(row: Project): Project {
  return { ...row, description: row.description ?? "", status: row.status ?? "", category: row.category ?? "", tags: row.tags ?? [], client: row.client ?? "", teamMembers: row.teamMembers ?? [], technologies: row.technologies ?? [], githubUrl: row.githubUrl ?? "", liveUrl: row.liveUrl ?? "", image: row.image ?? "", mobileImage: row.mobileImage ?? "", startDate: row.startDate?.slice(0, 10) ?? null, endDate: row.endDate?.slice(0, 10) ?? null }
}
function normalizeWork(row: WorkExperience): WorkExperience {
  return { ...row, location: row.location ?? "", description: row.description ?? "", achievements: row.achievements ?? [], technologies: row.technologies ?? [], startDate: row.startDate?.slice(0, 10) ?? "", endDate: row.endDate?.slice(0, 10) ?? null }
}
function normalizeEducation(row: Education): Education {
  return { ...row, location: row.location ?? "", startDate: row.startDate?.slice(0, 10) ?? "", endDate: row.endDate?.slice(0, 10) ?? "", gpa: row.gpa ?? null, achievements: row.achievements ?? [], coursework: row.coursework ?? [] }
}
function normalizeSkill(row: Skill): Skill {
  return { ...row, category: row.category ?? "", level: row.level ?? 0, years: row.years ?? 0, color: row.color ?? "#64748b", icon: row.icon ?? "code", showOnPortfolio: row.showOnPortfolio ?? false }
}

function replaceSkillName(names: string[], from: string, to: string): string[] {
  return [...new Set(names.map((name) => name === from ? to : name))]
}

function normalize<K extends ResourceKey>(key: K, row: Content[K][number]): Content[K][number] {
  if (key === "projects") return normalizeProject(row as Project) as Content[K][number]
  if (key === "workExperience") return normalizeWork(row as WorkExperience) as Content[K][number]
  if (key === "education") return normalizeEducation(row as Education) as Content[K][number]
  if (key === "skills") return normalizeSkill(row as Skill) as Content[K][number]
  return row
}

const emptyContent: Content = { projects: [], blogPosts: [], workExperience: [], education: [], skills: [], achievements: [] }

async function createItem<K extends ResourceKey>(key: K, value: object): Promise<void> {
  const saved = await apiRequest<Content[K][number]>(paths[key], { method: "POST", body: JSON.stringify(inputFor(key, value)) })
  useCMSStore.setState((state) => ({ [key]: [normalize(key, saved), ...state[key]] }))
}

async function updateItem<K extends ResourceKey>(key: K, id: number, value: object): Promise<void> {
  const saved = await apiRequest<Content[K][number]>(`${paths[key]}/${id}`, { method: "PATCH", body: JSON.stringify(inputFor(key, value)) })
  useCMSStore.setState((state) => ({ [key]: state[key].map((item) => item.id === id ? normalize(key, saved) : item) }))
}

async function deleteItem<K extends ResourceKey>(key: K, id: number): Promise<void> {
  await apiRequest(`${paths[key]}/${id}`, { method: "DELETE" })
  useCMSStore.setState((state) => ({ [key]: state[key].filter((item) => item.id !== id) }))
}

export const useCMSStore = create<CMSStore>()((set, get) => ({
  ...emptyContent,
  settings: null,
  site: { website: "" },
  profile: { name: "", email: "" },
  loading: false,
  loaded: false,
  error: null,
  loadAll: async () => {
    if (get().loading || get().loaded) return
    if (typeof window !== "undefined") window.localStorage.removeItem("cms-storage")
    set({ loading: true, error: null })
    try {
      const [projects, blogPosts, workExperience, education, skills, achievements, settings] = await Promise.all([
        apiListAll<Project>(paths.projects, 100),
        apiListAll<BlogPost>(paths.blogPosts, 500),
        apiListAll<WorkExperience>(paths.workExperience, 500),
        apiListAll<Education>(paths.education, 500),
        apiListAll<Skill>(paths.skills, 500),
        apiListAll<Achievement>(paths.achievements, 500),
        apiRequest<CMSSettings>("/settings"),
      ])
      set({
        projects: projects.map(normalizeProject), blogPosts,
        workExperience: workExperience.map(normalizeWork), education: education.map(normalizeEducation),
        skills: skills.map(normalizeSkill), achievements, settings,
        site: { website: settings.profile?.website ?? "" },
        profile: { name: settings.profile?.name ?? "", email: settings.profile?.email ?? "" },
        loaded: true, loading: false,
      })
    } catch (error) {
      set({ loading: false, error: error instanceof Error ? error.message : "Failed to load CMS data" })
    }
  },
  reset: () => set({ ...emptyContent, settings: null, site: { website: "" }, profile: { name: "", email: "" }, loading: false, loaded: false, error: null }),
  addProject: (value) => createItem("projects", value),
  updateProject: (id, value) => updateItem("projects", id, value),
  deleteProject: (id) => deleteItem("projects", id),
  getProject: (id) => get().projects.find((item) => item.id === id),
  addBlogPost: (value) => createItem("blogPosts", value),
  updateBlogPost: (id, value) => updateItem("blogPosts", id, value),
  deleteBlogPost: (id) => deleteItem("blogPosts", id),
  getBlogPost: (id) => get().blogPosts.find((item) => item.id === id),
  addWorkExperience: (value) => createItem("workExperience", value),
  updateWorkExperience: (id, value) => updateItem("workExperience", id, value),
  deleteWorkExperience: (id) => deleteItem("workExperience", id),
  addEducation: (value) => createItem("education", value),
  updateEducation: (id, value) => updateItem("education", id, value),
  deleteEducation: (id) => deleteItem("education", id),
  addSkill: (value) => createItem("skills", value),
  updateSkill: async (id, value) => {
    const oldName = get().skills.find((skill) => skill.id === id)?.name
    const saved = normalizeSkill(await apiRequest<Skill>(`${paths.skills}/${id}`, { method: "PATCH", body: JSON.stringify(inputFor("skills", value)) }))
    const replacement = oldName && saved.name !== oldName ? { from: oldName, to: saved.name } : null
    set((state) => ({
      skills: saved.id === id
        ? state.skills.map((skill) => skill.id === id ? saved : skill)
        : state.skills.some((skill) => skill.id === saved.id)
          ? state.skills.filter((skill) => skill.id !== id).map((skill) => skill.id === saved.id ? saved : skill)
          : [saved, ...state.skills.filter((skill) => skill.id !== id)],
      ...(replacement ? {
        projects: state.projects.map((project) => ({ ...project, technologies: replaceSkillName(project.technologies, replacement.from, replacement.to) })),
        workExperience: state.workExperience.map((work) => ({ ...work, technologies: replaceSkillName(work.technologies, replacement.from, replacement.to) })),
        settings: state.settings ? { ...state.settings, profile: { ...state.settings.profile, resumeSkills: state.settings.profile.resumeSkills && replaceSkillName(state.settings.profile.resumeSkills, replacement.from, replacement.to) } } : null,
      } : {}),
    }))
  },
  deleteSkill: async (id) => {
    const name = get().skills.find((skill) => skill.id === id)?.name
    await apiRequest(`${paths.skills}/${id}`, { method: "DELETE" })
    set((state) => ({
      skills: state.skills.filter((skill) => skill.id !== id),
      ...(name ? {
        projects: state.projects.map((project) => ({ ...project, technologies: project.technologies.filter((item) => item !== name) })),
        workExperience: state.workExperience.map((work) => ({ ...work, technologies: work.technologies.filter((item) => item !== name) })),
        settings: state.settings ? { ...state.settings, profile: { ...state.settings.profile, resumeSkills: state.settings.profile.resumeSkills?.filter((item) => item !== name) } } : null,
      } : {}),
    }))
  },
  addAchievement: (value) => createItem("achievements", value),
  updateAchievement: (id, value) => updateItem("achievements", id, value),
  deleteAchievement: (id) => deleteItem("achievements", id),
  reorderResource: async (key, draggedId, targetId) => {
    const before = get()[key]
    const from = before.findIndex((item) => item.id === draggedId)
    const to = before.findIndex((item) => item.id === targetId)
    if (from < 0 || to < 0 || from === to) return
    const next = [...before]
    next.splice(to, 0, ...next.splice(from, 1))
    set({ [key]: next })
    try {
      await apiRequest(`${paths[key]}/order`, { method: "PUT", body: JSON.stringify({ ids: next.map((item) => item.id) }) })
    } catch (error) {
      set({ [key]: before })
      throw error
    }
  },
  updateSettings: async (value) => {
    const settings = await apiRequest<CMSSettings>("/settings", { method: "PUT", body: JSON.stringify(value) })
    set({ settings, site: { website: settings.profile?.website ?? "" }, profile: { name: settings.profile?.name ?? "", email: settings.profile?.email ?? "" } })
  },
}))
