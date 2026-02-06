import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { LoginChoiceScreen } from './src/screens/LoginChoice.screen';
import { LoginNativeScreen } from './src/screens/LoginNative.screen';
import { LoginWebViewScreen } from './src/screens/LoginWebView.screen';
import { UserProfileScreen } from './src/screens/UserProfile.screen';
import { SessionManager } from './src/session/session.manager';
import type { Session } from './src/types/auth';

type Screen = 'choice' | 'native' | 'webview' | 'profile';

export default function App() {
  const [screen, setScreen] = useState<Screen>('choice');
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // Keep this simple: restore session if it exists to show user info.
    SessionManager.loadSession().then((stored) => {
      if (stored) {
        setSession(stored);
        setScreen('profile');
      }
    });
  }, []);

  const onLoginSuccess = async (newSession: Session) => {
    await SessionManager.saveSession(newSession);
    setSession(newSession);
    setScreen('profile');
  };

  const onLogout = async () => {
    await SessionManager.clearSession();
    setSession(null);
    setScreen('choice');
  };

  return (
    <SafeAreaView style={styles.root}>
      {screen === 'choice' && (
        <LoginChoiceScreen
          onNative={() => setScreen('native')}
          onWebView={() => setScreen('webview')}
        />
      )}
      {screen === 'native' && (
        <LoginNativeScreen
          onBack={() => setScreen('choice')}
          onSuccess={onLoginSuccess}
        />
      )}
      {screen === 'webview' && (
        <LoginWebViewScreen
          onBack={() => setScreen('choice')}
          onSuccess={onLoginSuccess}
        />
      )}
      {screen === 'profile' && session && (
        <UserProfileScreen session={session} onLogout={onLogout} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
