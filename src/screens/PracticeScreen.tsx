import { useCallback, useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { api } from "../api";
import { ICards, ITrophy } from "../components/Icons";
import Mascot from "../components/Mascot";
import Pill from "../components/Pill";
import TopBar from "../components/TopBar";
import { useToast } from "../components/Toast";
import { C, F, radius, shadow } from "../theme";

const GRADES = [
  { key: "again", label: "Again", tone: "rose", hint: "< 10m" },
  { key: "hard",  label: "Hard",  tone: "amber", hint: "slow" },
  { key: "good",  label: "Good",  tone: "brand", hint: "today" },
  { key: "easy",  label: "Easy",  tone: "grass", hint: "fast" },
] as const;

const TONE_BG: Record<string, string> = {
  rose: C.rose[50], amber: C.amber[50], brand: C.brand[50], grass: C.green[50],
};
const TONE_FG: Record<string, string> = {
  rose: C.rose[600], amber: C.amber[700], brand: C.brand[700], grass: C.green[700],
};

export default function PracticeScreen({ navigation }: any) {
  const toast = useToast();
  const [tab, setTab] = useState<"cards" | "quiz">("cards");
  const [due, setDue] = useState<any[]>([]);
  const [flipped, setFlipped] = useState(false);
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(async () => {
    try { setDue(await api<any[]>("/learning/due?limit=30")); } catch {}
  }, []);
  useEffect(() => { refresh(); }, [refresh]);

  const current = due[0];

  async function grade(g: string) {
    if (!current) return;
    setBusy(true);
    try {
      await api(`/learning/reviews/${current.review_id}`, { method: "POST", body: { grade: g } });
      setFlipped(false);
      setDue((d) => d.slice(1));
    } catch { toast("Couldn't reach server.", "error"); }
    finally { setBusy(false); }
  }

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <TopBar title="Practice" onBell={() => navigation.navigate("Notifications")} />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 120, gap: 12 }}>
        <View style={styles.tabsRow}>
          <Pressable onPress={() => setTab("cards")}
                     style={[styles.tabBtn, tab === "cards" && styles.tabBtnActive]}>
            <ICards size={16} color={tab === "cards" ? C.brand[600] : C.slate[400]} />
            <Text style={[styles.tabLabel, { color: tab === "cards" ? C.brand[600] : C.slate[500] }]}>Flashcards</Text>
          </Pressable>
          <Pressable onPress={() => setTab("quiz")}
                     style={[styles.tabBtn, tab === "quiz" && styles.tabBtnActive]}>
            <ITrophy size={16} color={tab === "quiz" ? C.brand[600] : C.slate[400]} />
            <Text style={[styles.tabLabel, { color: tab === "quiz" ? C.brand[600] : C.slate[500] }]}>Quick quiz</Text>
          </Pressable>
        </View>

        <Pill tone="slate">
          {due.length} card{due.length === 1 ? "" : "s"} due · SM-2 scheduling
        </Pill>

        {tab === "cards" && (
          current ? (
            <>
              <Pressable style={styles.cardFace} onPress={() => setFlipped((f) => !f)}>
                <Pill tone={flipped ? "grass" : "brand"}>{flipped ? "Answer" : "Question"}</Pill>
                <Text style={styles.face}>{flipped ? current.card.back : current.card.front}</Text>
                {!flipped && <Text style={styles.hint}>tap to flip</Text>}
              </Pressable>
              {flipped && (
                <View style={{ flexDirection: "row", gap: 8 }}>
                  {GRADES.map((g) => (
                    <Pressable
                      key={g.key} disabled={busy}
                      onPress={() => grade(g.key)}
                      style={[styles.grade, { backgroundColor: TONE_BG[g.tone] }]}>
                      <Text style={[styles.gradeLabel, { color: TONE_FG[g.tone] }]}>{g.label}</Text>
                      <Text style={[styles.gradeHint,  { color: TONE_FG[g.tone] }]}>{g.hint}</Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </>
          ) : (
            <View style={[styles.cardFace, { alignItems: "center" }]}>
              <Mascot pose="cheer" size={100} />
              <Text style={[styles.face, { color: C.green[700], marginTop: 6 }]}>All caught up</Text>
              <Text style={styles.hint}>Spacing is the magic — come back later.</Text>
            </View>
          )
        )}

        {tab === "quiz" && (
          <View style={[styles.cardFace, { alignItems: "center" }]}>
            <Mascot pose="think" size={100} />
            <Text style={[styles.face, { marginTop: 6 }]}>Quick quiz</Text>
            <Text style={styles.hint}>Try a topic test from Tests — they're tuned for short, intense sprints.</Text>
            <Pressable onPress={() => navigation.navigate("Tests")}
                       style={styles.cta}>
              <Text style={styles.ctaText}>Open Tests →</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  tabsRow: {
    flexDirection: "row", gap: 6, padding: 4, alignSelf: "flex-start",
    backgroundColor: C.slate[100], borderRadius: 12,
  },
  tabBtn: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  tabBtnActive: { backgroundColor: C.white, ...shadow.card },
  tabLabel: { fontFamily: F.sans, fontWeight: "700", fontSize: 12 },

  cardFace: {
    backgroundColor: C.white, borderRadius: radius["2xl"], padding: 22,
    minHeight: 220, alignItems: "center", justifyContent: "center", gap: 10,
    ...shadow.card,
  },
  face: { fontFamily: F.display, fontSize: 20, fontWeight: "800", textAlign: "center", color: C.ink, marginTop: 6 },
  hint: { fontFamily: F.sans, fontSize: 12, color: C.slate[400] },

  grade: {
    flex: 1, borderRadius: radius.lg, paddingVertical: 12, alignItems: "center",
  },
  gradeLabel: { fontFamily: F.sans, fontSize: 14, fontWeight: "800" },
  gradeHint:  { fontFamily: F.sans, fontSize: 10, fontWeight: "700", opacity: 0.7, marginTop: 2 },

  cta: {
    backgroundColor: C.brand[600], borderRadius: radius.lg, paddingHorizontal: 16, paddingVertical: 10, marginTop: 8,
  },
  ctaText: { color: C.white, fontFamily: F.sans, fontWeight: "800" },
});
