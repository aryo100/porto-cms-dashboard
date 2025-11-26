import { create } from "zustand"
import { persist } from "zustand/middleware"

// Types
interface Project {
  id: number
  title: string
  description: string
  status: string
  priority: string
  category: string
  tags: string[]
  startDate: string
  endDate: string | null
  progress: number
  budget: number | null
  client: string
  teamMembers: string[]
  technologies: string[]
  githubUrl: string
  liveUrl: string
  featured: boolean
  createdAt: string
  updatedAt: string
}

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

interface WorkExperience {
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

interface Education {
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

interface Skill {
  id: number
  name: string
  category: string
  level: number
  years: number
}

interface Achievement {
  id: number
  title: string
  issuer: string
  date: string
  credentialId: string | null
  expiryDate: string | null
  type: string
}

// Store interface
interface CMSStore {
  // Projects
  projects: Project[]
  addProject: (project: Omit<Project, "id" | "createdAt" | "updatedAt">) => void
  updateProject: (id: number, project: Partial<Project>) => void
  deleteProject: (id: number) => void
  getProject: (id: number) => Project | undefined

  // Blog Posts
  blogPosts: BlogPost[]
  addBlogPost: (post: Omit<BlogPost, "id" | "author" | "updatedAt" | "views" | "comments" | "likes">) => void
  updateBlogPost: (id: number, post: Partial<BlogPost>) => void
  deleteBlogPost: (id: number) => void
  getBlogPost: (id: number) => BlogPost | undefined

  // Work Experience
  workExperience: WorkExperience[]
  addWorkExperience: (experience: Omit<WorkExperience, "id">) => void
  updateWorkExperience: (id: number, experience: Partial<WorkExperience>) => void
  deleteWorkExperience: (id: number) => void

  // Education
  education: Education[]
  addEducation: (education: Omit<Education, "id">) => void
  updateEducation: (id: number, education: Partial<Education>) => void
  deleteEducation: (id: number) => void

  // Skills
  skills: Skill[]
  addSkill: (skill: Omit<Skill, "id">) => void
  updateSkill: (id: number, skill: Partial<Skill>) => void
  deleteSkill: (id: number) => void

  // Achievements
  achievements: Achievement[]
  addAchievement: (achievement: Omit<Achievement, "id">) => void
  updateAchievement: (id: number, achievement: Partial<Achievement>) => void
  deleteAchievement: (id: number) => void

