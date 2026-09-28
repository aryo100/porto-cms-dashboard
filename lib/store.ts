import { create } from "zustand"
import { persist } from "zustand/middleware"

// Types
interface Project {
  id: number
  title: string
  description: string
  status: string
  category: string
  tags: string[]
  startDate: string
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
  url: string | null
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
  addBlogPost: (post: Omit<BlogPost, "id" | "createdAt" | "updatedAt">) => void
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

  // Site
  site: { website: string }
  setSiteWebsite: (website: string) => void

  // Profile
  profile: { name: string; email: string }
  setProfile: (profile: Partial<{ name: string; email: string }>) => void

  // Utility functions
  getNextId: (items: { id: number }[]) => number
}

// Initial data
const initialProjects: Project[] = [
  {
    id: 1,
    title: "E-commerce Platform",
    description: "A full-stack e-commerce application with user authentication, product catalog, and payment integration.",
    status: "Completed",
    category: "Web Development",
    tags: ["E-commerce", "Full-stack", "Payments"],
    startDate: "2023-06-01",
    endDate: "2024-02-15",
    client: "Personal Project",
    teamMembers: [],
    technologies: ["Next.js", "React", "Node.js", "PostgreSQL", "Stripe"],
    githubUrl: "https://github.com/your-github/ecommerce-platform",
    liveUrl: "https://ecommerce.yourdomain.com",
    image: "/placeholder.svg?height=200&width=300",
    createdAt: "2023-06-01",
    updatedAt: "2024-02-15",
  },
  {
    id: 2,
    title: "AI Chatbot Assistant",
    description:
      "An intelligent chatbot powered by large language models, capable of natural language understanding and generation.",
    status: "Upcoming",
    category: "API",
    tags: ["AI", "LLM", "Real-time"],
    startDate: "2024-03-01",
    endDate: null,
    client: "Personal Project",
    teamMembers: [],
    technologies: ["Python", "Flask", "OpenAI API", "React", "WebSockets"],
    githubUrl: "https://github.com/your-github/ai-chatbot",
    liveUrl: "https://chatbot.yourdomain.com",
    image: "/placeholder.svg?height=200&width=300",
    createdAt: "2024-03-01",
    updatedAt: "2024-07-10",
  },
  {
    id: 3,
    title: "Task Management App",
    description:
      "A simple and intuitive task management application to help users organize their daily tasks and boost productivity.",
    status: "Completed",
    category: "Web Development",
    tags: ["Productivity", "PWA"],
    startDate: "2022-09-01",
    endDate: "2023-01-20",
    client: "Personal Project",
    teamMembers: [],
    technologies: ["Vue.js", "Firebase", "Tailwind CSS"],
    githubUrl: "https://github.com/your-github/task-app",
    liveUrl: "https://tasks.yourdomain.com",
    image: "/placeholder.svg?height=200&width=300",
    createdAt: "2022-09-01",
    updatedAt: "2023-01-20",
  },
  {
    id: 4,
    title: "Portfolio Website V2",
    description:
      "The second iteration of my personal portfolio website, focusing on modern design and interactive elements.",
    status: "Upcoming",
    category: "Web Development",
    tags: ["Portfolio", "Design"],
    startDate: "2024-05-01",
    endDate: null,
    client: "Personal Project",
    teamMembers: [],
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
    githubUrl: "https://github.com/your-github/portfolio-v2",
    liveUrl: "https://yourdomain.com",
    image: "/placeholder.svg?height=200&width=300",
    createdAt: "2024-05-01",
    updatedAt: "2024-07-15",
  },
]

