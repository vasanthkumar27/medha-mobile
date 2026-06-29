import { useRef, useState } from "react";
import {
  KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { api } from "../api";
import { ISend, ISparkle } from "../components/Icons";
import Mascot from "../components/Mascot";
import Pill from "../components/Pill";
import TopBar from "../components/TopBar";
import { C, F, radius, shadow } from "../theme";

type Mode = "simple" | "teacher" | "analogy" | "beginner";
interface Msg { id: number; role: "user" | "nova"; text: string; pending?: boolean; }

const MODES: { id: Mode; label: string }[] = [
  { id: "simple",   label: "Simple" },
  { id: "teacher",  label: "Teacher" },
  { id: "analogy",  label: "Analogy" },
  { id: "beginner", label: "Beginner" },
];

const SUGGESTIONS = [
  "Explain B+ tree height bound",
  "Why FIFO has Belady's anomaly?",
  "Walk me through TCP 3-way handshake",
  "Quicksort vs merge sort tradeoffs",
];

export default function TutorScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [mode, setMode] = useState<Mode>("simple");
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([{
    id: 1, role: "nova",
    text: "Hi, I'm Nova — your Medha tutor. Ask me anything from your syllabus.",
  }]);
  const scrollRef = useRef<ScrollView>(null);
  const [busy, setBusy] = useState(false);

  async function send(text: string) {
    if (!text.trim()) return;
    const userMsg: Msg = { id: Date.now(), role: "user", text };
    const novaMsg: Msg = { id: Date.now() + 1, role: "nova", text: "", pending: true };
    setMsgs((xs) => [...xs, userMsg, novaMsg]);
    setInput("");
    setBusy(true);
    try {
      const r = await api<{ reply: string }>("/ai/tutor",
        { method: "POST", body: { message: text, mode } });
      setMsgs((xs) => xs.map((m) => m.id === novaMsg.id ? { ...m, text: r.reply, pending: false } : m));
    } catch {
      setMsgs((xs) => xs.map((m) => m.id === novaMsg.id
        ? { ...m, text: "Nova couldn't reach a provider — try again.", pending: false } : m));
    } finally {
      setBusy(false);
      requestAnimationFrame(() => scrollRef.current?.scrollToEnd({ animated: true }));
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined}
                           style={{ flex: 1, backgroundColor: C.bg }}>
      <TopBar title="AI Tutor" onBell={() => navigation.navigate("Notifications")} />
      <View style={styles.modeRow}>
        {MODES.map((m) => (
          <Pressable
            key={m.id}
            onPress={() => setMode(m.id)}
            style={[styles.modeChip, mode === m.id ? styles.modeChipActive : styles.modeChipIdle]}
          >
            <Text style={[styles.modeText, { color: mode === m.id ? C.white : C.slate[600] }]}>{m.label}</Text>
          </Pressable>
        ))}
      </View>

      <ScrollView ref={scrollRef} contentContainerStyle={{ padding: 14, paddingBottom: 200, gap: 10 }}>
        {msgs.map((m) => (
          <View key={m.id} style={[styles.msgRow, m.role === "user" && { justifyContent: "flex-end" }]}>
            {m.role === "nova" && (
              <View style={styles.avatar}><Mascot pose={m.pending ? "think" : "greet"} size={32} /></View>
            )}
            <View style={[
              styles.bubble,
              m.role === "user" ? styles.bubbleUser : styles.bubbleNova,
            ]}>
              {m.pending ? (
                <Text style={{ color: C.slate[500], fontFamily: F.sans }}>Thinking…</Text>
              ) : (
                <Text style={[styles.bubbleText, m.role === "user" && { color: C.white }]}>
                  {m.text}
                </Text>
              )}
            </View>
          </View>
        ))}

        {msgs.length <= 1 && (
          <View style={styles.suggestCard}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 8 }}>
              <ISparkle color={C.amber[600]} />
              <Pill tone="amber">Try asking</Pill>
            </View>
            {SUGGESTIONS.map((s) => (
              <Pressable key={s} onPress={() => send(s)} style={styles.suggestion}>
                <Text style={styles.suggestionText}>{s}</Text>
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>

      <View style={[styles.composer, { paddingBottom: 12 + insets.bottom }]}>
        <TextInput
          style={styles.input}
          placeholder="Ask Nova anything…"
          placeholderTextColor={C.slate[400]}
          value={input}
          onChangeText={setInput}
          editable={!busy}
          onSubmitEditing={() => send(input)}
          returnKeyType="send"
        />
        <Pressable onPress={() => send(input)} disabled={busy || !input.trim()}
                   style={[styles.sendBtn, (!input.trim() || busy) && { opacity: 0.5 }]}>
          <ISend />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  modeRow: {
    flexDirection: "row", gap: 6, padding: 12, backgroundColor: C.white, borderBottomColor: C.slate[100], borderBottomWidth: 1,
  },
  modeChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 99 },
  modeChipActive: { backgroundColor: C.brand[600] },
  modeChipIdle:   { backgroundColor: C.slate[100] },
  modeText: { fontFamily: F.sans, fontWeight: "800", fontSize: 12 },

  msgRow: { flexDirection: "row", gap: 8, alignItems: "flex-end" },
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: C.brand[50], alignItems: "center", justifyContent: "center" },
  bubble: {
    maxWidth: "80%", borderRadius: 16, paddingHorizontal: 12, paddingVertical: 10,
    ...shadow.card,
  },
  bubbleNova: { backgroundColor: C.white },
  bubbleUser: { backgroundColor: C.brand[600] },
  bubbleText: { fontFamily: F.sans, fontSize: 14, color: C.ink, lineHeight: 19 },

  suggestCard: {
    backgroundColor: C.white, borderRadius: radius["2xl"], padding: 14, marginTop: 6, ...shadow.card,
  },
  suggestion: {
    backgroundColor: C.slate[50], paddingHorizontal: 12, paddingVertical: 10, borderRadius: 12, marginTop: 6,
  },
  suggestionText: { fontFamily: F.sans, fontSize: 13, color: C.slate[700], fontWeight: "600" },

  composer: {
    position: "absolute", left: 0, right: 0, bottom: 0,
    backgroundColor: C.white, borderTopColor: C.slate[100], borderTopWidth: 1,
    padding: 10, flexDirection: "row", gap: 8, alignItems: "center",
  },
  input: {
    flex: 1, backgroundColor: C.slate[50], borderRadius: 99, paddingHorizontal: 14, paddingVertical: 10,
    fontFamily: F.sans, fontSize: 14, color: C.ink,
  },
  sendBtn: {
    width: 42, height: 42, borderRadius: 21, backgroundColor: C.brand[600],
    alignItems: "center", justifyContent: "center",
  },
});