  // Utility functions
  getNextId: (items: { id: number }[]) => number
}

// Initial data
const initialProjects: Project[] = [
  {
    id: 1,
    title: "E-commerce Platform",
    description: "A full-stack e-commerce solution with React, Node.js, and PostgreSQL",
    status: "In Progress",
    priority: "High",
    category: "Web Development",
    tags: ["React", "Node.js", "PostgreSQL", "Stripe"],
    startDate: "2024-01-15",
    endDate: "2024-06-30",
    progress: 75,
    budget: 50000,
    client: "TechCorp Inc.",
    teamMembers: ["John Doe", "Jane Smith", "Mike Johnson"],
    technologies: ["React", "Node.js", "PostgreSQL", "Docker", "AWS"],
    githubUrl: "https://github.com/johndoe/ecommerce-platform",
    liveUrl: "https://ecommerce-demo.vercel.app",
    featured: true,
    createdAt: "2024-01-15",
    updatedAt: "2024-03-20",
  },
  {
    id: 2,
    title: "Task Management App",
    description: "A collaborative task management application with real-time updates",
    status: "Completed",
    priority: "Medium",
    category: "Web Development",
    tags: ["Vue.js", "Firebase", "Real-time"],
    startDate: "2023-09-01",
    endDate: "2023-12-15",
    progress: 100,
    budget: 25000,
    client: "StartupXYZ",
    teamMembers: ["John Doe", "Sarah Wilson"],
    technologies: ["Vue.js", "Firebase", "Vuetify", "PWA"],
    githubUrl: "https://github.com/johndoe/task-manager",
    liveUrl: "https://taskmanager-app.netlify.app",
    featured: false,
    createdAt: "2023-09-01",
    updatedAt: "2023-12-15",
  },
]

const initialBlogPosts: BlogPost[] = [
  {
    id: 1,
    title: "Building Scalable React Applications",
    slug: "building-scalable-react-applications",
    excerpt:
      "Learn best practices for building large-scale React applications with proper architecture and state management.",
    content: "# Building Scalable React Applications\n\nIn this comprehensive guide, we'll explore...",
    status: "Published",
    category: "Tutorial",
    tags: ["React", "JavaScript", "Architecture"],
    author: "John Doe",
    publishedAt: "2024-01-15",
    updatedAt: "2024-01-16",
    readTime: "8 min read",
    views: 2450,
    comments: 23,
    likes: 156,
    featured: true,
    seoTitle: "Building Scalable React Applications - Complete Guide",
    metaDescription:
      "Comprehensive guide on building scalable React applications with best practices and modern patterns.",
  },
  {
    id: 2,
    title: "The Future of Web Development",
    slug: "future-of-web-development",
    excerpt: "Exploring upcoming trends and technologies that will shape the future of web development.",
    content: "# The Future of Web Development\n\nWeb development is constantly evolving...",
    status: "Draft",
    category: "Opinion",
    tags: ["Web Development", "Trends", "Future"],
    author: "John Doe",
    publishedAt: null,
    updatedAt: "2024-02-20",
    readTime: "6 min read",
    views: 0,
    comments: 0,
    likes: 0,
    featured: false,
    seoTitle: "The Future of Web Development - Trends and Predictions",
    metaDescription: "Discover the latest trends and technologies shaping the future of web development.",
  },
]

const initialWorkExperience: WorkExperience[] = [
  {
    id: 1,
    company: "TechCorp Inc.",
    position: "Senior Software Engineer",
    location: "San Francisco, CA",
    startDate: "2022-01-15",
    endDate: null,
    current: true,
    description:
      "Lead development of scalable web applications using React and Node.js. Mentor junior developers and architect system solutions.",
    achievements: ["Increased system performance by 40%", "Led team of 5 developers", "Implemented CI/CD pipeline"],
    technologies: ["React", "Node.js", "TypeScript", "AWS", "Docker"],
  },
  {
    id: 2,
    company: "StartupXYZ",
    position: "Full Stack Developer",
    location: "Remote",
    startDate: "2020-06-01",
    endDate: "2021-12-31",
    current: false,
    description:
      "Built and maintained full-stack applications from concept to deployment. Worked directly with clients to gather requirements.",
    achievements: [
      "Delivered 15+ client projects",
      "Reduced deployment time by 60%",
      "Built reusable component library",
    ],
    technologies: ["Vue.js", "Python", "PostgreSQL", "Heroku"],
  },
]

const initialEducation: Education[] = [
  {
    id: 1,
    institution: "University of Technology",
    degree: "Bachelor of Science in Computer Science",
    location: "Boston, MA",
    startDate: "2015-09-01",
    endDate: "2019-05-15",
    gpa: "3.8/4.0",
    achievements: ["Magna Cum Laude", "Dean's List (6 semesters)", "Computer Science Society President"],
    coursework: ["Data Structures", "Algorithms", "Software Engineering", "Database Systems", "Machine Learning"],
  },
]

const initialSkills: Skill[] = [
  { id: 1, name: "JavaScript", category: "Programming", level: 95, years: 5 },
  { id: 2, name: "React", category: "Frontend", level: 90, years: 4 },
  { id: 3, name: "Node.js", category: "Backend", level: 85, years: 3 },
  { id: 4, name: "TypeScript", category: "Programming", level: 88, years: 3 },
  { id: 5, name: "Python", category: "Programming", level: 75, years: 2 },
  { id: 6, name: "AWS", category: "Cloud", level: 70, years: 2 },
]

const initialAchievements: Achievement[] = [
  {
    id: 1,
    title: "AWS Certified Solutions Architect",
    issuer: "Amazon Web Services",
    date: "2023-08-15",
    credentialId: "AWS-CSA-2023-001",
    expiryDate: "2026-08-15",
    type: "Certification",
  },
  {
    id: 2,
    title: "Best Innovation Award",
    issuer: "TechCorp Inc.",
    date: "2023-12-01",
    credentialId: null,
    expiryDate: null,
    type: "Award",
  },
]

// Create the store
export const useCMSStore = create<CMSStore>()(
  persist(
    (set, get) => ({
      // Projects
      projects: initialProjects,
      addProject: (project) =>
        set((state) => ({
          projects: [
            ...state.projects,
            {
              ...project,
              id: state.getNextId(state.projects),
              createdAt: new Date().toISOString().split("T")[0],
              updatedAt: new Date().toISOString().split("T")[0],
            },
          ],
        })),
      updateProject: (id, project) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id ? { ...p, ...project, updatedAt: new Date().toISOString().split("T")[0] } : p,
          ),
        })),
      deleteProject: (id) =>
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
        })),
      getProject: (id) => get().projects.find((p) => p.id === id),

      // Blog Posts
      blogPosts: initialBlogPosts,
      addBlogPost: (post) =>
        set((state) => ({
          blogPosts: [
            ...state.blogPosts,
            {
              ...post,
              id: state.getNextId(state.blogPosts),
              author: "John Doe",
              updatedAt: new Date().toISOString().split("T")[0],
              views: 0,
              comments: 0,
              likes: 0,
            },
          ],
        })),
      updateBlogPost: (id, post) =>
        set((state) => ({
          blogPosts: state.blogPosts.map((p) =>
            p.id === id ? { ...p, ...post, updatedAt: new Date().toISOString().split("T")[0] } : p,
          ),
        })),
      deleteBlogPost: (id) =>
        set((state) => ({
          blogPosts: state.blogPosts.filter((p) => p.id !== id),
        })),
      getBlogPost: (id) => get().blogPosts.find((p) => p.id === id),

      // Work Experience
      workExperience: initialWorkExperience,
      addWorkExperience: (experience) =>
        set((state) => ({
          workExperience: [...state.workExperience, { ...experience, id: state.getNextId(state.workExperience) }],
        })),
      updateWorkExperience: (id, experience) =>
        set((state) => ({
          workExperience: state.workExperience.map((e) => (e.id === id ? { ...e, ...experience } : e)),
        })),
      deleteWorkExperience: (id) =>
        set((state) => ({
          workExperience: state.workExperience.filter((e) => e.id !== id),
        })),

      // Education
      education: initialEducation,
      addEducation: (education) =>
        set((state) => ({
          education: [...state.education, { ...education, id: state.getNextId(state.education) }],
        })),
      updateEducation: (id, education) =>
        set((state) => ({
          education: state.education.map((e) => (e.id === id ? { ...e, ...education } : e)),
        })),
      deleteEducation: (id) =>
        set((state) => ({
          education: state.education.filter((e) => e.id !== id),
        })),

      // Skills
      skills: initialSkills,
      addSkill: (skill) =>
        set((state) => ({
          skills: [...state.skills, { ...skill, id: state.getNextId(state.skills) }],
        })),
      updateSkill: (id, skill) =>
        set((state) => ({
          skills: state.skills.map((s) => (s.id === id ? { ...s, ...skill } : s)),
        })),
      deleteSkill: (id) =>
        set((state) => ({
          skills: state.skills.filter((s) => s.id !== id),
        })),

      // Achievements
      achievements: initialAchievements,
      addAchievement: (achievement) =>
        set((state) => ({
          achievements: [...state.achievements, { ...achievement, id: state.getNextId(state.achievements) }],
        })),
      updateAchievement: (id, achievement) =>
        set((state) => ({
          achievements: state.achievements.map((a) => (a.id === id ? { ...a, ...achievement } : a)),
        })),
      deleteAchievement: (id) =>
        set((state) => ({
          achievements: state.achievements.filter((a) => a.id !== id),
        })),

      // Utility functions
      getNextId: (items) => Math.max(...items.map((item) => item.id), 0) + 1,
    }),
    {
      name: "cms-storage",
      partialize: (state) => ({
        projects: state.projects,
        blogPosts: state.blogPosts,
        workExperience: state.workExperience,
        education: state.education,
        skills: state.skills,
        achievements: state.achievements,
      }),
    },
  ),
)
