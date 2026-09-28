import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { AuthResponse, User } from "@/types/api"

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  hasHydrated: boolean
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>
  validateSession: () => Promise<void>
  logout: () => void
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "")

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      hasHydrated: false,
      login: async (email, password) => {
        if (!apiUrl) return { ok: false, error: "NEXT_PUBLIC_API_URL belum dikonfigurasi" }
        try {
          const response = await fetch(`${apiUrl}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: email.trim(), password }),
          })
          if (response.status === 401) return { ok: false, error: "Email atau password salah" }
          if (!response.ok) return { ok: false, error: "Login gagal. Coba lagi." }
          const result = (await response.json()) as AuthResponse
          if (!result.token || !result.user) return { ok: false, error: "Respons login tidak valid" }
          set({ user: result.user, token: result.token, isAuthenticated: true })
          return { ok: true }
        } catch {
          return { ok: false, error: "Tidak dapat terhubung ke API" }
        }
      },

      validateSession: async () => {
        const token = get().token
        if (!apiUrl || !token) {
          set({ user: null, token: null, isAuthenticated: false, hasHydrated: true })
          return
        }
        try {
          const response = await fetch(`${apiUrl}/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
          if (!response.ok) throw new Error("Session expired")
          const user = (await response.json()) as User
          set({ user, isAuthenticated: true, hasHydrated: true })
        } catch {
          set({ user: null, token: null, isAuthenticated: false, hasHydrated: true })
        }
      },

      logout: () => {
        const token = get().token
        set({ user: null, token: null, isAuthenticated: false })
        if (apiUrl && token) {
          void fetch(`${apiUrl}/auth/logout`, { method: "POST", headers: { Authorization: `Bearer ${token}` } }).catch(() => {})
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated }),
      onRehydrateStorage: () => (state) => { if (state) void state.validateSession() },
    },
  ),
)
