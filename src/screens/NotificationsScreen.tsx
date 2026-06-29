import { useCallback, useEffect, useState } from "react";
import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { api } from "../api";
import { IBack } from "../components/Icons";
import Pill from "../components/Pill";
import TopBar from "../components/TopBar";
import { C, F, radius, shadow } from "../theme";

const TYPE_TONE: Record<string, "brand" | "amber" | "grass" | "rose" | "sky"> = {
  overload: "rose", replan: "sky", reminder: "amber", season: "brand", system: "brand", league_up: "grass",
};

export default function NotificationsScreen({ navigation }: any) {
  const [items, setItems] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const refresh = useCallback(async () => {
    try { setItems(await api<any[]>("/notifications")); } catch {}
  }, []);
  useEffect(() => { refresh(); }, [refresh]);

  async function markAll() { await api("/notifications/read-all", { method: "POST" }); refresh(); }

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <TopBar title="Notifications" onBell={() => {}} />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, gap: 10, paddingBottom: 80 }}
        refreshControl={<RefreshControl refreshing={refreshing} tintColor={C.brand[500]}
                                         onRefresh={async () => { setRefreshing(true); await refresh(); setRefreshing(false); }} />}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Pressable onPress={() => navigation.goBack()} style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <IBack /><Text style={{ color: C.slate[500], fontFamily: F.sans, fontWeight: "700" }}>Back</Text>
          </Pressable>
          <Pressable onPress={markAll}>
            <Text style={{ color: C.brand[600], fontFamily: F.sans, fontWeight: "800" }}>Mark all read</Text>
          </Pressable>
        </View>
        {items.map((n) => (
          <Pressable
            key={n.id}
            onPress={() => api(`/notifications/${n.id}/read`, { method: "POST" }).then(refresh)}
            style={[styles.card, !n.read_at && { borderColor: C.brand[300], borderWidth: 1.5 }]}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 4 }}>
              <Pill tone={TYPE_TONE[n.type] ?? "brand"}>{n.type}</Pill>
              <Text style={styles.when}>{new Date(n.created_at).toLocaleString()}</Text>
            </View>
            <Text style={styles.title}>{n.title}</Text>
            {!!n.body && <Text style={styles.body}>{n.body}</Text>}
          </Pressable>
        ))}
        {items.length === 0 && <Text style={styles.dim}>Nothing yet — all quiet.</Text>}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: C.white, borderRadius: radius.lg, padding: 14, ...shadow.card },
  title: { fontFamily: F.display, fontSize: 15, fontWeight: "800", color: C.ink },
  body:  { fontFamily: F.sans, fontSize: 13, color: C.slate[600], marginTop: 4 },
  when:  { fontFamily: F.sans, fontSize: 10, color: C.slate[400], marginLeft: "auto" },
  dim:   { color: C.slate[400], textAlign: "center", padding: 24, fontFamily: F.sans },
});
