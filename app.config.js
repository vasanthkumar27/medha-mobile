/**
 * Expo config — OTA updates disabled for local Expo Go dev.
 * The old app.json pointed at u.expo.dev, which made Expo Go hang on
 * "Opening project… check internet connectivity" even on a good network.
 */
module.exports = {
  expo: {
    name: "Medha",
    slug: "medha",
    owner: "vasanthkumar27",
    version: "1.0.0",
    orientation: "portrait",
    scheme: "medha",
    userInterfaceStyle: "light",
    backgroundColor: "#FAF7EE",
    icon: "./assets/icon.png",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#26243C",
    },
    ios: {
      supportsTablet: false,
      bundleIdentifier: "app.medha.mobile",
      icon: "./assets/icon.png",
    },
    android: {
      package: "app.medha.mobile",
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#26243C",
      },
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    plugins: ["expo-notifications"],
    extra: {
      apiUrl: process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:8000",
      eas: {
        projectId: "36dfd083-2c3a-46f0-91fa-8211812c7a59",
      },
    },
    updates: {
      enabled: false,
    },
  },
};
