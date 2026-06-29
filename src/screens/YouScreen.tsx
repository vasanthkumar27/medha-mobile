import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Polygon } from "react-native-svg";
import { api } from "../api";
import { IBolt, IDiamond, IFlame, IHeart, ITrophy } from "../components/Icons";
import Pill from "../components/Pill";
import TopBar from "../components/TopBar";
import { useAuth } from "../store";
import { C, F, radius, shadow } from "../theme";

interface Mastery { key: string; name: string; mastery: number; }
interface KGraph {
  nodes: { id: string; label: string; mastery: number; size: number }[];
  links: { source: string; target: string }[];
}

export default function YouScreen({ navigation }: any) {
  const me = useAuth((s) => s.me);
  const eco = useAuth((s) => s.economy);
  const [mastery, setMastery] = useState<Mastery[]>([]);
  const [kg, setKg] = useState<KGraph | null>(null);

  useEffect(() => {
    api<Mastery[]>("/analytics/mastery").then(setMastery).catch(() => {});
    api<KGraph>("/analytics/knowledge").then(setKg).catch(() => {});
  }, []);

  function logout() { useAuth.getState().logout(); }

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <TopBar title="You" onBell={() => navigation.navigate("Notifications")} />
      <ScrollView contentContainerStyle={{ padding: 14, paddingBottom: 120, gap: 12 }}>
        <View style={styles.headerCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarLetter}>{(me?.name ?? "?").slice(0, 1).toUpperCase()}</Text>
          </View>
          <Text style={styles.name}>{me?.name}</Text>
          <Text style={styles.email}>{me?.email}</Text>
          <Pill tone="brand">Level {eco?.level ?? 1} · {eco?.league ?? "Bronze"} League</Pill>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}><IFlame /><Text style={styles.statNum}>{eco?.streak ?? 0}</Text><Text style={styles.statLbl}>Streak</Text></View>
          <View style={styles.statCard}><IBolt /><Text style={styles.statNum}>{(eco?.xp ?? 0).toLocaleString()}</Text><Text style={styles.statLbl}>XP</Text></View>
          <View style={styles.statCard}><IDiamond /><Text style={styles.statNum}>{eco?.gems ?? 0}</Text><Text style={styles.statLbl}>Gems</Text></View>
          <View style={styles.statCard}><IHeart /><Text style={styles.statNum}>{eco?.hearts ?? 0}</Text><Text style={styles.statLbl}>Hearts</Text></View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Mastery radar</Text>
          {mastery.length > 0 ? <Radar rows={mastery} /> : <Text style={styles.dim}>Loading…</Text>}
          <View style={{ gap: 6, marginTop: 12 }}>
            {mastery.map((r) => (
              <View key={r.key} style={styles.bar}>
                <Text style={styles.barLbl} numberOfLines={1}>{r.name}</Text>
                <View style={styles.barTrack}>
                  <View style={[styles.barFill, { width: `${r.mastery}%` }]} />
                </View>
                <Text style={styles.barNum}>{r.mastery}%</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Knowledge graph</Text>
          {kg ? <KnowledgeGraph data={kg} /> : <Text style={styles.dim}>Loading…</Text>}
        </View>

        <Pressable onPress={() => navigation.navigate("Season")} style={styles.actionBtn}>
          <ITrophy color={C.amber[600]} />
          <Text style={styles.actionText}>Season pass & leaderboard</Text>
        </Pressable>
        <Pressable onPress={() => navigation.navigate("Onboarding")} style={styles.actionBtn}>
          <Text style={styles.actionText}>Re-run onboarding</Text>
        </Pressable>
        <Pressable onPress={logout} style={[styles.actionBtn, { backgroundColor: C.rose[50] }]}>
          <Text style={[styles.actionText, { color: C.rose[600] }]}>Log out</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

function Radar({ rows }: { rows: Mastery[] }) {
  const points = rows.slice(0, 8);
  const cx = 130, cy = 130, R = 100;
  const path = points.map((row, i) => {
    const a = (i / points.length) * Math.PI * 2 - Math.PI / 2;
    const r = (row.mastery / 100) * R;
    return `${cx + Math.cos(a) * r},${cy + Math.sin(a) * r}`;
  }).join(" ");
  return (
    <Svg width="100%" height={260} viewBox="0 0 260 260">
      {[0.25, 0.5, 0.75, 1].map((s) => (
        <Circle key={s} cx={cx} cy={cy} r={R * s} fill="none" stroke={C.slate[200]} />
      ))}
      <Polygon points={path} fill="rgba(91,75,214,.22)" stroke={C.brand[600]} strokeWidth={2} />
    </Svg>
  );
}

function KnowledgeGraph({ data }: { data: KGraph }) {
  const W = 320, H = 240, cx = W / 2, cy = H / 2;
  const pos: Record<string, { x: number; y: number }> = { ROOT: { x: cx, y: cy } };
  const subs = data.nodes.filter((n) => n.id.startsWith("S"));
  subs.forEach((s, i) => {
    const a = (i / subs.length) * Math.PI * 2 - Math.PI / 2;
    pos[s.id] = { x: cx + Math.cos(a) * 80, y: cy + Math.sin(a) * 75 };
  });
  return (
    <Svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`}>
      {data.links
        .filter((l) => pos[l.source] && pos[l.target])
        .map((l, i) => {
          const a = pos[l.source]; const b = pos[l.target];
          return <Circle key={"l" + i} cx={(a.x + b.x) / 2} cy={(a.y + b.y) / 2} r={1.5} fill={C.slate[200]} />;
        })}
      <Circle cx={cx} cy={cy} r={16} fill={C.brand[600]} />
      {subs.map((s) => {
        const p = pos[s.id];
        const c = s.mastery >= 70 ? C.green[500] : s.mastery >= 45 ? C.brand[500] : s.mastery >= 25 ? C.amber[500] : C.rose[500];
        return <Circle key={s.id} cx={p.x} cy={p.y} r={9 + s.mastery / 12} fill={c} opacity={0.9} />;
      })}
    </Svg>
  );
}

const styles = StyleSheet.create({
  headerCard: { backgroundColor: C.white, borderRadius: radius["2xl"], padding: 18, alignItems: "center", gap: 6, ...shadow.card },
  avatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: C.brand[100], alignItems: "center", justifyContent: "center" },
  avatarLetter: { fontFamily: F.display, fontSize: 28, fontWeight: "800", color: C.brand[700] },
  name: { fontFamily: F.display, fontSize: 18, fontWeight: "800", color: C.ink, marginTop: 4 },
  email: { fontFamily: F.sans, fontSize: 12, color: C.slate[400] },

  statsRow: { flexDirection: "row", gap: 8 },
  statCard: { flex: 1, backgroundColor: C.white, borderRadius: radius.lg, padding: 10, alignItems: "center", ...shadow.card },
  statNum: { fontFamily: F.display, fontSize: 16, fontWeight: "800", color: C.ink, marginTop: 4 },
  statLbl: { fontFamily: F.sans, fontSize: 10, color: C.slate[400], fontWeight: "700", textTransform: "uppercase" },

  card: { backgroundColor: C.white, borderRadius: radius["2xl"], padding: 14, ...shadow.card },
  cardTitle: { fontFamily: F.display, fontSize: 16, fontWeight: "800", color: C.ink, marginBottom: 10 },
  dim: { color: C.slate[400], fontFamily: F.sans, textAlign: "center", padding: 16 },

  bar: { flexDirection: "row", alignItems: "center", gap: 10 },
  barLbl: { width: 100, fontFamily: F.sans, fontSize: 11, color: C.slate[600] },
  barTrack: { flex: 1, height: 6, borderRadius: 99, backgroundColor: C.slate[100], overflow: "hidden" },
  barFill: { height: "100%", backgroundColor: C.brand[600] },
  barNum: { width: 36, textAlign: "right", fontFamily: F.sans, fontSize: 11, fontWeight: "800", color: C.slate[700] },

  actionBtn: {
    flexDirection: "row", alignItems: "center", gap: 10,
    backgroundColor: C.white, borderRadius: radius.lg, padding: 14, ...shadow.card,
  },
  actionText: { flex: 1, fontFamily: F.sans, fontWeight: "700", color: C.ink, fontSize: 14 },
});
