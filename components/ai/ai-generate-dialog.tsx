"use client"

import { useState } from "react"
import { Sparkles, Loader2, Undo2, Redo2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { generateAiDraft, type AiDraft, type AiKind } from "@/lib/ai-client"

const label = (key: string) => key.replace(/([A-Z])/g, " $1").replace(/^./, (letter) => letter.toUpperCase())
const display = (value: unknown) => Array.isArray(value) ? value.join("\n• ") : typeof value === "string" ? value : String(value ?? "")

export function AiGenerateDialog({ kind, title, field, context, onApply, onUndo, onRedo, canUndo = false, canRedo = false }: {
  kind: AiKind
  title: string
  field?: string
  context?: Record<string, string | string[] | number | boolean | null>
  onApply: (draft: AiDraft) => void
  onUndo?: () => void
  onRedo?: () => void
  canUndo?: boolean
  canRedo?: boolean
}) {
  const [open, setOpen] = useState(false)
  const [notes, setNotes] = useState("")
  const [draft, setDraft] = useState<AiDraft | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [applied, setApplied] = useState(false)

  const generate = async () => {
    setLoading(true); setError(""); setDraft(null)
    try { setDraft(await generateAiDraft({ kind, title: title.trim(), field, notes: notes.trim(), context })) }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to generate a draft") }
    finally { setLoading(false) }
  }

  return <div className="space-y-2">
    <div className="flex flex-wrap items-center gap-2">
      <Dialog open={open} onOpenChange={(next) => { setOpen(next); if (!next) { setDraft(null); setError("") } }}>
        <DialogTrigger asChild>
          <Button type="button" variant="outline" size="sm" className="gap-1.5" aria-label={`Generate ${field || kind} with AI`}>
            <Sparkles className="h-3.5 w-3.5" /> Generate form draft
          </Button>
        </DialogTrigger>
        <DialogContent className="max-h-[90vh] max-w-xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Generate a local draft</DialogTitle>
            <DialogDescription>Start with the title. Review inferred details before applying; nothing is saved until you use the form&apos;s Save button.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {title.trim() && <div className="space-y-1"><p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Based on</p><p className="break-words text-sm font-medium">{title}</p></div>}
            <div className="space-y-2">
              <Label htmlFor={`ai-notes-${kind}-${field || "all"}`}>Extra notes or facts (optional)</Label>
              <Textarea id={`ai-notes-${kind}-${field || "all"}`} rows={4} value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Add facts, dates, technologies, links, or real metrics you know." />
              {kind === "work" && <p className="text-xs text-muted-foreground">Unknown numbers must be marked as estimates. Verify them before saving.</p>}
            </div>
            {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
            {draft && <div className="max-h-72 space-y-3 overflow-y-auto rounded-md border bg-muted/30 p-4 text-sm" aria-label="AI draft preview">
              {Object.entries(draft.fields).map(([key, value]) => <div key={key} className="space-y-1"><p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label(key)}</p><p className="whitespace-pre-wrap break-words">{display(value)}</p></div>)}
              {draft.warnings.map((warning, index) => <p key={index} className="text-xs font-medium text-amber-700 dark:text-amber-300">{warning}</p>)}
            </div>}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="button" variant="outline" onClick={() => void generate()} disabled={loading || (!title.trim() && !notes.trim())}>{loading && <Loader2 className="mr-1 h-4 w-4 animate-spin" />}{draft ? "Regenerate" : "Generate"}</Button>
            <Button type="button" disabled={!draft || loading} onClick={() => { if (draft) { onApply(draft); setApplied(true) }; setOpen(false) }}>Apply draft</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {onUndo && <Button type="button" variant="ghost" size="sm" onClick={() => { onUndo(); setApplied(false) }} disabled={!canUndo} aria-label="Undo AI draft"><Undo2 className="mr-1 h-3.5 w-3.5" />Undo</Button>}
      {onRedo && <Button type="button" variant="ghost" size="sm" onClick={() => { onRedo(); setApplied(true) }} disabled={!canRedo} aria-label="Redo AI draft"><Redo2 className="mr-1 h-3.5 w-3.5" />Redo</Button>}
    </div>
    {applied && <p role="status" className="text-xs text-muted-foreground">Draft applied locally. Review every field, then save when ready.</p>}
  </div>
}
