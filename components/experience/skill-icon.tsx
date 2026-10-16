"use client"

import { lazy, Suspense, type ComponentProps, type LazyExoticComponent } from "react"
import { Atom, type LucideIcon } from "lucide-react"
import dynamicIconImports from "lucide-react/dynamicIconImports"

const loadedIcons = new Map<string, LazyExoticComponent<LucideIcon>>()

const legacyNames: Record<string, string> = {
  flaskConical: "flask-conical",
  gitFork: "git-fork",
  circleDot: "circle-dot",
  barChart: "chart-no-axes-column",
  layers3: "layers-3",
  gitBranch: "git-branch",
}

export function SkillIcon({ name, ...props }: { name: string } & Omit<ComponentProps<LucideIcon>, "ref">) {
  const normalized = legacyNames[name] ?? name
  const importer = dynamicIconImports[normalized as keyof typeof dynamicIconImports]
  if (!importer) return <Atom {...props} />

  let Icon = loadedIcons.get(normalized)
  if (!Icon) {
    Icon = lazy(importer)
    loadedIcons.set(normalized, Icon)
  }

  return <Suspense fallback={<Atom {...props} />}><Icon {...props} /></Suspense>
}
