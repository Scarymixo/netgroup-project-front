import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('../services/httpClient', () => ({
  httpClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}))

import { httpClient } from '../services/httpClient'
import { BaseApiService } from '../services/BaseApiService'

interface Thing {
  id: string
  name: string
}

class ThingService extends BaseApiService<Thing> {
  constructor() {
    super('Things')
  }
}

describe('BaseApiService', () => {
  let service: ThingService

  beforeEach(() => {
    vi.clearAllMocks()
    service = new ThingService()
  })

  it('getAll() GETs the endpoint and returns the data array', async () => {
    const items: Thing[] = [{ id: '1', name: 'a' }]
    vi.mocked(httpClient.get).mockResolvedValueOnce({ data: items } as never)

    const result = await service.getAll()

    expect(httpClient.get).toHaveBeenCalledWith('Things')
    expect(result).toEqual(items)
  })

  it('getById() GETs the endpoint with the id appended', async () => {
    const item: Thing = { id: '42', name: 'a' }
    vi.mocked(httpClient.get).mockResolvedValueOnce({ data: item } as never)

    const result = await service.getById('42')

    expect(httpClient.get).toHaveBeenCalledWith('Things/42')
    expect(result).toEqual(item)
  })

  it('create() POSTs the body and returns the created item', async () => {
    const item: Thing = { id: '1', name: 'a' }
    vi.mocked(httpClient.post).mockResolvedValueOnce({ data: item } as never)

    const result = await service.create(item)

    expect(httpClient.post).toHaveBeenCalledWith('Things', item)
    expect(result).toEqual(item)
  })

  it('update() PUTs to the id-scoped url', async () => {
    vi.mocked(httpClient.put).mockResolvedValueOnce({ data: undefined } as never)

    await service.update('1', { id: '1', name: 'b' })

    expect(httpClient.put).toHaveBeenCalledWith('Things/1', { id: '1', name: 'b' })
  })

  it('delete() DELETEs the id-scoped url', async () => {
    vi.mocked(httpClient.delete).mockResolvedValueOnce({ data: undefined } as never)

    await service.delete('1')

    expect(httpClient.delete).toHaveBeenCalledWith('Things/1')
  })
})
