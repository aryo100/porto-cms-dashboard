import assert from "node:assert/strict"
import { test } from "node:test"
import { aiHistoryReducer } from "../lib/use-ai-form-history.ts"

test("AI form drafts apply locally and support undo and redo", () => {
  const initial = { present: { title: "Portfolio", description: "" }, past: [], future: [] }
  const applied = aiHistoryReducer(initial, { type: "apply", value: (current) => ({ ...current, description: "Generated draft" }) })
  assert.equal(applied.present.description, "Generated draft")
  const undone = aiHistoryReducer(applied, { type: "undo" })
  assert.equal(undone.present.description, "")
  const redone = aiHistoryReducer(undone, { type: "redo" })
  assert.equal(redone.present.description, "Generated draft")
  const edited = aiHistoryReducer(undone, { type: "set", value: { ...undone.present, title: "New title" } })
  assert.equal(edited.future.length, 0)
  const saved = aiHistoryReducer(redone, { type: "reset" })
  assert.equal(saved.past.length, 0)
  assert.equal(saved.future.length, 0)
  assert.equal(saved.present.description, "Generated draft")
})
