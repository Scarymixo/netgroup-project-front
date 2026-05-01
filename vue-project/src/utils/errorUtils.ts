import { isAxiosError } from 'axios';

export function extractApiError(e: unknown, fallback: string): string {
  if (!isAxiosError(e)) {
    return e instanceof Error ? e.message : fallback;
  }

  const data = e.response?.data;
  if (!data) return fallback;

  if (typeof data === 'string' && data.trim()) return data.trim();

  if (typeof data === 'object') {
    // ASP.NET Core validation errors: { errors: { Field: ["msg1", "msg2"] } }
    if (data.errors && typeof data.errors === 'object') {
      const messages = Object.values(data.errors as Record<string, string[]>)
        .flat()
        .filter(Boolean);
      if (messages.length) return messages.join(' ');
    }
    if (typeof data.detail === 'string' && data.detail.trim()) return data.detail.trim();
    if (typeof data.title === 'string' && data.title.trim()) return data.title.trim();
    if (typeof data.message === 'string' && data.message.trim()) return data.message.trim();
  }

  return fallback;
}
