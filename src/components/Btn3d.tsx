import { ReactNode } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, ViewStyle } from "react-native";
import { C, F, radius, shadow } from "../theme";

type Variant = "grass" | "brand" | "amber" | "white" | "rose" | "disabled";

const COLORS: Record<Variant, { bg: string; fg: string; border?: string }> = {
  grass:    { bg: C.grass.base, fg: C.white },
  brand:    { bg: C.brand[600], fg: C.white },
  amber:    { bg: C.amber[500], fg: C.white },
  rose:     { bg: C.rose[500],  fg: C.white },
  white:    { bg: C.white,      fg: C.slate[800], border: C.slate[200] },
  disabled: { bg: "#ECEBE4",    fg: C.slate[400] },
};

export default function Btn3d({
  label,
  onPress,
  variant = "grass",
  loading,
  disabled,
  style,
  icon,
  size = "md",
}: {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  icon?: ReactNode;
  size?: "sm" | "md" | "lg";
}) {
  const v = disabled || loading ? "disabled" : variant;
  const c = COLORS[v];
  const py = size === "lg" ? 14 : size === "sm" ? 8 : 12;
  const fs = size === "lg" ? 15 : size === "sm" ? 12 : 14;
  return (
    <Pressable
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        {
          backgroundColor: c.bg,
          borderColor: c.border ?? "transparent",
          borderWidth: c.border ? 1 : 0,
          paddingVertical: py,
          paddingHorizontal: size === "sm" ? 12 : 18,
          borderRadius: radius.lg,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          ...shadow.card,
          transform: [{ translateY: pressed ? 1 : 0 }],
        },
        style,
      ]}
    >
      {loading ? <ActivityIndicator color={c.fg} /> : icon}
      <Text style={{ color: c.fg, fontWeight: "800", fontSize: fs, fontFamily: F.sans, letterSpacing: 0.2 }}>
        {label}
      </Text>
    </Pressable>
  );
}

export const buttonStyles = StyleSheet.create({});
