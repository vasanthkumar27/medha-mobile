import { useCallback, useEffect, useState } from "react";
import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { api } from "../api";
import { ICheck, ILock } from "../components/Icons";
import Mascot from "../components/Mascot";
import Pill from "../components/Pill";
import TopBar from "../components/TopBar";
import { useAuth } from "../store";
import { C, F, radius, shadow } from "../theme";

interface LessonItem { id: number; title: string; order: number; state: "locked" | "now" | "done" }
interface UnitItem {
  id: number; key: string; title: string; sub: string; topic: string | null;
  order: number; lessons: LessonItem[]; state: "locked" | "now" | "done";
}

const STATE_TONE: Record<string, { bg: string; fg: string }> = {
  done:   { bg: C.amber[500], fg: C.white },
  now:    { bg: C.brand[600], fg: C.white },
  locked: { bg: C.slate[200], fg: C.slate[400] },
};

export default function LearnScreen({ navigation }: any) {
  const [units, setUnits] = useState<UnitItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const me = useAuth((s) => s.me);

  const fetchUnits = useCallback(async () => {
    try {
      const data = await api<UnitItem[]>("/lessons/units");
      setUnits(data);
    } catch { /* network */ }
  }, []);

  useEffect(() => {
    if (me && !me.onboarding_done) navigation.replace("Onboarding");
  }, [me, navigation]);

  useEffect(() => { fetchUnits(); }, [fetchUnits]);

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <TopBar onBell={() => navigation.navigate("Notifications")} />
      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
        refreshControl={<RefreshControl refreshing={refreshing}
                                         tintColor={C.brand[600]}
                                         onRefresh={async () => { setRefreshing(true); await fetchUnits(); setRefreshing(false); }} />}>
        <View style={styles.heroCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.heroLabel}>Today's quest</Text>
            <Text style={styles.heroTitle}>Pick up where you left off</Text>
            <Text style={styles.heroSub}>Tap the glowing node — it's just 5 minutes of progress.</Text>
          </View>
          <Mascot pose="greet" size={92} />
        </View>

        {units.length === 0 && (
          <Text style={{ color: C.slate[500], textAlign: "center", padding: 24, fontFamily: F.sans }}>
            Loading your learning path…
          </Text>
        )}

        {units.map((u) => (
          <View key={u.id} style={styles.unitBlock}>
            <View style={styles.unitHead}>
              <View style={{ flex: 1 }}>
                <Text style={styles.unitTitle}>{u.title}</Text>
                <Text style={styles.unitSub}>{u.sub}</Text>
              </View>
              <Pill tone={u.state === "done" ? "grass" : u.state === "now" ? "brand" : "slate"}>
                {u.state}
              </Pill>
            </View>

            <View style={styles.path}>
              {u.lessons.map((l, idx) => {
                const tone = STATE_TONE[l.state];
                const offset = (idx % 2 === 0 ? -1 : 1) * 36;
                const Locked = l.state === "locked";
                return (
                  <Pressable
                    key={l.id}
                    disabled={Locked}
                    onPress={() => navigation.navigate("Lesson", { lessonId: l.id, title: l.title })}
                    style={[styles.node, {
                      backgroundColor: tone.bg,
                      transform: [{ translateX: offset }],
                      opacity: Locked ? 0.7 : 1,
                    }]}
                  >
                    {Locked ? (
                      <ILock size={22} color={tone.fg} />
                    ) : l.state === "done" ? (
                      <ICheck size={20} color={tone.fg} />
                    ) : (
                      <Text style={{ color: tone.fg, fontWeight: "800", fontSize: 16, fontFamily: F.display }}>★</Text>
                    )}
                    <Text style={[styles.nodeLabel, { color: C.ink, transform: [{ translateX: -offset }] }]}>
                      {l.title}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    backgroundColor: C.brand[600],
    borderRadius: radius["2xl"],
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 14,
    ...shadow.soft,
  },
  heroLabel: { color: "rgba(255,255,255,.7)", fontSize: 11, fontFamily: F.sans, fontWeight: "700", letterSpacing: 1, textTransform: "uppercase" },
  heroTitle: { color: C.white, fontSize: 19, fontFamily: F.display, fontWeight: "800", marginTop: 4 },
  heroSub:   { color: "rgba(255,255,255,.75)", fontSize: 13, marginTop: 2, maxWidth: 200, fontFamily: F.sans },

  unitBlock: { marginTop: 14 },
  unitHead: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  unitTitle: { fontFamily: F.display, fontSize: 18, fontWeight: "800", color: C.ink },
  unitSub: { fontFamily: F.sans, fontSize: 12, color: C.slate[500], marginTop: 2 },

  path: { alignItems: "center", gap: 24 },
  node: {
    width: 72, height: 72, borderRadius: 36, alignItems: "center", justifyContent: "center",
    ...shadow.card,
  },
  nodeLabel: {
    position: "absolute", top: 78, fontSize: 11, fontFamily: F.sans, fontWeight: "700",
    textAlign: "center", maxWidth: 160,
  },
});
