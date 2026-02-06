import React, { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { loginWithMicrosoftNative } from '../auth/native/microsoft.native';
import { exchangeIdToken } from '../auth/auth.api';
import type { Session } from '../types/auth';

type Props = {
  onBack: () => void;
  onSuccess: (session: Session) => void;
};

export function LoginNativeScreen({ onBack, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      const idToken = await loginWithMicrosoftNative();
      const session = await exchangeIdToken(idToken);
      onSuccess(session);
    } catch (error: any) {
      Alert.alert('Login failed', error.message || 'Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Native OIDC Login</Text>
      <Text style={styles.subtitle}>Uses react-native-app-auth</Text>

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign in with Microsoft</Text>}
      </TouchableOpacity>

      <TouchableOpacity style={styles.link} onPress={onBack}>
        <Text style={styles.linkText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    color: '#64748b',
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  link: {
    marginTop: 18,
  },
  linkText: {
    color: '#2563eb',
    fontWeight: '600',
  },
});
