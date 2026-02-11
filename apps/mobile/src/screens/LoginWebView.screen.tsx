import React, { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LoginWebView } from '../auth/webview/login.webview';
import { exchangeIdToken } from '../auth/auth.api';
import type { Session } from '../types/auth';

type Props = {
  onBack: () => void;
  onSuccess: (session: Session) => void;
};

export function LoginWebViewScreen({ onBack, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);

  const handleToken = async (tokens: { idToken: string; accessToken: string; refreshToken: string }) => {
    try {
      setLoading(true);
      const session = await exchangeIdToken(tokens);
      onSuccess(session);
    } catch (error: any) {
      console.warn('[auth] login failed (webview)', error?.message || error);
      Alert.alert('Login failed', error.message || 'Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleError = (message: string) => {
    console.warn('[auth] login failed (webview)', message);
    Alert.alert('Login failed', message);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>WebView Login</Text>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.linkText}>Back</Text>
        </TouchableOpacity>
      </View>

      {loading && (
        <View style={styles.loading}>
          <ActivityIndicator />
        </View>
      )}

      <LoginWebView onToken={handleToken} onError={handleError} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  linkText: {
    color: '#2563eb',
    fontWeight: '600',
  },
  loading: {
    paddingVertical: 8,
  },
});
