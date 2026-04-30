import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { AuthApiService } from '../services/AuthApiService'

const baseUrl = import.meta.env.VITE_API_BASE_URL ?? ''

describe('AuthApiService', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('login() POSTs credentials and returns the parsed auth response', async () => {
    const tokens = { jwt: 'j', refreshToken: 'r' }
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => tokens,
    } as Response)

    const result = await AuthApiService.login({ email: 'a@b.c', password: 'pw' })

    expect(fetch).toHaveBeenCalledWith(
      `${baseUrl}identity/Account/Login`,
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'a@b.c', password: 'pw' }),
      }),
    )
    expect(result).toEqual(tokens)
  })

  it('login() throws when the response is not ok', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({ ok: false, status: 401 } as Response)

    await expect(
      AuthApiService.login({ email: 'a@b.c', password: 'pw' }),
    ).rejects.toThrow(/401/)
  })

  it('refresh() POSTs the token pair and returns the parsed auth response', async () => {
    const tokens = { jwt: 'new-j', refreshToken: 'new-r' }
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => tokens,
    } as Response)

    const result = await AuthApiService.refresh({ jwt: 'old-j', refreshToken: 'old-r' })

    expect(fetch).toHaveBeenCalledWith(
      `${baseUrl}identity/Account/RefreshToken`,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ jwt: 'old-j', refreshToken: 'old-r' }),
      }),
    )
    expect(result).toEqual(tokens)
  })

  it('refresh() throws when the response is not ok', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({ ok: false, status: 500 } as Response)

    await expect(
      AuthApiService.refresh({ jwt: 'j', refreshToken: 'r' }),
    ).rejects.toThrow(/500/)
  })
})
