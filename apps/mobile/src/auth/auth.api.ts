import type { Session } from '../types/auth';

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:3002';

export async function exchangeIdToken(idToken: string): Promise<Session> {
  // Backend is the source of truth; the app never trusts external tokens.
  const res = await fetch(`${API_BASE_URL}/auth/oidc/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Login failed (${res.status})`);
  }

  return (await res.json()) as Session;
}
