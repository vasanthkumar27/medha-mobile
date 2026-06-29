import { ReactNode } from "react";
import { Text, View, ViewStyle } from "react-native";
import { C, F, s } from "../theme";

const TONE: Record<string, { bg: string; fg: string }> = {
  slate: { bg: C.slate[100], fg: C.slate[600] },
  brand: { bg: C.brand[50], fg: C.brand[700] },
  amber: { bg: C.amber[50], fg: C.amber[700] },
  rose:  { bg: C.rose[50],  fg: C.rose[600]  },
  grass: { bg: C.grass.light, fg: C.grass.dark },
  sky:   { bg: C.sky[50], fg: C.sky[600] },
};

export default function Pill({
  tone = "slate",
  children,
  style,
}: { tone?: keyof typeof TONE; children: ReactNode; style?: ViewStyle }) {
  const t = TONE[tone];
  return (
    <View style={[s.chip, { backgroundColor: t.bg }, style]}>
      <Text style={{ fontFamily: F.sans, fontSize: 11, fontWeight: "700", color: t.fg, letterSpacing: 0.2 }}>
        {children}
      </Text>
    </View>
  );
}
