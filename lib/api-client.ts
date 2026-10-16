import { useAuthStore } from "@/lib/auth-store"
import type { ApiError, ListResponse, UploadResult } from "@/types/api"

const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "")

export function apiAssetUrl(url: string): string {
  if (!url || !url.startsWith("/api/v1/uploads/")) return url
  if (!baseUrl) return url
  return `${new URL(baseUrl).origin}${url}`
}

export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  if (!baseUrl) throw new Error("NEXT_PUBLIC_API_URL belum dikonfigurasi")

  const token = useAuthStore.getState().token
  const headers = new Headers(init.headers)
  if (token) headers.set("Authorization", `Bearer ${token}`)
  if (init.body && !(init.body instanceof FormData)) headers.set("Content-Type", "application/json")

  const response = await fetch(`${baseUrl}${path}`, { ...init, headers, cache: "no-store" })
  if (!response.ok) {
    const error = (await response.json().catch(() => null)) as ApiError | null
    if (response.status === 401) {
      useAuthStore.setState({ user: null, token: null, isAuthenticated: false })
    }
    throw new Error(error?.error || `Permintaan API gagal (${response.status})`)
  }
  return response.json() as Promise<T>
}

export async function apiListAll<T>(path: string, pageSize: number): Promise<T[]> {
  const items: T[] = []
  let offset = 0
  while (true) {
    const page = await apiRequest<ListResponse<T>>(`${path}?limit=${pageSize}&offset=${offset}`)
    items.push(...page.data)
    offset += page.data.length
    if (offset >= page.total || page.data.length === 0) return items
  }
}

export async function apiUpload(file: File): Promise<UploadResult> {
  const body = new FormData()
  body.append("file", file)
  return apiRequest<UploadResult>("/uploads", { method: "POST", body })
}

export async function apiDeleteUpload(url: string): Promise<void> {
  const match = url.match(/^\/api\/v1\/uploads\/([0-9]{13}-[a-f0-9]{12}\.(?:png|jpg|jpeg|gif|webp|svg|avif|pdf))$/)
  if (!match) return
  await apiRequest(`/uploads/${match[1]}`, { method: "DELETE" })
}
