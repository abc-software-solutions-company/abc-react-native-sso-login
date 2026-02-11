import Constants from "expo-constants";
import { Platform } from "react-native";
import type { AuthConfiguration } from "react-native-app-auth";
import { authorize } from "react-native-app-auth";

function readEnv() {
  const extra =
    Constants.expoConfig?.extra ??
    // Legacy manifest for dev/expo-go

    (Constants as any).manifest?.extra ??
    {};

  const tenantId = String(
    extra.msTenantId ?? process.env.EXPO_PUBLIC_MS_TENANT_ID ?? "",
  ).trim();
  const clientId = String(
    extra.msClientId ?? process.env.EXPO_PUBLIC_MS_CLIENT_ID ?? "",
  ).trim();
  const redirectUrl =
    Platform.OS === "android"
      ? extra.msRedirectUriAndroid
      : extra.msRedirectUriIos;

  return { tenantId, clientId, redirectUrl };
}

export type MicrosoftNativeTokens = {
  idToken: string;
  accessToken: string;
  refreshToken: string;
};

export async function loginWithMicrosoftNative(): Promise<MicrosoftNativeTokens> {
  const { tenantId, clientId, redirectUrl } = readEnv();
  if (!tenantId || !clientId || !redirectUrl) {
    throw new Error("Missing Microsoft auth env config.");
  }

  const config: AuthConfiguration = {
    issuer: `https://login.microsoftonline.com/${tenantId}/v2.0`,
    clientId,
    redirectUrl,
    scopes: ["openid", "profile", "email", "offline_access"],
    additionalParameters: {
      prompt: "select_account",
    },
    serviceConfiguration: {
      authorizationEndpoint: `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize`,
      tokenEndpoint: `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
    },
  };

  const result = await authorize(config);
  if (!result.idToken) {
    throw new Error("Missing id_token from Microsoft");
  }
  if (!result.accessToken) {
    throw new Error("Missing accessToken from Microsoft");
  }
  if (!result.refreshToken) {
    throw new Error("Missing refreshToken from Microsoft");
  }

  return {
    idToken: result.idToken,
    accessToken: result.accessToken,
    refreshToken: result.refreshToken,
  };
}
