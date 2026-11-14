"use client"

import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AiGenerateDialog } from "@/components/ai/ai-generate-dialog"

export const contentSectionFields = [
  ["heroEyebrow", "Hero location"], ["heroDescription", "Hero description"],
  ["aboutHeading", "About heading"],
  ["journeyHeading", "Journey heading"], ["journeyDescription", "Education fallback subtitle"],
  ["toolkitHeading", "Toolkit heading"], ["experienceHeading", "Experience heading"],
  ["experienceIntro", "Experience introduction"], ["projectsHeading", "Projects heading"],
  ["projectsIntro", "Projects introduction"], ["achievementsHeading", "Achievements heading"],
  ["achievementsIntro", "Achievements introduction"], ["contactHeading", "Contact heading"],
  ["journalHeading", "Journal heading"], ["journalIntro", "Journal introduction"],
  ["contactIntro", "Contact introduction"],
  ["footerCredit", "Footer copyright name"], ["footerTagline", "Footer tagline"],
] as const

export type ContentSectionType = Record<(typeof contentSectionFields)[number][0], string>
export const contentTitleFields = contentSectionFields.filter(([key]) => key.endsWith("Heading"))
export const sectionContentFields = contentSectionFields.filter(([key]) => !key.endsWith("Heading"))

export function SectionContentFields({ value, onChange, onApplyAi, onUndoAi, onRedoAi, canUndoAi, canRedoAi, fields = contentSectionFields, context = {} }: { value: ContentSectionType; onChange: (value: ContentSectionType) => void; onApplyAi: (value: ContentSectionType) => void; onUndoAi: () => void; onRedoAi: () => void; canUndoAi: boolean; canRedoAi: boolean; fields?: ReadonlyArray<(typeof contentSectionFields)[number]>; context?: Record<string, string> }) {
  return <div className="grid gap-5 md:grid-cols-2">
    {fields.map(([key, label]) => <div key={key} className="space-y-2">
      <Label htmlFor={key}>{label}</Label>
      <Textarea id={key} value={value[key]} onChange={(event) => onChange({ ...value, [key]: event.target.value })} rows={key.endsWith("Description") || key.endsWith("Intro") ? 3 : 2} />
      {!(["footerCredit", "heroEyebrow"].includes(key)) && <AiGenerateDialog kind="site" title={label} field={key} context={{ ...context, currentText: value[key] }} onApply={(draft) => onApplyAi({ ...value, [key]: draft.fields.text as string })} onUndo={onUndoAi} onRedo={onRedoAi} canUndo={canUndoAi} canRedo={canRedoAi} />}
    </div>)}
  </div>
}
