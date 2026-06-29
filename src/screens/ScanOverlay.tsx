import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { apiUploadImage } from "../api";
import Btn3d from "../components/Btn3d";
import { IBack, IScan, ISparkle } from "../components/Icons";
import Mascot from "../components/Mascot";
import { useToast } from "../components/Toast";
import { C, F, radius, shadow } from "../theme";

export default function ScanOverlay({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const toast = useToast();
  const [uri, setUri] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ reply: string; provider?: string | null } | null>(null);

  async function pickFromLibrary() {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) { toast("Permission denied.", "error"); return; }
    const r = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.7 });
    if (!r.canceled && r.assets?.[0]?.uri) setUri(r.assets[0].uri);
  }
  async function takePhoto() {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) { toast("Camera permission denied.", "error"); return; }
    const r = await ImagePicker.launchCameraAsync({ quality: 0.7 });
    if (!r.canceled && r.assets?.[0]?.uri) setUri(r.assets[0].uri);
  }

  async function explain() {
    if (!uri) return;
    setBusy(true); setResult(null);
    try {
      const r = await apiUploadImage<{ reply: string; provider?: string | null }>("/ai/explain-image", uri);
      setResult(r);
    } catch { toast("Couldn't reach AI provider.", "error"); }
    finally { setBusy(false); }
  }

  return (
    <View style={[styles.host, { paddingTop: insets.top + 8, paddingBottom: insets.bottom }]}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}><IBack /></Pressable>
        <Text style={styles.title}>Scan to explain</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 120 }}>
        {!uri && (
          <View style={[styles.dropCard]}>
            <View style={styles.iconBubble}><IScan color={C.brand[600]} /></View>
            <Text style={styles.dropTitle}>Take a photo of a page</Text>
            <Text style={styles.dropSub}>Nova reads the snapshot and explains the key concept in plain English.</Text>
            <View style={{ flexDirection: "row", gap: 10, marginTop: 14 }}>
              <Btn3d label="Take photo" variant="brand" onPress={takePhoto} style={{ flex: 1 }} />
              <Btn3d label="Pick from gallery" variant="white" onPress={pickFromLibrary} style={{ flex: 1 }} />
            </View>
          </View>
        )}

        {uri && (
          <>
            <Image source={{ uri }} style={styles.preview} resizeMode="cover" />
            {!result && !busy && (
              <Btn3d label="Explain this" variant="grass" onPress={explain}
                     icon={<ISparkle color={C.white} />} />
            )}
            {busy && (
              <View style={[styles.dropCard, { alignItems: "center" }]}>
                <Mascot pose="think" size={100} />
                <Text style={[styles.dropTitle, { marginTop: 8 }]}>Reading…</Text>
                <Text style={styles.dropSub}>Spotting the key concept and writing the explanation.</Text>
              </View>
            )}
            {result && (
              <View style={[styles.dropCard]}>
                <Text style={styles.resultLabel}>Nova explains</Text>
                <Text style={styles.resultBody}>{result.reply}</Text>
                <View style={{ flexDirection: "row", gap: 10, marginTop: 14 }}>
                  <Btn3d label="Ask Nova" variant="brand" onPress={() => navigation.navigate("Tutor")} style={{ flex: 1 }} />
                  <Btn3d label="Scan again" variant="white" onPress={() => { setUri(null); setResult(null); }} style={{ flex: 1 }} />
                </View>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  host: { flex: 1, backgroundColor: C.bg },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingBottom: 8 },
  title: { fontFamily: F.display, fontSize: 18, fontWeight: "800", color: C.ink },

  dropCard: { backgroundColor: C.white, borderRadius: radius["2xl"], padding: 18, alignItems: "center", gap: 6, ...shadow.card },
  iconBubble: { width: 56, height: 56, borderRadius: 28, backgroundColor: C.brand[50], alignItems: "center", justifyContent: "center", marginBottom: 8 },
  dropTitle: { fontFamily: F.display, fontSize: 18, fontWeight: "800", color: C.ink },
  dropSub:   { fontFamily: F.sans, fontSize: 13, color: C.slate[500], textAlign: "center", maxWidth: 260 },

  preview: { width: "100%", height: 220, borderRadius: radius["2xl"], backgroundColor: C.slate[100] },

  resultLabel: { fontFamily: F.sans, fontSize: 11, color: C.brand[700], fontWeight: "800", letterSpacing: 0.5, textTransform: "uppercase" },
  resultBody:  { fontFamily: F.sans, fontSize: 14, color: C.ink, lineHeight: 21, marginTop: 6 },
});
