import assert from 'node:assert/strict'
import { before, test } from 'node:test'

let useAuthStore: typeof import('../lib/auth-store').useAuthStore
before(async () => {
  process.env.NEXT_PUBLIC_API_URL = 'http://127.0.0.1:3100/api/v1'
  useAuthStore = (await import(new URL('../lib/auth-store.ts', import.meta.url).href)).useAuthStore
})

test('dashboard login uses the backend and saves its JWT and user', async () => {
  const originalFetch = globalThis.fetch
  const user = { id: 7, name: 'Portfolio Admin', email: 'admin@example.com', role: 'admin', createdAt: '2026-01-01', updatedAt: '2026-01-01' }
  let requested = ''
  globalThis.fetch = async (input, init) => {
    requested = String(input)
    assert.equal(init?.method, 'POST')
    assert.deepEqual(JSON.parse(String(init?.body)), { email: 'admin@example.com', password: 'a-secret-password' })
    return new Response(JSON.stringify({ token: 'real-jwt', user }), { status: 200 })
  }
  try {
    assert.deepEqual(await useAuthStore.getState().login('admin@example.com', 'a-secret-password'), { ok: true })
    assert.equal(requested, 'http://127.0.0.1:3100/api/v1/auth/login')
    assert.equal(useAuthStore.getState().token, 'real-jwt')
    assert.deepEqual(useAuthStore.getState().user, user)
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('expired or demo token is rejected when a dashboard session is restored', async () => {
  const originalFetch = globalThis.fetch
  useAuthStore.setState({ token: 'demo-token-old', isAuthenticated: true, hasHydrated: false })
  globalThis.fetch = async () => new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  try {
    await useAuthStore.getState().validateSession()
    assert.equal(useAuthStore.getState().isAuthenticated, false)
    assert.equal(useAuthStore.getState().token, null)
    assert.equal(useAuthStore.getState().hasHydrated, true)
  } finally {
    globalThis.fetch = originalFetch
  }
})
