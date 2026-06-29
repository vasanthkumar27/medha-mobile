import { ReactNode } from "react";
import { View, ViewStyle } from "react-native";
import { s } from "../theme";

export default function Card({
  children,
  style,
  padding = 16,
}: { children: ReactNode; style?: ViewStyle; padding?: number }) {
  return <View style={[s.card, { padding }, style]}>{children}</View>;
}
