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
import { EventApiService } from '../services/EventApiService'
import type { IParticipant } from '../domain/IParticipant'

describe('EventApiService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('getParticipants() hits the nested participants url', async () => {
    const participants: IParticipant[] = [
      { id: 'p1', eventId: 'e1', firstName: 'A', lastName: 'B', nationalId: '1' },
    ]
    vi.mocked(httpClient.get).mockResolvedValueOnce({ data: participants } as never)

    const result = await new EventApiService().getParticipants('e1')

    expect(httpClient.get).toHaveBeenCalledWith('Events/e1/Participants')
    expect(result).toEqual(participants)
  })
})