const initialBlogPosts: BlogPost[] = [
  {
    id: 1,
    title: "Mastering React Hooks: A Deep Dive",
    slug: "mastering-react-hooks-a-deep-dive",
    date: "February 2024",
    description:
      "An in-depth article exploring advanced React Hooks patterns and best practices for building robust applications.",
    content: [
      "React Hooks changed how we build components forever. In this article, we explore advanced patterns such as custom hooks, useReducer for complex state, and performance optimizations with useMemo and useCallback.",
      "We start with the fundamentals and build up to real-world scenarios: fetching data with custom hooks, managing forms, and sharing logic across components without render props or higher-order components.",
      "By the end, you will have a mental model that lets you design your own reusable hooks and debug common pitfalls like stale closures and infinite re-render loops.",
    ],
    createdAt: "2024-02-01",
    updatedAt: "2024-02-05",
  },
  {
    id: 2,
    title: "Demystifying Microservices Architecture",
    slug: "demystifying-microservices-architecture",
    date: "September 2023",
    description:
      "A comprehensive guide to understanding and implementing microservices, including benefits and challenges.",
    content: [
      "Microservices split a monolith into independently deployable services, each owning a slice of the business domain. This guide walks through the core concepts, from bounded contexts to API gateways.",
      "We discuss when microservices actually make sense, the operational complexity they introduce (service discovery, observability, distributed transactions), and pragmatic alternatives like modular monoliths.",
      "A practical example ties everything together: designing, containerizing, and orchestrating a small set of services with Docker and Kubernetes.",
    ],
    createdAt: "2023-09-15",
    updatedAt: "2023-09-20",
  },
  {
    id: 3,
    title: "Scaling Web Applications with PostgreSQL",
    slug: "scaling-web-applications-with-postgresql",
    date: "May 2024",
    description:
      "Practical strategies for scaling a PostgreSQL-backed web app: indexing, caching, connection pooling, and read replicas.",
    content: [
      "Before reaching for a new database, most applications can scale much further with disciplined PostgreSQL usage. This article covers index design, query analysis with EXPLAIN, and caching layers.",
      "We explore connection pooling with PgBouncer, read replicas for analytics workloads, partitioning large tables, and vacuum maintenance that keeps performance predictable.",
      "Each strategy comes with trade-offs and metrics you should track to know when you genuinely need the next step.",
    ],
    createdAt: "2024-05-01",
    updatedAt: "2024-05-10",
  },
  {
    id: 4,
    title: "A Practical Guide to TypeScript Type Safety",
    slug: "a-practical-guide-to-typescript-type-safety",
    date: "March 2024",
    description:
      "How to get the most out of TypeScript: discriminated unions, generics, and type guards for safer code.",
    content: [
      "TypeScript's value shows when the types actually prevent bugs. This guide dives into discriminated unions, literal types, and user-defined type guards.",
      "We look at practical generic patterns for building flexible yet safe APIs, and how to narrow types so runtime validation aligns with compile-time guarantees.",
      "You will learn to avoid the 'any' escape hatch and design types that make invalid states impossible to represent.",
    ],
    createdAt: "2024-03-01",
    updatedAt: "2024-03-08",
  },
  {
    id: 5,
    title: "Building Reusable UI Components with Tailwind CSS",
    slug: "building-reusable-ui-components-with-tailwind-css",
    date: "January 2024",
    description:
      "Tips for creating consistent, accessible, and reusable components on top of Tailwind CSS.",
    content: [
      "Tailwind gives you primitives, not components. To stay consistent at scale, you need a strategy: tokens, variants, and composition.",
      "We explore how to define design tokens, build polymorphic components with class variance, and keep accessibility baked in from the start.",
      "The result is a lightweight component system that teams can extend without fighting the framework.",
    ],
    createdAt: "2024-01-10",
    updatedAt: "2024-01-15",
  },
]

