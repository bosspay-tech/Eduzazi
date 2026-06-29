import type { NextRequest } from 'next/server';

function normalizeBaseUrl(url: string): string {
  return url.replace(/\/$/, '');
}

function isLocalhost(url: string): boolean {
  return /localhost|127\.0\.0\.1/i.test(url);
}

function withHttpsIfNeeded(url: string): string {
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  return `https://${url}`;
}

function getCoolifyBaseUrl(): string | null {
  const coolifyUrl = process.env.COOLIFY_URL;
  if (coolifyUrl && !isLocalhost(coolifyUrl)) {
    return normalizeBaseUrl(coolifyUrl);
  }

  const coolifyFqdn = process.env.COOLIFY_FQDN;
  if (coolifyFqdn && !isLocalhost(coolifyFqdn)) {
    return normalizeBaseUrl(withHttpsIfNeeded(coolifyFqdn));
  }

  const serviceUrl = process.env.SERVICE_URL;
  if (serviceUrl && !isLocalhost(serviceUrl)) {
    return normalizeBaseUrl(withHttpsIfNeeded(serviceUrl));
  }

  return null;
}

/**
 * Resolve the public site URL for redirects, auth, and payment callbacks.
 * Set NEXTAUTH_URL to your live domain in production (e.g. https://yourdomain.com).
 * On Coolify, NEXTAUTH_URL can match COOLIFY_URL or your custom domain.
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

  const coolifyBase = getCoolifyBaseUrl();
  if (coolifyBase) {
    return coolifyBase;
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

/** Use Coolify URL when NEXTAUTH_URL is missing or still set to localhost. */
export function ensureNextAuthUrl(): void {
  const current = process.env.NEXTAUTH_URL;
  if (current && !isLocalhost(current)) {
    return;
  }

  const resolved = getCoolifyBaseUrl();
  if (resolved) {
    process.env.NEXTAUTH_URL = resolved;
  }
}
