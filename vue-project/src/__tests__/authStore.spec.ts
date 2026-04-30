import { beforeEach, describe, expect, it } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '../stores/authStore'

describe('authStore', () => {
  beforeEach(() => {
    sessionStorage.clear()
    setActivePinia(createPinia())
  })

  it('starts logged out when sessionStorage is empty', () => {
    const store = useAuthStore()
    expect(store.jwt).toBe('')
    expect(store.refreshToken).toBe('')
    expect(store.isLoggedIn()).toBe(false)
    expect(store.isAdmin()).toBe(false)
  })

  it('hydrates from sessionStorage on init', () => {
    sessionStorage.setItem(
      'auth',
      JSON.stringify({ jwt: 'stored-jwt', refreshToken: 'stored-refresh' }),
    )
    const store = useAuthStore()
    expect(store.jwt).toBe('stored-jwt')
    expect(store.refreshToken).toBe('stored-refresh')
    expect(store.isLoggedIn()).toBe(true)
  })

  it('clears corrupt sessionStorage and falls back to logged-out state', () => {
    sessionStorage.setItem('auth', '{not json')
    const store = useAuthStore()
    expect(store.jwt).toBe('')
    expect(sessionStorage.getItem('auth')).toBeNull()
  })

  it('setAuth stores tokens and persists them', () => {
    const store = useAuthStore()
    store.setAuth({ jwt: 'j', refreshToken: 'r' })

    expect(store.jwt).toBe('j')
    expect(store.refreshToken).toBe('r')
    expect(store.isLoggedIn()).toBe(true)
    expect(JSON.parse(sessionStorage.getItem('auth')!)).toEqual({
      jwt: 'j',
      refreshToken: 'r',
    })
  })

  it('logOut clears tokens and storage', () => {
    const store = useAuthStore()
    store.setAuth({ jwt: 'j', refreshToken: 'r' })
    store.logOut()

    expect(store.jwt).toBe('')
    expect(store.refreshToken).toBe('')
    expect(store.isLoggedIn()).toBe(false)
    expect(sessionStorage.getItem('auth')).toBeNull()
  })
})
