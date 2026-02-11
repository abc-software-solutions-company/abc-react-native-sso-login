import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  onNative: () => void;
  onWebView: () => void;
};

export function LoginChoiceScreen({ onNative, onWebView }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>SSO Login PoC</Text>
      {/* <Text style={styles.subtitle}>Choose a login approach</Text> */}

      <TouchableOpacity style={styles.button} onPress={onNative}>
        <Text style={styles.buttonText}>Native OIDC Login</Text>
      </TouchableOpacity>

      {/* <TouchableOpacity style={styles.buttonOutline} onPress={onWebView}>
        <Text style={styles.buttonOutlineText}>WebView Login</Text>
      </TouchableOpacity> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 8,
    color: "#0f172a",
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 32,
    color: "#475569",
  },
  button: {
    backgroundColor: "#2563eb",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginBottom: 12,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
  buttonOutline: {
    borderWidth: 1,
    borderColor: "#2563eb",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  buttonOutlineText: {
    color: "#2563eb",
    fontWeight: "600",
  },
});
