/**
 * Medha theme tokens for mobile.
 *
 * Mirrors the web Tailwind config so designs stay in sync. We expose flat
 * primitives (colors, font sizes, shadows) and a `s` helper that returns
 * common style fragments — enough to feel Tailwind-ish without pulling in
 * NativeWind / Babel changes.
 */
import { Platform, TextStyle, ViewStyle } from "react-native";

export const C = {
  paper: "#FBFAF7",
  bg: "#F2F1EC",
  ink: "#1A1A17",

  brand: {
    50: "#F4F2FD", 100: "#EAE6FB", 200: "#D6CFF5", 300: "#BAAFEE",
    400: "#9486E4", 500: "#7567DC", 600: "#5B4BD6", 700: "#4A3CB4",
    800: "#392E8E", 900: "#2B2168",
  },
  grass: { base: "#2F8B6A", dark: "#23694F", light: "#DCEBE2" },
  green: { 50:"#E9F3EE", 100:"#D6E9DE", 200:"#B4D7C4", 300:"#86BEA3", 400:"#54A07F", 500:"#2F8B6A", 600:"#256E54", 700:"#1E5743", 800:"#184635", 900:"#123528" },
  amber: { 50:"#FAF6EC", 100:"#F3EAD6", 500:"#BE8E3C", 600:"#9C722C", 700:"#785621" },
  rose:  { 50:"#FBF0EE", 500:"#C0534A", 600:"#A4413A" },
  sky:   { 50:"#EFF3F8", 500:"#4E7CB6", 600:"#3E6699" },
  slate: {
    50:"#F7F6F2", 100:"#EFEEE8", 200:"#E4E1D9", 300:"#CFCBC1",
    400:"#A8A49B", 500:"#7C7972", 600:"#585650", 700:"#403E39",
    800:"#2B2A26", 900:"#1A1A17",
  },
  white: "#fff",
};

export const F = {
  display: Platform.select({ ios: "Fraunces", android: "Fraunces", default: "Fraunces" }) || "System",
  sans: Platform.select({ ios: "Hanken Grotesk", android: "Hanken Grotesk", default: "System" }) || "System",
};

export const radius = { sm: 8, md: 12, lg: 16, xl: 20, "2xl": 24, full: 999 };

export const shadow = {
  card: {
    shadowColor: "#1A1A17",
    shadowOpacity: 0.07,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  } as ViewStyle,
  soft: {
    shadowColor: "#1A1A17",
    shadowOpacity: 0.18,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  } as ViewStyle,
};

export const s = {
  row: { flexDirection: "row" } as ViewStyle,
  rowC: { flexDirection: "row", alignItems: "center" } as ViewStyle,
  rowBetween: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" } as ViewStyle,
  col: { flexDirection: "column" } as ViewStyle,
  center: { alignItems: "center", justifyContent: "center" } as ViewStyle,
  card: {
    backgroundColor: C.white,
    borderRadius: radius["2xl"],
    borderWidth: 1,
    borderColor: C.slate[100],
    padding: 16,
    ...shadow.card,
  } as ViewStyle,
  chip: {
    borderRadius: 99,
    paddingHorizontal: 10,
    paddingVertical: 3,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  } as ViewStyle,
  h1: { fontFamily: F.display, fontSize: 28, fontWeight: "800", color: C.ink, letterSpacing: -.4 } as TextStyle,
  h2: { fontFamily: F.display, fontSize: 22, fontWeight: "800", color: C.ink, letterSpacing: -.3 } as TextStyle,
  h3: { fontFamily: F.display, fontSize: 18, fontWeight: "700", color: C.ink, letterSpacing: -.2 } as TextStyle,
  body: { fontFamily: F.sans, fontSize: 14, color: C.slate[700] } as TextStyle,
  small: { fontFamily: F.sans, fontSize: 12, color: C.slate[400] } as TextStyle,
  uppercase: { fontFamily: F.sans, fontSize: 11, color: C.slate[400], fontWeight: "700", letterSpacing: 0.5, textTransform: "uppercase" } as TextStyle,
};

/* Legacy compat — old code imported `T` and `card`. Map them onto the new tokens. */
export const T = {
  ink: C.ink,
  panel: C.white,
  line: C.slate[200],
  brand: C.brand[600],
  brandSoft: C.brand[300],
  lime: C.grass.base,
  gold: C.amber[500],
  cyan: C.sky[500],
  rose: C.rose[500],
  muted: C.slate[400],
  bright: C.ink,
};
export const card = s.card;
