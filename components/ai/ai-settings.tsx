"use client"

import { useEffect, useState } from "react"
import { chooseAiModel, getAiModels, getSelectedAiModel, setSelectedAiModel, type AiModels } from "@/lib/ai-client"
import { Label } from "@/components/ui/label"

export function AiSettings() {
  const [catalog, setCatalog] = useState<AiModels | null>(null)
  const [selected, setSelected] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    try { localStorage.removeItem("porto-control-ai-local-v1") } catch { /* Storage may be unavailable. */ }
    let active = true
    void getAiModels().then((nextCatalog) => {
      if (!active) return
      setCatalog(nextCatalog)
      setSelected(chooseAiModel(nextCatalog, getSelectedAiModel()) || "")
    }).catch(() => {
      if (active) setError("Could not load models. Try again later.")
    })
    return () => { active = false }
  }, [])

  return <div className="space-y-6 text-sm">
    <section className="space-y-3" aria-labelledby="assistant-usage">
      <h3 id="assistant-usage" className="font-medium">Where you can use it</h3>
      <p className="text-muted-foreground">Use <strong className="text-foreground">Generate form draft</strong> in:</p>
      <ul className="ml-1 space-y-2 border-l border-border pl-4 text-muted-foreground">
        <li>Projects</li>
        <li>Journal</li>
        <li>Experience
          <ul className="mt-1 space-y-1 border-l border-border pl-4">
            <li>Work, education, and skills</li>
            <li>Certifications and achievements</li>
          </ul>
        </li>
        <li>Settings
          <ul className="mt-1 space-y-1 border-l border-border pl-4">
            <li>Profile bio and site copy</li>
            <li>Section titles and SEO description</li>
          </ul>
        </li>
      </ul>
      <p className="text-muted-foreground">Review the draft before applying and saving it. Undo and Redo are available in the form.</p>
    </section>

    <section className="space-y-3 border-t pt-5" aria-labelledby="assistant-model">
      <h3 id="assistant-model" className="font-medium">Model</h3>
      <p className="text-muted-foreground">Choose a model for your drafts. The default model is selected automatically.</p>
      <div className="max-w-md space-y-2">
        <Label htmlFor="assistant-model-select">Model for generated drafts</Label>
        <select id="assistant-model-select" className="border-input bg-background focus-visible:ring-ring/50 h-9 w-full rounded-md border px-3 text-sm focus-visible:outline-none focus-visible:ring-[3px] disabled:opacity-50" value={selected} disabled={!catalog?.models.length} onChange={(event) => { setSelected(event.target.value); setSelectedAiModel(event.target.value) }}>
          {!catalog?.models.length && <option value="">No models available</option>}
          {catalog?.models.map((model) => <option key={model} value={model}>{model}</option>)}
        </select>
      </div>
      {error ? <p role="alert" className="text-destructive">{error}</p> : <p role="status" className="text-muted-foreground">{catalog ? catalog.models.length ? `${catalog.models.length} model${catalog.models.length === 1 ? "" : "s"} available` : "No models available right now." : "Loading models…"}</p>}
    </section>
  </div>
}
