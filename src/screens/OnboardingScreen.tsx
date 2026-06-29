import { useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { api } from "../api";
import Btn3d from "../components/Btn3d";
import { ISparkle } from "../components/Icons";
import Mascot from "../components/Mascot";

const LOGO_MARK = require("../../assets/medha-icon.png");
import { useToast } from "../components/Toast";
import { useAuth } from "../store";
import { C, F, radius, shadow } from "../theme";

const GOALS = [
  { id: "GATE CS",        emoji: "🎓", title: "GATE CS 2026" },
  { id: "Placement Prep", emoji: "💼", title: "Placement Prep" },
  { id: "Internship",     emoji: "🚀", title: "Internship Hunt" },
  { id: "Custom",         emoji: "✨", title: "Something else" },
];
const LEVELS = ["Beginner", "Intermediate", "Advanced"] as const;
const HOURS = [1, 1.5, 2, 2.5, 3, 4, 5];
const TARGETS = ["3 months", "6 months", "9 months", "12 months", "Custom"];

export default function OnboardingScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const toast = useToast();
  const [step, setStep] = useState(1);
  const [goalPick, setGoalPick] = useState("GATE CS");
  const [customGoal, setCustomGoal] = useState("");
  const [level, setLevel] = useState<(typeof LEVELS)[number]>("Intermediate");
  const [hours, setHours] = useState(2);
  const [target, setTarget] = useState("6 months");
  const [building, setBuilding] = useState(false);
  const setMe = useAuth((s) => s.setMe);

  async function finish() {
    setBuilding(true);
    try {
      const goal = goalPick === "Custom" ? (customGoal || "My learning journey") : goalPick;
      const me = await api("/me/onboarding", {
        method: "POST",
        body: { goal, level, hours_per_day: hours, target_date_label: target, weeks: 12 },
      });
      setMe(me as any);
      toast("Roadmap ready!", "success");
      navigation.replace("Main");
    } catch {
      toast("Couldn't complete onboarding.", "error");
    } finally { setBuilding(false); }
  }

  return (
    <View style={[styles.host, { paddingTop: insets.top + 14, paddingBottom: insets.bottom }]}>
      <View style={styles.headerRow}>
        <Image source={LOGO_MARK} style={styles.headerLogo} />
        <Text style={styles.headerBrand}>Medha</Text>
        <Text style={styles.headerStep}>Step {step} / 5</Text>
      </View>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${step * 20}%` }]} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 18, paddingBottom: 140, gap: 12 }}>
        {step === 1 && (
          <>
            <Text style={styles.title}>What are you preparing for?</Text>
            <Text style={styles.sub}>Pick a goal — we'll build the roadmap around it.</Text>
            {GOALS.map((g) => (
              <Pressable key={g.id} onPress={() => setGoalPick(g.id)}
                         style={[styles.card, goalPick === g.id && styles.cardActive]}>
                <Text style={{ fontSize: 26 }}>{g.emoji}</Text>
                <Text style={styles.cardTitle}>{g.title}</Text>
              </Pressable>
            ))}
            {goalPick === "Custom" && (
              <TextInput placeholder="e.g. Rust systems, ML interviews…"
                         placeholderTextColor={C.slate[400]}
                         value={customGoal} onChangeText={setCustomGoal}
                         style={styles.input} />
            )}
          </>
        )}

        {step === 2 && (
          <>
            <Text style={styles.title}>How are you placed right now?</Text>
            <Text style={styles.sub}>Pick honestly — Medha won't judge.</Text>
            {LEVELS.map((l) => (
              <Pressable key={l} onPress={() => setLevel(l)}
                         style={[styles.card, level === l && styles.cardActive]}>
                <Text style={styles.cardTitle}>{l}</Text>
              </Pressable>
            ))}
          </>
        )}

        {step === 3 && (
          <>
            <Text style={styles.title}>How much can you study per day?</Text>
            <Text style={styles.sub}>Be realistic — Medha adapts.</Text>
            <View style={styles.row}>
              {HOURS.map((h) => (
                <Pressable key={h} onPress={() => setHours(h)}
                           style={[styles.pill, hours === h && styles.pillActive]}>
                  <Text style={[styles.pillText, hours === h && { color: C.brand[700] }]}>{h}h</Text>
                </Pressable>
              ))}
            </View>
          </>
        )}

        {step === 4 && (
          <>
            <Text style={styles.title}>When do you want to be ready?</Text>
            <Text style={styles.sub}>Stretch or sprint — pick a horizon.</Text>
            <View style={styles.row}>
              {TARGETS.map((t) => (
                <Pressable key={t} onPress={() => setTarget(t)}
                           style={[styles.pill, target === t && styles.pillActive]}>
                  <Text style={[styles.pillText, target === t && { color: C.brand[700] }]}>{t}</Text>
                </Pressable>
              ))}
            </View>
          </>
        )}

        {step === 5 && (
          <View style={{ alignItems: "center", paddingTop: 8 }}>
            <Mascot pose={building ? "think" : "cheer"} size={150} />
            <Text style={[styles.title, { textAlign: "center" }]}>
              {building ? "Building your roadmap…" : "Ready to launch?"}
            </Text>
            <Text style={[styles.sub, { textAlign: "center" }]}>
              {building
                ? "Picking subjects, balancing your day, seeding reviews."
                : "We'll generate a 12-week plan with daily tasks, mocks and reviews."}
            </Text>
          </View>
        )}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: 10 + insets.bottom }]}>
        {step < 5 ? (
          <View style={{ flexDirection: "row", gap: 10 }}>
            {step > 1 && (
              <Btn3d label="Back" variant="white" onPress={() => setStep(step - 1)} style={{ flex: 1 }} />
            )}
            <Btn3d label="Continue" variant="brand" onPress={() => setStep(step + 1)} style={{ flex: 2 }} />
          </View>
        ) : (
          <Btn3d label="Launch Medha" variant="grass" onPress={finish}
                 loading={building}
                 icon={<ISparkle color={C.white} />} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  host: { flex: 1, backgroundColor: C.bg },
  headerRow: { flexDirection: "row", alignItems: "center", paddingHorizontal: 18, paddingBottom: 12, gap: 10 },
  headerLogo: { width: 34, height: 34, borderRadius: 9 },
  headerBrand: { fontFamily: F.display, fontSize: 20, fontWeight: "800", color: C.ink, flex: 1, letterSpacing: -0.3 },
  headerStep: { fontFamily: F.sans, fontSize: 11, color: C.slate[400], fontWeight: "800", textTransform: "uppercase", letterSpacing: 0.6 },
  progressTrack: { height: 8, marginHorizontal: 18, marginTop: 2, borderRadius: 99, backgroundColor: C.slate[200], overflow: "hidden" },
  progressFill:  { height: "100%", backgroundColor: C.brand[600] },

  title: { fontFamily: F.display, fontSize: 22, fontWeight: "800", color: C.ink, marginBottom: 4 },
  sub: { fontFamily: F.sans, fontSize: 13, color: C.slate[500], marginBottom: 12 },

  card: { backgroundColor: C.white, borderRadius: radius.lg, padding: 14, borderWidth: 2, borderColor: C.slate[200], ...shadow.card },
  cardActive: { borderColor: C.brand[500], backgroundColor: C.brand[50] },
  cardTitle: { fontFamily: F.display, fontSize: 15, fontWeight: "800", color: C.ink, marginTop: 4 },

  input: {
    backgroundColor: C.white, borderRadius: radius.lg, padding: 12, fontFamily: F.sans, fontSize: 14,
    borderWidth: 2, borderColor: C.slate[200], color: C.ink, marginTop: 4,
  },

  row: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  pill: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: radius.lg, borderWidth: 2, borderColor: C.slate[200], backgroundColor: C.white },
  pillActive: { borderColor: C.brand[500], backgroundColor: C.brand[50] },
  pillText: { fontFamily: F.sans, fontWeight: "800", color: C.slate[600] },

  footer: { position: "absolute", left: 0, right: 0, bottom: 0, backgroundColor: C.white, padding: 14, borderTopColor: C.slate[100], borderTopWidth: 1 },
});
