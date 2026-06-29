import { createContext, ReactNode, useCallback, useContext, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { C, F, radius, shadow } from "../theme";

export type ToastKind = "success" | "info" | "warn" | "error";
interface Item { id: number; msg: string; kind: ToastKind; }
const Ctx = createContext<((msg: string, kind?: ToastKind) => void) | null>(null);
let idCounter = 1;

const KIND_BG: Record<ToastKind, string> = {
  success: C.grass.base,
  info: C.slate[800],
  warn: C.amber[500],
  error: C.rose[500],
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Item[]>([]);
  const push = useCallback((msg: string, kind: ToastKind = "success") => {
    const id = idCounter++;
    setItems((xs) => [...xs, { id, msg, kind }]);
    setTimeout(() => setItems((xs) => xs.filter((x) => x.id !== id)), 2400);
  }, []);
  return (
    <Ctx.Provider value={push}>
      {children}
      <View pointerEvents="none" style={styles.host}>
        {items.map((t) => (
          <View key={t.id} style={[styles.toast, { backgroundColor: KIND_BG[t.kind] }]}>
            <Text style={styles.msg}>{t.msg}</Text>
          </View>
        ))}
      </View>
    </Ctx.Provider>
  );
}

export function useToast() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useToast must be used inside <ToastProvider>");
  return v;
}

const styles = StyleSheet.create({
  host: { position: "absolute", left: 0, right: 0, bottom: 92, alignItems: "center", gap: 8 },
  toast: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: radius.md,
    minWidth: 220,
    ...shadow.soft,
  },
  msg: { color: "#fff", fontFamily: F.sans, fontWeight: "700", fontSize: 13, textAlign: "center" },
});
