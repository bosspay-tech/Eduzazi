import type { NextRequest } from 'next/server';

function normalizeBaseUrl(url: string): string {
  return url.replace(/\/$/, '');
}

function isLocalhost(url: string): boolean {
  return /localhost|127\.0\.0\.1/i.test(url);
}

/**
 * Resolve the public site URL for redirects, auth, and payment callbacks.
 * Set NEXTAUTH_URL to your live domain in production (e.g. https://yourdomain.com).
 */
export function getSiteBaseUrl(request?: NextRequest): string {
  if (request) {
    const forwardedHost = request.headers.get('x-forwarded-host');
    const host = forwardedHost?.split(',')[0]?.trim() || request.headers.get('host');

    if (host && !isLocalhost(host)) {
      const forwardedProto = request.headers.get('x-forwarded-proto');
      const proto =
        forwardedProto?.split(',')[0]?.trim() ||
        request.nextUrl.protocol.replace(':', '') ||
        'https';
      return normalizeBaseUrl(`${proto}://${host}`);
    }

    if (request.nextUrl.origin && !isLocalhost(request.nextUrl.origin)) {
      return normalizeBaseUrl(request.nextUrl.origin);
    }
  }

  const nextAuthUrl = process.env.NEXTAUTH_URL;
  if (nextAuthUrl && !isLocalhost(nextAuthUrl)) {
    return normalizeBaseUrl(nextAuthUrl);
  }

  const appUrl = process.env.APP_URL;
  if (appUrl && !isLocalhost(appUrl)) {
    return normalizeBaseUrl(appUrl);
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  if (request?.nextUrl.origin) {
    return normalizeBaseUrl(request.nextUrl.origin);
  }

  return normalizeBaseUrl(nextAuthUrl || appUrl || `http://localhost:${process.env.PORT || 3000}`);
}
