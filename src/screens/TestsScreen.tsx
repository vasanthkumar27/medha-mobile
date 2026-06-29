import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { api } from "../api";
import Pill from "../components/Pill";
import TopBar from "../components/TopBar";
import { useToast } from "../components/Toast";
import { C, F, radius, shadow } from "../theme";

interface MockTest {
  id: number; title: string; kind: string; subject: string | null;
  description: string; minutes: number; difficulty: string;
}
interface Question { id: number; order: number; type: string; prompt: string; options: any[] }
interface AttemptStart { attempt_id: number; test: MockTest & { questions: Question[] } }
interface Recent { attempt_id: number; score: number; total: number; accuracy: number; title: string; }

const KIND_TONE: Record<string, "brand" | "amber" | "grass" | "rose"> = {
  topic: "brand", sectional: "amber", full: "grass", pyq: "rose",
};

export default function TestsScreen({ navigation }: any) {
  const toast = useToast();
  const [tests, setTests] = useState<MockTest[]>([]);
  const [recent, setRecent] = useState<Recent[]>([]);
  const [attempt, setAttempt] = useState<AttemptStart | null>(null);
  const [picks, setPicks] = useState<Record<number, any>>({});
  const [result, setResult] = useState<any>(null);

  async function load() {
    try {
      const [t, r] = await Promise.all([
        api<MockTest[]>("/mocktests"),
        api<Recent[]>("/mocktests/attempts/recent?limit=4"),
      ]);
      setTests(t); setRecent(r);
    } catch {}
  }
  useEffect(() => { load(); }, []);

  async function start(id: number) {
    try {
      const a = await api<AttemptStart>(`/mocktests/${id}/attempt`, { method: "POST" });
      setAttempt(a); setPicks({}); setResult(null);
    } catch { toast("Couldn't start test.", "error"); }
  }

  async function answer(qid: number, picked: any) {
    setPicks((p) => ({ ...p, [qid]: picked }));
    try {
      await api(`/mocktests/attempts/${attempt!.attempt_id}/answer`,
                { method: "POST", body: { question_id: qid, picked } });
    } catch {}
  }

  async function submit() {
    if (!attempt) return;
    try {
      const r = await api<any>(`/mocktests/attempts/${attempt.attempt_id}/submit`, { method: "POST" });
      setResult(r);
      toast(`Scored ${r.score}/${r.total} — +${r.xp_earned} XP`, "success");
    } catch { toast("Couldn't submit.", "error"); }
  }

  if (attempt && !result) {
    return (
      <View style={{ flex: 1, backgroundColor: C.bg }}>
        <TopBar title={attempt.test.title} onBell={() => navigation.navigate("Notifications")} />
        <ScrollView contentContainerStyle={{ padding: 14, paddingBottom: 200, gap: 12 }}>
          {attempt.test.questions.map((q, i) => (
            <View key={q.id} style={styles.card}>
              <Pill tone="slate">Q{i + 1} · {q.type.toUpperCase()}</Pill>
              <Text style={styles.prompt}>{q.prompt}</Text>
              {q.type === "mcq" && q.options.map((o: string, oi: number) => (
                <Pressable key={oi}
                           onPress={() => answer(q.id, { index: oi })}
                           style={[styles.opt, picks[q.id]?.index === oi && styles.optActive]}>
                  <Text style={styles.optText}>{o}</Text>
                </Pressable>
              ))}
              {q.type === "tf" && (
                <View style={{ flexDirection: "row", gap: 8, marginTop: 6 }}>
                  {[{ v: true, lbl: "True" }, { v: false, lbl: "False" }].map((o) => (
                    <Pressable key={o.lbl}
                               onPress={() => answer(q.id, { value: o.v })}
                               style={[styles.tfBtn, picks[q.id]?.value === o.v && styles.optActive]}>
                      <Text style={styles.tfText}>{o.lbl}</Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>
          ))}
          <Pressable onPress={submit} style={styles.submit}>
            <Text style={styles.submitText}>Submit attempt</Text>
          </Pressable>
        </ScrollView>
      </View>
    );
  }

  if (result) {
    return (
      <View style={{ flex: 1, backgroundColor: C.bg }}>
        <TopBar title="Result" onBell={() => navigation.navigate("Notifications")} />
        <ScrollView contentContainerStyle={{ padding: 14, gap: 12 }}>
          <View style={[styles.card, { alignItems: "center", padding: 28, backgroundColor: C.brand[600] }]}>
            <Text style={[styles.bigScore, { color: C.white }]}>
              {result.score} / {result.total}
            </Text>
            <Text style={{ color: "rgba(255,255,255,.75)", fontFamily: F.sans, marginTop: 4 }}>
              {(result.accuracy * 100).toFixed(1)}% · +{result.xp_earned} XP
            </Text>
          </View>
          {result.per_question.map((q: any, i: number) => (
            <View key={q.question_id} style={[styles.card, !q.is_correct && { borderColor: C.rose[200], borderWidth: 1 }]}>
              <Pill tone={q.is_correct ? "grass" : "rose"}>Q{i + 1} · {q.is_correct ? "Correct" : "Missed"}</Pill>
              <Text style={styles.prompt}>{q.prompt}</Text>
              {!!q.explanation && <Text style={styles.expl}>{q.explanation}</Text>}
            </View>
          ))}
          <Pressable onPress={() => { setAttempt(null); setResult(null); load(); }}
                     style={styles.submit}>
            <Text style={styles.submitText}>Back to tests</Text>
          </Pressable>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <TopBar title="Mock Tests" onBell={() => navigation.navigate("Notifications")} />
      <ScrollView contentContainerStyle={{ padding: 14, paddingBottom: 120, gap: 12 }}>
        {recent.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Recent attempts</Text>
            {recent.map((r) => (
              <View key={r.attempt_id} style={styles.recentRow}>
                <Text style={styles.recentTitle} numberOfLines={1}>{r.title}</Text>
                <Pill tone="brand">{Math.round(r.accuracy * 100)}%</Pill>
              </View>
            ))}
          </View>
        )}

        {tests.map((t) => (
          <View key={t.id} style={styles.card}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 6 }}>
              <Pill tone={KIND_TONE[t.kind] ?? "brand"}>{t.kind.toUpperCase()}</Pill>
              <Text style={styles.minutes}>{t.minutes}m</Text>
            </View>
            <Text style={styles.testTitle}>{t.title}</Text>
            <Text style={styles.testDesc} numberOfLines={2}>{t.description}</Text>
            <Pressable onPress={() => start(t.id)} style={styles.startBtn}>
              <Text style={styles.startText}>Start →</Text>
            </Pressable>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: C.white, borderRadius: radius["2xl"], padding: 14, ...shadow.card, gap: 6 },
  cardTitle: { fontFamily: F.display, fontSize: 16, fontWeight: "800", color: C.ink },

  recentRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 4 },
  recentTitle: { flex: 1, fontFamily: F.sans, color: C.slate[700], fontSize: 13, marginRight: 8 },

  testTitle: { fontFamily: F.display, fontSize: 16, fontWeight: "800", color: C.ink, marginTop: 4 },
  testDesc:  { fontFamily: F.sans, fontSize: 12, color: C.slate[500], marginTop: 2 },
  minutes:   { fontFamily: F.sans, fontSize: 11, color: C.slate[400], fontWeight: "700" },

  startBtn: { alignSelf: "flex-start", backgroundColor: C.brand[600], paddingHorizontal: 14, paddingVertical: 8, borderRadius: 99, marginTop: 8 },
  startText: { color: C.white, fontFamily: F.sans, fontWeight: "800", fontSize: 12 },

  prompt: { fontFamily: F.display, fontSize: 15, fontWeight: "700", color: C.ink, marginTop: 6 },

  opt: { paddingHorizontal: 12, paddingVertical: 10, borderRadius: radius.lg, borderWidth: 2, borderColor: C.slate[200], backgroundColor: C.white, marginTop: 8 },
  optActive: { borderColor: C.brand[500], backgroundColor: C.brand[50] },
  optText: { color: C.ink, fontFamily: F.sans, fontSize: 13, fontWeight: "600" },

  tfBtn: { flex: 1, paddingVertical: 14, borderRadius: radius.lg, alignItems: "center", borderWidth: 2, borderColor: C.slate[200] },
  tfText: { fontFamily: F.display, fontSize: 16, fontWeight: "800", color: C.ink },

  bigScore: { fontFamily: F.display, fontSize: 44, fontWeight: "800" },

  submit: { backgroundColor: C.brand[600], borderRadius: radius.lg, paddingVertical: 14, alignItems: "center" },
  submitText: { color: C.white, fontFamily: F.sans, fontWeight: "800", fontSize: 15 },

  expl: { fontFamily: F.sans, fontSize: 12, color: C.slate[500], marginTop: 6 },
});
