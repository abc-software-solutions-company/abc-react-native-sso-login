import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { WebView } from "react-native-webview";

const LOGIN_URL = process.env.EXPO_PUBLIC_WEB_LOGIN_URL || "";
const REDIRECT_URI =
  process.env.EXPO_PUBLIC_MS_REDIRECT_URI || "ssodemo://auth";

type Props = {
  onToken: (tokens: {
    idToken: string;
    accessToken: string;
    refreshToken: string;
  }) => void;
  onError: (message: string) => void;
};

function extractTokens(url: string) {
  const [base, hash] = url.split("#");
  const query = base.split("?")[1] || "";
  const params = new URLSearchParams(hash || query);
  return {
    idToken: params.get("id_token"),
    accessToken: params.get("accessToken"),
    refreshToken: params.get("refreshToken"),
  };
}

export function LoginWebView({ onToken, onError }: Props) {
  if (!LOGIN_URL) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <View style={styles.spacer} />
        <View>
          <Text style={styles.helper}>Missing EXPO_PUBLIC_WEB_LOGIN_URL</Text>
        </View>
      </View>
    );
  }

  return (
    <WebView
      source={{ uri: LOGIN_URL }}
      // Enable JavaScript for proper redirect handling
      javaScriptEnabled={true}
      // Intercept redirect to capture id_token from the web app flow.
      onShouldStartLoadWithRequest={(request) => {
        console.log("WebView loading:", request.url);
        if (request.url.startsWith(REDIRECT_URI)) {
          const tokens = extractTokens(request.url);
          if (tokens.idToken && tokens.accessToken && tokens.refreshToken) {
            onToken({
              idToken: tokens.idToken,
              accessToken: tokens.accessToken,
              refreshToken: tokens.refreshToken,
            });
          } else {
            onError("Missing id_token/access_token/refresh_token in redirect.");
          }
          return false;
        }
        return true;
      }}
      startInLoadingState
      renderLoading={() => (
        <View style={styles.center}>
          <ActivityIndicator />
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  spacer: {
    height: 12,
  },
  helper: {
    color: "#64748b",
    fontSize: 12,
  },
});
