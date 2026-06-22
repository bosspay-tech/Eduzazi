import { NextRequest } from 'next/server';

export function getUserId(request: NextRequest) {
  const userId = request.headers.get('x-user-id');
  if (userId && userId.length > 0) return userId;
  return undefined;
}

export function getCartQuery(request: NextRequest) {
  const userId = getUserId(request);
  const sessionId = request.headers.get('x-session-id');
  if (userId) return { userId };
  if (sessionId && sessionId.length > 0) return { sessionId };
  return null;
}