const initialWorkExperience: WorkExperience[] = [
  {
    id: 1,
    company: "Tech Innovators Inc.",
    position: "Senior Software Engineer",
    location: "San Francisco, CA",
    startDate: "2023-01-01",
    endDate: null,
    current: true,
    description:
      "Led development of scalable microservices and mentored junior engineers while collaborating with product teams to define and implement new features.",
    achievements: [
      "Led development of scalable microservices using Node.js and TypeScript.",
      "Mentored junior engineers and conducted code reviews.",
      "Optimized database queries, reducing latency by 30%.",
      "Collaborated with product teams to define and implement new features.",
    ],
    technologies: ["Node.js", "TypeScript", "PostgreSQL", "AWS"],
  },
  {
    id: 2,
    company: "Web Solutions Co.",
    position: "Software Engineer",
    location: "Austin, TX",
    startDate: "2020-07-01",
    endDate: "2022-12-31",
    current: false,
    description:
      "Developed front-end components with React and Next.js, integrated RESTful APIs, and contributed to CI/CD pipeline improvements.",
    achievements: [
      "Developed front-end components with React and Next.js.",
      "Integrated RESTful APIs and managed state with Redux.",
      "Contributed to CI/CD pipeline improvements.",
      "Participated in agile development sprints.",
    ],
    technologies: ["React", "Next.js", "Redux", "TypeScript"],
  },
  {
    id: 3,
    company: "Startup Hub",
    position: "Junior Developer Intern",
    location: "New York, NY",
    startDate: "2019-05-01",
    endDate: "2019-08-31",
    current: false,
    description:
      "Assisted in building a Python/Django backend, wrote unit and integration tests, and supported deployment processes.",
    achievements: [
      "Assisted in building a Python/Django backend for a new web application.",
      "Wrote unit and integration tests.",
      "Learned version control with Git and GitHub.",
      "Supported deployment processes.",
    ],
    technologies: ["Python", "Django", "Git"],
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
  { id: 1, name: "React", category: "Frontend", level: 90, years: 4 },
  { id: 2, name: "Next.js", category: "Frontend", level: 88, years: 3 },
  { id: 3, name: "TypeScript", category: "Programming", level: 85, years: 3 },
  { id: 4, name: "Node.js", category: "Backend", level: 85, years: 4 },
  { id: 5, name: "Express.js", category: "Backend", level: 82, years: 4 },
  { id: 6, name: "Python", category: "Programming", level: 80, years: 4 },
  { id: 7, name: "Django", category: "Backend", level: 75, years: 2 },
  { id: 8, name: "PostgreSQL", category: "Database", level: 78, years: 3 },
  { id: 9, name: "MongoDB", category: "Database", level: 72, years: 2 },
  { id: 10, name: "Docker", category: "DevOps", level: 70, years: 2 },
  { id: 11, name: "AWS", category: "Cloud", level: 75, years: 3 },
  { id: 12, name: "Tailwind CSS", category: "Frontend", level: 88, years: 3 },
  { id: 13, name: "GraphQL", category: "Backend", level: 65, years: 1 },
  { id: 14, name: "Framer Motion", category: "Frontend", level: 60, years: 1 },
]

const initialAchievements: Achievement[] = [
  {
    id: 1,
    title: "Google Cloud Certified Professional Developer",
    issuer: "Google Cloud",
    date: "March 2024",
    url: "https://www.credential.net/your-google-cloud-credential",
    type: "Certification",
  },
  {
    id: 2,
    title: "Microsoft Certified: Azure Developer Associate",
    issuer: "Microsoft",
    date: "November 2023",
    url: "https://learn.microsoft.com/en-us/users/your-profile/credentials/azure-developer",
    type: "Certification",
  },
  {
    id: 3,
    title: "The State of JavaScript 2024",
    issuer: "State of JS",
    date: "December 2024",
    url: "https://stateofjs.com/en-US/2024",
    type: "External",
  },
  {
    id: 4,
    title: "Improving Frontend Performance",
    issuer: "web.dev",
    date: "July 2024",
    url: "https://web.dev/learn/performance",
    type: "External",
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
              createdAt: new Date().toISOString().split("T")[0],
              updatedAt: new Date().toISOString().split("T")[0],
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

      // Site
      site: { website: "https://yourdomain.com" },
      setSiteWebsite: (website) =>
        set((state) => ({
          site: { ...state.site, website },
        })),

      // Profile
      profile: { name: "[Your Name]", email: "john.doe@example.com" },
      setProfile: (profile) =>
        set((state) => ({
          profile: { ...state.profile, ...profile },
        })),

      // Utility functions
      getNextId: (items) => Math.max(...items.map((item) => item.id), 0) + 1,
    }),
    {
      name: "cms-storage",
      version: 1,
      partialize: (state) => ({
        projects: state.projects,
        blogPosts: state.blogPosts,
        workExperience: state.workExperience,
        education: state.education,
        skills: state.skills,
        achievements: state.achievements,
        site: state.site,
        profile: state.profile,
      }),
    },
  ),
)
