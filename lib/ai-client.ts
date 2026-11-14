import { apiRequest } from "@/lib/api-client"
import { useAuthStore } from "@/lib/auth-store"

export type AiKind = "project" | "blog" | "work" | "education" | "skill" | "achievement" | "site"
export type AiDraft = { fields: Record<string, unknown>; warnings: string[] }
export type AiModels = { models: string[]; defaultModel: string | null; source: "provider" | "configured" | "unavailable" | "unconfigured" }

const modelStorageKey = "porto-control-ai-model-v1"
let inMemoryModel: string | null = null
let modelsRequest: Promise<AiModels> | null = null
let modelsRequestToken: string | null = null
let modelsRequestExpiresAt = 0

export function getAiModels(): Promise<AiModels> {
  const token = useAuthStore.getState().token
  if (modelsRequest && modelsRequestToken === token && Date.now() < modelsRequestExpiresAt) return modelsRequest
  const request = apiRequest<AiModels>("/ai/models")
  modelsRequest = request
  modelsRequestToken = token
  modelsRequestExpiresAt = Date.now() + 60_000
  void request.catch(() => {
    if (modelsRequest === request) modelsRequest = null
  })
  return request
}

export function getSelectedAiModel(): string | null {
  try { return localStorage.getItem(modelStorageKey) || inMemoryModel } catch { return inMemoryModel }
}

export function setSelectedAiModel(model: string): void {
  inMemoryModel = model
  try { localStorage.setItem(modelStorageKey, model) } catch { /* Keep the choice in memory when storage is disabled. */ }
}

export function chooseAiModel(catalog: AiModels, saved: string | null): string | null {
  return saved && catalog.models.includes(saved) ? saved : catalog.defaultModel
}

export async function generateAiDraft(input: { kind: AiKind; title: string; notes?: string; field?: string; context?: Record<string, string | string[] | number | boolean | null> }): Promise<AiDraft> {
  const catalog = await getAiModels()
  const model = chooseAiModel(catalog, getSelectedAiModel())
  if (!model) throw new Error("No AI model is available right now. Try again later.")
  return apiRequest<AiDraft>("/ai/generate", { method: "POST", body: JSON.stringify({ ...input, model }) })
}
