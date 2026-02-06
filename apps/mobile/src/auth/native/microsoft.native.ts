import { authorize } from 'react-native-app-auth';
import type { AuthConfiguration } from 'react-native-app-auth';
import Constants from 'expo-constants';

function readEnv() {
  const extra =
    Constants.expoConfig?.extra ??
    // Legacy manifest for dev/expo-go
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (Constants as any).manifest?.extra ??
    {};

  const tenantId = String(extra.msTenantId ?? process.env.EXPO_PUBLIC_MS_TENANT_ID ?? '').trim();
  const clientId = String(extra.msClientId ?? process.env.EXPO_PUBLIC_MS_CLIENT_ID ?? '').trim();
  const redirectUrl = String(
    extra.msRedirectUri ?? process.env.EXPO_PUBLIC_MS_REDIRECT_URI ?? ''
  ).trim();

  return { tenantId, clientId, redirectUrl };
}

export async function loginWithMicrosoftNative(): Promise<string> {
  const { tenantId, clientId, redirectUrl } = readEnv();
  if (!tenantId || !clientId || !redirectUrl) {
    throw new Error('Missing Microsoft auth env config.');
  }

  const config: AuthConfiguration = {
    issuer: `https://login.microsoftonline.com/${tenantId}/v2.0`,
    clientId,
    redirectUrl,
    scopes: ['openid', 'profile', 'email', 'offline_access'],
    additionalParameters: {
      prompt: 'select_account',
    },
    serviceConfiguration: {
      authorizationEndpoint: `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize`,
      tokenEndpoint: `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
    },
  };

  const result = await authorize(config);
  if (!result.idToken) {
    throw new Error('Missing id_token from Microsoft');
  }

  // Return only the id_token; backend will verify and issue internal tokens.
  return result.idToken;
}
