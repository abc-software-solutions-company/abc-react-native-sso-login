import type { Session } from '../types/auth';
import type { MicrosoftNativeTokens } from './native/microsoft.native';

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:3002';

export async function exchangeIdToken(tokens: MicrosoftNativeTokens): Promise<Session> {
  // Backend is the source of truth; the app never trusts external tokens.
  const res = await fetch(`${API_BASE_URL}/auth/oidc/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      idToken: tokens.idToken,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Login failed (${res.status})`);
  }

  return (await res.json()) as Session;
}
