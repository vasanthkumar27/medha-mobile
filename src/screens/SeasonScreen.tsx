import { useCallback, useEffect, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { api } from "../api";
import Btn3d from "../components/Btn3d";
import { IBack, ITrophy } from "../components/Icons";
import Pill from "../components/Pill";
import TopBar from "../components/TopBar";
import { C, F, radius, shadow } from "../theme";

export default function SeasonScreen({ navigation }: any) {
  const [state, setState] = useState<any>(null);
  const [lb, setLb] = useState<any>(null);

  const refresh = useCallback(async () => {
    try {
      const [p, l] = await Promise.all([api<any>("/seasons/pass"), api<any>("/seasons/leaderboard")]);
      setState(p); setLb(l);
    } catch {}
  }, []);
  useEffect(() => { refresh(); }, [refresh]);

  if (!state) return <View style={{ flex: 1, backgroundColor: C.bg }} />;
  const { season, is_premium, season_xp, tiers } = state;

  async function buy() {
    await api("/seasons/pass/purchase", { method: "POST" });
    Alert.alert("Season Pass active", "Premium perks unlocked — themes, freezes, pro analytics.");
    refresh();
  }

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <TopBar title={season.name} onBell={() => navigation.navigate("Notifications")} />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 80 }}>
        <Pressable onPress={() => navigation.goBack()} style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <IBack /><Text style={{ color: C.slate[500], fontFamily: F.sans, fontWeight: "700" }}>Back</Text>
        </Pressable>

        <View style={styles.heroCard}>
          <Pill tone="amber" style={{ alignSelf: "flex-start" }}>{season.theme}</Pill>
          <Text style={styles.heroTitle}>{season.name}</Text>
          <Text style={styles.heroSub}>Season XP: <Text style={{ color: C.amber[300] }}>{season_xp}</Text></Text>
          {is_premium ? (
            <Pill tone="amber" style={{ marginTop: 8, alignSelf: "flex-start" }}>★ Pass active</Pill>
          ) : (
            <View style={{ marginTop: 8 }}>
              <Btn3d label="Get Season Pass" variant="amber" onPress={buy} icon={<ITrophy color={C.white} />} />
            </View>
          )}
          <Text style={{ color: "rgba(255,255,255,.6)", fontSize: 10, marginTop: 6, fontFamily: F.sans }}>
            Perks only — learning is never pay-to-win.
          </Text>
        </View>

        <Text style={styles.h2}>Pass tiers</Text>
        {tiers.map((t: any) => {
          const unlocked = season_xp >= t.xp_required;
          return (
            <View key={t.tier} style={[styles.tierCard, !unlocked && { opacity: 0.55 }]}>
              <View style={[styles.tierBubble, !unlocked && { backgroundColor: C.slate[100] }]}>
                <Text style={[styles.tierNum, !unlocked && { color: C.slate[400] }]}>{t.tier}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.tierXp}>{t.xp_required} XP</Text>
                <Text style={styles.tierFree}>Free: {t.free_reward?.label}</Text>
                <Text style={styles.tierPass}>Pass: {t.premium_reward?.label}</Text>
              </View>
            </View>
          );
        })}

        <Text style={styles.h2}>Leaderboard</Text>
        {lb?.top?.map((r: any) => (
          <View key={r.user_id} style={[styles.lbRow, r.rank <= 3 && { backgroundColor: C.amber[50] }]}>
            <Text style={[styles.lbRank, r.rank <= 3 && { color: C.amber[600] }]}>{r.rank}</Text>
            <Text style={styles.lbName}>{r.name}</Text>
            <Text style={styles.lbXp}>{r.xp} XP</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  heroCard: { backgroundColor: C.brand[700], borderRadius: radius["2xl"], padding: 18, ...shadow.soft },
  heroTitle: { color: C.white, fontFamily: F.display, fontSize: 22, fontWeight: "800", marginTop: 6 },
  heroSub:   { color: "rgba(255,255,255,.8)", fontFamily: F.sans, fontSize: 13, marginTop: 2 },

  h2: { fontFamily: F.display, fontSize: 17, fontWeight: "800", color: C.ink, marginTop: 4 },

  tierCard: { flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: C.white, padding: 12, borderRadius: radius.lg, ...shadow.card },
  tierBubble: { width: 42, height: 42, borderRadius: 12, backgroundColor: C.brand[50], alignItems: "center", justifyContent: "center" },
  tierNum: { fontFamily: F.display, fontSize: 18, fontWeight: "800", color: C.brand[700] },
  tierXp:  { fontFamily: F.sans, fontSize: 11, color: C.slate[400], fontWeight: "700", letterSpacing: 0.5 },
  tierFree: { fontFamily: F.sans, fontSize: 13, color: C.ink, fontWeight: "600", marginTop: 2 },
  tierPass: { fontFamily: F.sans, fontSize: 12, color: C.amber[700], fontWeight: "700", marginTop: 2 },

  lbRow: { flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: C.white, padding: 12, borderRadius: radius.lg, ...shadow.card },
  lbRank: { width: 22, fontFamily: F.display, fontSize: 16, fontWeight: "800", color: C.slate[400] },
  lbName: { flex: 1, fontFamily: F.sans, fontWeight: "700", color: C.ink },
  lbXp:   { fontFamily: F.sans, fontWeight: "800", color: C.slate[500], fontSize: 12 },
});
