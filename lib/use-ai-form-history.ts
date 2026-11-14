"use client"

import { useCallback, useReducer, type Dispatch, type SetStateAction } from "react"

type History<T> = { present: T; past: T[]; future: T[] }
type Action<T> = { type: "set" | "apply"; value: SetStateAction<T> } | { type: "undo" } | { type: "redo" } | { type: "reset" }

export function aiHistoryReducer<T>(state: History<T>, action: Action<T>): History<T> {
  if (action.type === "reset") return { present: state.present, past: [], future: [] }
  if (action.type === "undo") {
    if (!state.past.length) return state
    return { present: state.past[state.past.length - 1], past: state.past.slice(0, -1), future: [state.present, ...state.future] }
  }
  if (action.type === "redo") {
    if (!state.future.length) return state
    return { present: state.future[0], past: [...state.past, state.present].slice(-20), future: state.future.slice(1) }
  }
  const next = typeof action.value === "function" ? (action.value as (previous: T) => T)(state.present) : action.value
  if (Object.is(next, state.present)) return state
  if (action.type === "apply") return { present: next, past: [...state.past, state.present].slice(-20), future: [] }
  return { ...state, present: next, future: [] }
}

export function useAiFormHistory<T>(initial: T) {
  const [history, dispatch] = useReducer(aiHistoryReducer<T>, { present: initial, past: [], future: [] })
  const setValue: Dispatch<SetStateAction<T>> = useCallback((value) => dispatch({ type: "set", value }), [])
  const applyAi: Dispatch<SetStateAction<T>> = useCallback((value) => dispatch({ type: "apply", value }), [])
  const undoAi = useCallback(() => dispatch({ type: "undo" }), [])
  const redoAi = useCallback(() => dispatch({ type: "redo" }), [])
  const resetAi = useCallback(() => dispatch({ type: "reset" }), [])
  return { value: history.present, setValue, applyAi, undoAi, redoAi, resetAi, canUndo: history.past.length > 0, canRedo: history.future.length > 0 }
}
