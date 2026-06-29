import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../store";
import { C, F } from "../theme";
import { IBell, IDiamond, IFlame, IHeart } from "./Icons";

const LOGO_MARK = require("../../assets/medha-icon.png");

export default function TopBar({
  title,
  onBell,
}: {
  title?: string;
  onBell?: () => void;
}) {
  const insets = useSafeAreaInsets();
  const eco = useAuth((s) => s.economy);
  return (
    <View style={[styles.host, { paddingTop: insets.top + 6 }]}>
      <View style={styles.row}>
        {title ? (
          <Text style={styles.title}>{title}</Text>
        ) : (
          <View style={styles.brandRow}>
            <Image source={LOGO_MARK} style={styles.brandLogo} />
            <Text style={styles.brand}>Medha</Text>
          </View>
        )}
        <View style={styles.right}>
          <View style={[styles.pill, { backgroundColor: C.amber[50] }]}>
            <IFlame size={14} color={C.amber[600]} />
            <Text style={[styles.pillText, { color: C.amber[700] }]}>{eco?.streak ?? 0}</Text>
          </View>
          <View style={[styles.pill, { backgroundColor: C.sky[50] }]}>
            <IDiamond size={14} color={C.sky[600]} />
            <Text style={[styles.pillText, { color: C.sky[600] }]}>{eco?.gems ?? 0}</Text>
          </View>
          <View style={[styles.pill, { backgroundColor: C.rose[50] }]}>
            <IHeart size={14} color={C.rose[600]} />
            <Text style={[styles.pillText, { color: C.rose[600] }]}>{eco?.hearts ?? 0}</Text>
          </View>
          <Pressable onPress={onBell} hitSlop={10} style={{ marginLeft: 4 }}>
            <IBell size={20} color={C.slate[500]} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  host: { backgroundColor: C.white, paddingHorizontal: 16, paddingBottom: 10,
          borderBottomColor: C.slate[100], borderBottomWidth: 1 },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  brandRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  brandLogo: { width: 30, height: 30, borderRadius: 8 },
  brand: { fontFamily: F.display, fontSize: 22, fontWeight: "800", color: C.ink, letterSpacing: -.3 },
  title: { fontFamily: F.display, fontSize: 18, fontWeight: "800", color: C.ink },
  right: { flexDirection: "row", alignItems: "center", gap: 6 },
  pill: {
    flexDirection: "row", alignItems: "center", gap: 4,
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 99,
  },
  pillText: { fontFamily: F.sans, fontSize: 12, fontWeight: "800" },
});
