"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ConfirmDeleteDialog } from "@/components/common/confirm-delete-dialog"
import { useCMSStore } from "@/lib/store"
import type { ContentOption, ContentOptionKind } from "@/types/api"
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react"

const groups: { kind: ContentOptionKind; title: string; description: string }[] = [
  { kind: "project-category", title: "Project categories", description: "Choices for new and edited projects." },
  { kind: "skill-category", title: "Skill categories", description: "Choices for grouping skills." },
]

export function ContentOptionsManager() {
  const options = useCMSStore((state) => state.contentOptions)
  const loaded = useCMSStore((state) => state.loadedResources.contentOptions)
  const loadError = useCMSStore((state) => state.loadErrors.contentOptions)
  const loadResources = useCMSStore((state) => state.loadResources)
  const addOption = useCMSStore((state) => state.addContentOption)
  const updateOption = useCMSStore((state) => state.updateContentOption)
  const deleteOption = useCMSStore((state) => state.deleteContentOption)
  const [drafts, setDrafts] = useState<Record<ContentOptionKind, string>>({ "project-category": "", "skill-category": "" })
  const [editing, setEditing] = useState<ContentOption | null>(null)
  const [editName, setEditName] = useState("")
  const [deleting, setDeleting] = useState<ContentOption | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => { void loadResources(["contentOptions"]).catch(() => {}) }, [loadResources])

  const add = async (kind: ContentOptionKind) => {
    const name = drafts[kind].trim()
    if (!name) return
    setBusy(true)
    setError("")
    try {
      await addOption(kind, name)
      setDrafts((current) => ({ ...current, [kind]: "" }))
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to add option")
    } finally {
      setBusy(false)
    }
  }

  const saveEdit = async () => {
    if (!editing || !editName.trim()) return
    setBusy(true)
    setError("")
    try {
      await updateOption(editing.id, editName)
      setEditing(null)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to update option")
    } finally {
      setBusy(false)
    }
  }

  return <div className="space-y-5">
    <p className="text-sm text-muted-foreground">Add category choices for projects and skills. Each item uses one category. Existing records stay unchanged when a choice is renamed or deleted.</p>
    {loadError && <div role="alert" className="flex items-center gap-3 text-sm text-destructive"><span>{loadError}</span><Button type="button" size="sm" variant="outline" onClick={() => void loadResources(["contentOptions"]).catch(() => {})}>Retry</Button></div>}
    {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
    {!loaded && !loadError ? <div role="status" className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Loading categories...</div> : loaded ? <div className="grid gap-5 lg:grid-cols-2">
      {groups.map((group) => <Card key={group.kind} className="min-w-0">
        <CardHeader><CardTitle className="text-base">{group.title}</CardTitle><p className="text-xs text-muted-foreground">{group.description}</p></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input aria-label={`New ${group.title.toLowerCase().slice(0, -1)}`} value={drafts[group.kind]} onChange={(event) => setDrafts((current) => ({ ...current, [group.kind]: event.target.value }))} maxLength={80} placeholder="Add a choice" onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); void add(group.kind) } }} />
            <Button type="button" size="icon" aria-label={`Add ${group.title.toLowerCase().slice(0, -1)}`} disabled={busy || !drafts[group.kind].trim()} onClick={() => void add(group.kind)}><Plus className="h-4 w-4" /></Button>
          </div>
          <ul className="divide-y rounded-md border">
            {options.filter((item) => item.kind === group.kind).sort((a, b) => a.name.localeCompare(b.name)).map((item) => <li key={item.id} className="flex min-w-0 items-center gap-2 px-3 py-2 text-sm">
              {editing?.id === item.id ? <>
                <Input aria-label={`Rename ${item.name}`} value={editName} onChange={(event) => setEditName(event.target.value)} maxLength={80} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); void saveEdit() } }} />
                <Button type="button" size="sm" onClick={() => void saveEdit()} disabled={busy || !editName.trim()}>Save</Button>
                <Button type="button" size="sm" variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>
              </> : <>
                <span className="min-w-0 flex-1 truncate" title={item.name}>{item.name}</span>
                <Button type="button" size="icon" variant="ghost" aria-label={`Rename ${item.name}`} onClick={() => { setEditing(item); setEditName(item.name) }}><Pencil className="h-4 w-4" /></Button>
                <Button type="button" size="icon" variant="ghost" aria-label={`Delete ${item.name}`} onClick={() => setDeleting(item)}><Trash2 className="h-4 w-4" /></Button>
              </>}
            </li>)}
          </ul>
        </CardContent>
      </Card>)}
    </div> : null}
    <ConfirmDeleteDialog open={Boolean(deleting)} onOpenChange={(open) => { if (!open) setDeleting(null) }} title={`Delete “${deleting?.name ?? ""}”?`} description="This removes the choice from future forms. Existing records keep their current category." confirmLabel="Delete choice" onConfirm={async () => { if (deleting) await deleteOption(deleting.id) }} />
  </div>
}
