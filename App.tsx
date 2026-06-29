import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import { ToastProvider } from "./src/components/Toast";
import {
  ICards, IChat, IFile, IHome, IScan, IUser,
} from "./src/components/Icons";
import LearnScreen from "./src/screens/LearnScreen";
import LessonPlayer from "./src/screens/LessonPlayer";
import LoginScreen from "./src/screens/LoginScreen";
import NotificationsScreen from "./src/screens/NotificationsScreen";
import OnboardingScreen from "./src/screens/OnboardingScreen";
import PracticeScreen from "./src/screens/PracticeScreen";
import ScanOverlay from "./src/screens/ScanOverlay";
import SeasonScreen from "./src/screens/SeasonScreen";
import TestsScreen from "./src/screens/TestsScreen";
import TutorScreen from "./src/screens/TutorScreen";
import YouScreen from "./src/screens/YouScreen";
import { useAuth } from "./src/store";
import { C, F, shadow } from "./src/theme";

const Tabs = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const navTheme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: C.bg, card: C.white, border: C.slate[100], primary: C.brand[600], text: C.ink },
};

const TABS: Array<{ name: string; label: string; Icon: any; Component: any }> = [
  { name: "Learn",    label: "Learn",    Icon: IHome,  Component: LearnScreen   },
  { name: "Practice", label: "Practice", Icon: ICards, Component: PracticeScreen },
  { name: "Tutor",    label: "Tutor",    Icon: IChat,  Component: TutorScreen   },
  { name: "Tests",    label: "Tests",    Icon: IFile,  Component: TestsScreen   },
  { name: "You",      label: "You",      Icon: IUser,  Component: YouScreen     },
];

function CustomTabBar({ state, navigation }: any) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.tabHost, { paddingBottom: 8 + insets.bottom }]}>
      <View style={styles.tabBar}>
        {state.routes.map((route: any, index: number) => {
          if (route.name === "Scan") return <View key="scan-placeholder" style={{ width: 64 }} />;
          const focused = state.index === index;
          const tab = TABS.find((t) => t.name === route.name);
          if (!tab) return null;
          const Icon = tab.Icon;
          return (
            <Pressable
              key={route.key}
              style={styles.tabBtn}
              onPress={() => navigation.navigate(route.name)}
            >
              <Icon color={focused ? C.brand[600] : C.slate[400]} />
              <Text style={[styles.tabLabel, { color: focused ? C.brand[600] : C.slate[400] }]}>
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <Pressable
        style={styles.scanFab}
        onPress={() => navigation.navigate("ScanOverlay")}
      >
        <IScan />
      </Pressable>
    </View>
  );
}

function MainTabs() {
  return (
    <Tabs.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: C.bg },
      }}
    >
      <Tabs.Screen name="Learn"    component={LearnScreen} />
      <Tabs.Screen name="Practice" component={PracticeScreen} />
      <Tabs.Screen name="Scan"     component={LearnScreen} options={{ unmountOnBlur: true } as any} />
      <Tabs.Screen name="Tutor"    component={TutorScreen} />
      <Tabs.Screen name="Tests"    component={TestsScreen} />
      <Tabs.Screen name="You"      component={YouScreen} />
    </Tabs.Navigator>
  );
}

export default function App() {
  const { accessToken, hydrated } = useAuth();
  if (!hydrated) return null;
  return (
    <SafeAreaProvider>
      <ToastProvider>
        <NavigationContainer theme={navTheme}>
          <StatusBar style="dark" />
          <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: C.bg } }}>
            {accessToken ? (
              <>
                <Stack.Screen name="Main" component={MainTabs} />
                <Stack.Screen name="Onboarding" component={OnboardingScreen}
                              options={{ presentation: "fullScreenModal" }} />
                <Stack.Screen name="Lesson" component={LessonPlayer}
                              options={{ presentation: "fullScreenModal" }} />
                <Stack.Screen name="ScanOverlay" component={ScanOverlay}
                              options={{ presentation: "fullScreenModal" }} />
                <Stack.Screen name="Notifications" component={NotificationsScreen} />
                <Stack.Screen name="Season" component={SeasonScreen} />
              </>
            ) : (
              <Stack.Screen name="Login" component={LoginScreen} />
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </ToastProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  tabHost: {
    backgroundColor: C.white,
    borderTopWidth: 1,
    borderTopColor: C.slate[100],
    paddingTop: 8,
  },
  tabBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  tabBtn: { flex: 1, alignItems: "center", paddingVertical: 6 },
  tabLabel: { fontFamily: F.sans, fontSize: 10, fontWeight: "700", marginTop: 4 },
  scanFab: {
    position: "absolute",
    top: -28,
    left: "50%",
    marginLeft: -28,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: C.brand[600],
    alignItems: "center",
    justifyContent: "center",
    ...shadow.soft,
    borderWidth: 4,
    borderColor: C.white,
  },
});
