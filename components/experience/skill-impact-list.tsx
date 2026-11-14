"use client"

import { useCMSStore } from "@/lib/store"

export function SkillImpactList({ name, action }: { name: string; action: "rename" | "merge" | "delete" }) {
  const projects = useCMSStore((state) => state.projects)
  const workExperience = useCMSStore((state) => state.workExperience)
  const resumeSkills = useCMSStore((state) => state.settings?.profile.resumeSkills)

  const affectedProjects = projects.filter((item) => item.technologies.includes(name))
  const affectedWork = workExperience.filter((item) => item.technologies.includes(name))
  const inResume = resumeSkills?.includes(name) ?? false
  const count = affectedProjects.length + affectedWork.length + Number(inResume)

  if (!count) return <p className="text-sm text-muted-foreground">No related content uses this skill.</p>

  return (
    <div className="space-y-2 text-sm">
      <p>{action === "delete" ? "The skill will also be removed from:" : action === "merge" ? "These references will move to the existing skill:" : "The skill name will also change in:"}</p>
      <ul className="max-h-36 list-disc space-y-1 overflow-y-auto pl-5">
        {affectedProjects.map((item) => <li key={`project-${item.id}`}>Project: {item.title}</li>)}
        {affectedWork.map((item) => <li key={`work-${item.id}`}>Experience: {item.position} at {item.company}</li>)}
        {inResume && <li>Résumé skills in Settings</li>}
      </ul>
    </div>
  )
}
