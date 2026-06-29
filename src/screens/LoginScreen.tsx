import { useState } from "react";
import {
  Alert, Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { api } from "../api";
import Btn3d from "../components/Btn3d";
import Mascot from "../components/Mascot";
import { useAuth } from "../store";
import { C, F, radius, shadow } from "../theme";

const LOGO_MARK = require("../../assets/medha-icon.png");
const LOGO_WORDMARK = require("../../assets/medha-logo.png");

const DEMO = [
  { email: "aditya@medha.app", label: "Aditya · healthy" },
  { email: "priya@medha.app",  label: "Priya · overloaded" },
  { email: "kabir@medha.app",  label: "Kabir · newbie" },
];

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const setTokens = useAuth((s) => s.setTokens);
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("aditya@medha.app");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("Demo@12345");
  const [busy, setBusy] = useState(false);

  async function submit() {
    setBusy(true);
    try {
      const body = mode === "login" ? { email, password } : { email, password, name };
      const t = await api<{ access_token: string; refresh_token: string }>(
        `/auth/${mode}`, { method: "POST", body, auth: false },
      );
      setTokens(t.access_token, t.refresh_token);
    } catch (e: any) {
      Alert.alert("Sign in failed", e?.message ?? "Something went wrong");
    } finally { setBusy(false); }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: C.bg }}
                          behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={{ paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24, paddingHorizontal: 20 }}>
        <View style={{ alignItems: "center", marginBottom: 18 }}>
          <Image source={LOGO_WORDMARK} style={styles.wordmark} resizeMode="contain" />
        </View>

        <View style={styles.heroCard}>
          <Mascot pose="cheer" size={120} />
          <Text style={styles.heroTitle}>
            Hi there! I'm Nova.
          </Text>
          <Text style={styles.heroSub}>
            Sign in to continue your streak — or tap a demo persona below.
          </Text>
        </View>

        <View style={styles.formCard}>
          {mode === "register" && (
            <TextInput placeholder="Name" placeholderTextColor={C.slate[400]}
                       value={name} onChangeText={setName} style={styles.input} />
          )}
          <TextInput placeholder="Email" placeholderTextColor={C.slate[400]}
                     autoCapitalize="none" keyboardType="email-address"
                     value={email} onChangeText={setEmail} style={styles.input} />
          <TextInput placeholder="Password" placeholderTextColor={C.slate[400]}
                     secureTextEntry value={password} onChangeText={setPassword}
                     style={styles.input} />
          <Btn3d label={mode === "login" ? "Sign in" : "Create account"}
                 variant="brand" onPress={submit} loading={busy} />
          <Pressable onPress={() => setMode(mode === "login" ? "register" : "login")}>
            <Text style={styles.switch}>
              {mode === "login" ? "New here? Create an account →" : "Have an account? Sign in →"}
            </Text>
          </Pressable>
        </View>

        <View style={{ marginTop: 16 }}>
          <Text style={styles.demoLabel}>Demo personas (one tap)</Text>
          {DEMO.map((d) => (
            <Pressable key={d.email}
                       onPress={() => { setEmail(d.email); setPassword("Demo@12345"); setMode("login"); }}
                       style={styles.demoBtn}>
              <Text style={styles.demoEmail}>{d.email}</Text>
              <Text style={styles.demoMeta}>{d.label}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wordmark: { width: 260, height: 52 },

  heroCard: { alignItems: "center", padding: 20, backgroundColor: C.brand[600], borderRadius: radius["2xl"], ...shadow.soft },
  heroTitle: { color: C.white, fontFamily: F.display, fontSize: 22, fontWeight: "800", marginTop: 6 },
  heroSub: { color: "rgba(255,255,255,.8)", fontFamily: F.sans, fontSize: 13, textAlign: "center", maxWidth: 280, marginTop: 4 },

  formCard: { backgroundColor: C.white, borderRadius: radius["2xl"], padding: 16, gap: 10, marginTop: 16, ...shadow.card },
  input: {
    backgroundColor: C.bg, borderColor: C.slate[200], borderWidth: 2, borderRadius: radius.lg,
    color: C.ink, paddingHorizontal: 12, paddingVertical: 10, fontFamily: F.sans, fontSize: 14,
  },
  switch: { color: C.brand[600], textAlign: "center", fontWeight: "800", fontSize: 13, paddingTop: 4, fontFamily: F.sans },

  demoLabel: { fontFamily: F.sans, fontSize: 11, color: C.slate[400], textTransform: "uppercase", letterSpacing: 0.6, fontWeight: "800", marginBottom: 6 },
  demoBtn: { backgroundColor: C.white, padding: 12, borderRadius: radius.lg, marginBottom: 8, ...shadow.card },
  demoEmail: { fontFamily: F.sans, fontWeight: "800", color: C.ink, fontSize: 13 },
  demoMeta: { fontFamily: F.sans, color: C.slate[500], fontSize: 11, marginTop: 2 },
});
