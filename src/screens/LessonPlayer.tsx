import { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { api } from "../api";
import Btn3d from "../components/Btn3d";
import {
  ICheck, IClose, IHeart, ISparkle, ITrophy,
} from "../components/Icons";
import Mascot from "../components/Mascot";
import { useToast } from "../components/Toast";
import { useAuth } from "../store";
import { C, F, radius, shadow } from "../theme";

interface Session { id: number; order: number; kind: string; payload: any; }

export default function LessonPlayer({ route, navigation }: any) {
  const insets = useSafeAreaInsets();
  const toast = useToast();
  const lessonId = route.params?.lessonId as number;
  const title = (route.params?.title as string) ?? "Lesson";
  const [sessions, setSessions] = useState<Session[]>([]);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<any>(null);
  const [reveal, setReveal] = useState<null | { correct: boolean; expected: any }>(null);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [done, setDone] = useState<null | { xp: number; gems: number; hearts: number }>(null);
  const hearts = useAuth((s) => s.economy?.hearts ?? 5);

  useEffect(() => {
    api<{ sessions: Session[] }>(`/lessons/${lessonId}`)
      .then((r) => setSessions(r.sessions))
      .catch(() => {});
  }, [lessonId]);

  const session = sessions[idx];
  const progress = sessions.length ? Math.round(((idx + (reveal ? 1 : 0)) / sessions.length) * 100) : 0;

  async function submitAnswer() {
    if (!session || picked == null) return;
    try {
      const r = await api<{ correct: boolean; expected: any; hearts: number }>(
        `/lessons/${lessonId}/answer`, { method: "POST", body: { session_id: session.id, answer: picked } },
      );
      setReveal({ correct: r.correct, expected: r.expected });
      if (r.correct) setCorrect((c) => c + 1);
      else { setWrong((w) => w + 1); toast(`Missed it — heart down. ${r.hearts} left.`, "warn"); }
    } catch { toast("Couldn't reach server.", "error"); }
  }

  async function advance() {
    setReveal(null);
    setPicked(null);
    if (idx + 1 >= sessions.length) {
      try {
        const r = await api<{ ok: boolean; data: any }>(
          `/lessons/${lessonId}/complete`, { method: "POST", body: { correct, wrong } });
        setDone({ xp: r.data?.xp ?? 0, gems: r.data?.gems ?? 0, hearts: r.data?.hearts ?? hearts });
      } catch { /* ignore */ }
    } else setIdx((i) => i + 1);
  }

  if (!sessions.length) {
    return (
      <View style={[styles.host, { paddingTop: insets.top + 12 }]}>
        <Text style={styles.title}>{title}</Text>
        <Text style={{ color: C.slate[500], padding: 24, fontFamily: F.sans }}>Loading lesson…</Text>
      </View>
    );
  }

  if (done) {
    return (
      <View style={[styles.host, { paddingTop: insets.top + 12 }]}>
        <View style={styles.doneCard}>
          <Mascot pose="cheer" size={140} />
          <Text style={styles.doneTitle}>Lesson complete!</Text>
          <View style={styles.doneStats}>
            <View style={styles.doneStat}>
              <ITrophy size={20} color={C.amber[600]} />
              <Text style={styles.doneNum}>+{done.xp}</Text>
              <Text style={styles.doneLbl}>XP</Text>
            </View>
            <View style={styles.doneStat}>
              <ISparkle size={20} color={C.sky[600]} />
              <Text style={styles.doneNum}>+{done.gems}</Text>
              <Text style={styles.doneLbl}>Gems</Text>
            </View>
            <View style={styles.doneStat}>
              <IHeart size={20} color={C.rose[500]} />
              <Text style={styles.doneNum}>{done.hearts}</Text>
              <Text style={styles.doneLbl}>Hearts</Text>
            </View>
          </View>
          <Btn3d label="Continue learning" variant="brand" onPress={() => navigation.goBack()} />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.host, { paddingTop: insets.top + 8 }]}>
      <View style={styles.headerRow}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={10}>
          <IClose />
        </Pressable>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <View style={[styles.heartsPill]}>
          <IHeart size={14} color={C.rose[500]} />
          <Text style={styles.heartsTxt}>{hearts}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 18, paddingBottom: 200 }}>
        <Text style={styles.questionKind}>
          {session.kind === "teach" ? "LEARN" : session.kind.toUpperCase()} · Step {idx + 1}/{sessions.length}
        </Text>
        {session.kind !== "teach" && (
          <Text style={styles.question}>{session.payload?.q}</Text>
        )}

        {/* Teach card — actual lesson content */}
        {session.kind === "teach" && (
          <View style={styles.teachCard}>
            <Text style={styles.teachTitle}>{session.payload?.title}</Text>
            <Text style={styles.teachBody}>{session.payload?.body}</Text>
            {Array.isArray(session.payload?.key_points) && session.payload.key_points.length > 0 && (
              <View style={styles.keyPointsBox}>
                <Text style={styles.keyPointsLabel}>Key points</Text>
                {session.payload.key_points.map((p: string, i: number) => (
                  <View key={i} style={{ flexDirection: "row", gap: 8, marginTop: 6 }}>
                    <Text style={styles.keyBullet}>•</Text>
                    <Text style={styles.keyPointText}>{p}</Text>
                  </View>
                ))}
              </View>
            )}
            {!!session.payload?.example && (
              <View style={styles.exampleBox}>
                <Text style={styles.exampleLabel}>Example</Text>
                <Text style={styles.exampleText}>{session.payload.example}</Text>
              </View>
            )}
          </View>
        )}

        {/* MCQ */}
        {session.kind === "mcq" && session.payload?.options?.map((opt: string, oi: number) => (
          <Pressable
            key={oi}
            disabled={!!reveal}
            onPress={() => setPicked({ index: oi })}
            style={[styles.opt,
              picked?.index === oi && styles.optActive,
              reveal && oi === session.payload?.a && styles.optCorrect,
              reveal && picked?.index === oi && oi !== session.payload?.a && styles.optWrong,
            ]}>
            <Text style={styles.optText}>{opt}</Text>
          </Pressable>
        ))}

        {/* True / false */}
        {session.kind === "tf" && (
          <View style={{ flexDirection: "row", gap: 10, marginTop: 12 }}>
            {[{ v: true, lbl: "True" }, { v: false, lbl: "False" }].map((o) => (
              <Pressable
                key={o.lbl}
                disabled={!!reveal}
                onPress={() => setPicked({ value: o.v })}
                style={[styles.tfBtn,
                  picked?.value === o.v && styles.optActive,
                  reveal && o.v === session.payload?.a && styles.optCorrect,
                  reveal && picked?.value === o.v && o.v !== session.payload?.a && styles.optWrong,
                ]}>
                <Text style={styles.tfText}>{o.lbl}</Text>
              </Pressable>
            ))}
          </View>
        )}

        {/* Fill in the blank */}
        {session.kind === "fib" && (
          <View style={{ marginTop: 14 }}>
            <TextInput
              editable={!reveal}
              style={styles.input}
              placeholder="Type your answer…"
              placeholderTextColor={C.slate[400]}
              value={picked?.text ?? ""}
              onChangeText={(v) => setPicked({ text: v })}
            />
            {!!session.payload?.bank?.length && (
              <View style={styles.bank}>
                {session.payload.bank.map((b: string) => (
                  <Pressable
                    key={b}
                    onPress={() => setPicked({ text: b })}
                    style={[styles.bankChip, picked?.text === b && { backgroundColor: C.brand[600] }]}>
                    <Text style={[styles.bankText, picked?.text === b && { color: C.white }]}>{b}</Text>
                  </Pressable>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Self-graded recall */}
        {session.kind === "recall" && (
          <View style={{ marginTop: 14 }}>
            <Text style={{ color: C.slate[500], fontSize: 13, marginBottom: 10, fontFamily: F.sans }}>
              Try answering in your head, then tap Reveal to compare.
            </Text>
            {reveal && (
              <View style={styles.revealCard}>
                <Text style={styles.revealLabel}>Suggested answer</Text>
                <Text style={styles.revealText}>{String(session.payload?.a)}</Text>
              </View>
            )}
          </View>
        )}

        {reveal && (
          <View style={[styles.feedback, reveal.correct ? { backgroundColor: C.green[50] } : { backgroundColor: C.rose[50] }]}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <ICheck size={16} color={reveal.correct ? C.green[600] : C.rose[600]} />
              <Text style={[styles.feedbackTitle, { color: reveal.correct ? C.green[700] : C.rose[700] }]}>
                {reveal.correct ? "Spot on!" : "Not quite"}
              </Text>
            </View>
            {!!session.payload?.exp && (
              <Text style={styles.feedbackText}>{session.payload.exp}</Text>
            )}
          </View>
        )}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: 12 + insets.bottom }]}>
        {session.kind === "teach" ? (
          <Btn3d
            label={idx + 1 >= sessions.length ? "Finish" : "Got it — let's practice"}
            variant="brand"
            onPress={() => { setCorrect((c) => c + 1); advance(); }}
          />
        ) : !reveal ? (
          <Btn3d
            label={session.kind === "recall" ? "Reveal answer" : "Check"}
            variant={picked == null ? "disabled" : "grass"}
            onPress={session.kind === "recall"
              ? () => setReveal({ correct: true, expected: session.payload?.a })
              : submitAnswer}
            disabled={picked == null && session.kind !== "recall"}
          />
        ) : (
          <Btn3d label={idx + 1 >= sessions.length ? "Finish" : "Continue"} variant="brand" onPress={advance} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  host: { flex: 1, backgroundColor: C.bg },

  headerRow: { paddingHorizontal: 16, flexDirection: "row", alignItems: "center", gap: 12 },
  progressTrack: { flex: 1, height: 8, borderRadius: 99, backgroundColor: C.slate[200], overflow: "hidden" },
  progressFill:  { height: "100%", backgroundColor: C.brand[600] },
  heartsPill: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: C.rose[50], paddingHorizontal: 8, paddingVertical: 4, borderRadius: 99 },
  heartsTxt:  { color: C.rose[600], fontFamily: F.sans, fontWeight: "800", fontSize: 13 },

  questionKind: { fontFamily: F.sans, fontSize: 11, fontWeight: "700", color: C.slate[400], letterSpacing: 1, textTransform: "uppercase" },
  question: { fontFamily: F.display, fontSize: 22, fontWeight: "800", color: C.ink, marginTop: 6 },

  title: { fontFamily: F.display, fontSize: 18, fontWeight: "800", color: C.ink },

  teachCard: {
    marginTop: 10, backgroundColor: C.white, borderRadius: radius.xl,
    padding: 18, ...shadow.card,
  },
  teachTitle: { fontFamily: F.display, fontSize: 22, fontWeight: "800", color: C.ink },
  teachBody: { fontFamily: F.sans, fontSize: 15, color: C.slate[700], lineHeight: 22, marginTop: 10 },
  keyPointsBox: { marginTop: 14, padding: 12, backgroundColor: C.brand[50], borderRadius: radius.lg },
  keyPointsLabel: { fontFamily: F.sans, fontSize: 11, fontWeight: "800", color: C.brand[700], letterSpacing: 1, textTransform: "uppercase" },
  keyBullet: { fontFamily: F.display, fontSize: 16, fontWeight: "800", color: C.brand[700], lineHeight: 20 },
  keyPointText: { flex: 1, fontFamily: F.sans, fontSize: 14, color: C.slate[700], lineHeight: 20 },
  exampleBox: { marginTop: 12, padding: 12, backgroundColor: C.amber[50], borderRadius: radius.lg },
  exampleLabel: { fontFamily: F.sans, fontSize: 11, fontWeight: "800", color: C.amber[700], letterSpacing: 1, textTransform: "uppercase" },
  exampleText: { fontFamily: F.sans, fontSize: 14, color: C.slate[700], lineHeight: 20, marginTop: 4 },

  opt: {
    paddingHorizontal: 14, paddingVertical: 14, borderRadius: radius.lg,
    borderWidth: 2, borderColor: C.slate[200], backgroundColor: C.white, marginTop: 10,
  },
  optActive: { borderColor: C.brand[500], backgroundColor: C.brand[50] },
  optCorrect: { borderColor: C.green[500], backgroundColor: C.green[50] },
  optWrong:   { borderColor: C.rose[500],  backgroundColor: C.rose[50] },
  optText:    { color: C.ink, fontSize: 14, fontFamily: F.sans, fontWeight: "600" },

  tfBtn: {
    flex: 1, paddingVertical: 16, borderRadius: radius.lg, alignItems: "center",
    borderWidth: 2, borderColor: C.slate[200], backgroundColor: C.white,
  },
  tfText: { fontFamily: F.display, fontSize: 18, fontWeight: "800", color: C.ink },

  input: {
    backgroundColor: C.white, borderWidth: 2, borderColor: C.slate[200],
    borderRadius: radius.lg, paddingHorizontal: 14, paddingVertical: 12, fontFamily: F.sans, fontSize: 14, color: C.ink,
  },
  bank: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 10 },
  bankChip: {
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 99,
    backgroundColor: C.slate[100],
  },
  bankText: { fontFamily: F.sans, fontWeight: "700", color: C.slate[700] },

  revealCard: {
    backgroundColor: C.brand[50], borderRadius: radius.lg, padding: 14, marginTop: 8,
  },
  revealLabel: { fontFamily: F.sans, fontSize: 11, fontWeight: "700", color: C.brand[700], letterSpacing: 1, textTransform: "uppercase" },
  revealText:  { fontFamily: F.display, fontSize: 16, fontWeight: "700", color: C.ink, marginTop: 4 },

  feedback: { padding: 12, borderRadius: radius.lg, marginTop: 14 },
  feedbackTitle: { fontFamily: F.sans, fontSize: 13, fontWeight: "800" },
  feedbackText:  { color: C.slate[700], marginTop: 4, fontFamily: F.sans, fontSize: 13 },

  footer: {
    position: "absolute", left: 0, right: 0, bottom: 0,
    padding: 16, backgroundColor: C.white, borderTopColor: C.slate[100], borderTopWidth: 1,
    ...shadow.card,
  },

  doneCard: {
    flex: 1, alignItems: "center", padding: 24, gap: 14, justifyContent: "center",
  },
  doneTitle: { fontFamily: F.display, fontSize: 28, fontWeight: "800", color: C.ink, marginTop: 4 },
  doneStats: { flexDirection: "row", gap: 12, marginVertical: 14 },
  doneStat: { alignItems: "center", padding: 14, borderRadius: radius.lg, backgroundColor: C.white, minWidth: 86, ...shadow.card },
  doneNum: { fontFamily: F.display, fontSize: 22, fontWeight: "800", color: C.ink, marginTop: 4 },
  doneLbl: { fontFamily: F.sans, fontSize: 11, fontWeight: "700", color: C.slate[400], textTransform: "uppercase" },
});
