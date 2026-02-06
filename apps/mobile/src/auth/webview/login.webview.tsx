import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';

const LOGIN_URL = process.env.EXPO_PUBLIC_WEB_LOGIN_URL || '';
const REDIRECT_URI = process.env.EXPO_PUBLIC_MS_REDIRECT_URI || 'ssodemo://auth';

type Props = {
  onToken: (idToken: string) => void;
  onError: (message: string) => void;
};

function extractIdToken(url: string): string | null {
  const [base, hash] = url.split('#');
  const query = base.split('?')[1] || '';
  const params = new URLSearchParams(hash || query);
  return params.get('id_token');
}

export function LoginWebView({ onToken, onError }: Props) {
  if (!LOGIN_URL) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <View style={styles.spacer} />
        <View>
          <Text style={styles.helper}>
            Missing EXPO_PUBLIC_WEB_LOGIN_URL
          </Text>
        </View>
      </View>
    );
  }

  return (
    <WebView
      source={{ uri: LOGIN_URL }}
      // Intercept redirect to capture id_token from the web app flow.
      onShouldStartLoadWithRequest={(request) => {
        if (request.url.startsWith(REDIRECT_URI)) {
          const token = extractIdToken(request.url);
          if (token) {
            onToken(token);
          } else {
            onError('Missing id_token in redirect.');
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  spacer: {
    height: 12,
  },
  helper: {
    color: '#64748b',
    fontSize: 12,
  },
});
