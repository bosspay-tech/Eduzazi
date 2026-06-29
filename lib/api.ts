import { getSiteBaseUrl } from './site-url';

export function apiUrl(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  if (typeof window !== 'undefined') {
    return normalized;
  }
  return `${getSiteBaseUrl()}${normalized}`;
}

export function authHeaders(userId?: string | null): HeadersInit {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (userId) {
    headers['x-user-id'] = userId;
  }
  return headers;
}
