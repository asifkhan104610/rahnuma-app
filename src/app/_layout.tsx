import { router, Stack } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { OneSignal } from "react-native-onesignal";

export default function RootLayout() {
  const [showSplash, setShowSplash] = useState(true);
  const fade = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    OneSignal.initialize("64e2ff44-535f-4472-afff-405cba29b2b6");
    OneSignal.Notifications.requestPermission(true);

    OneSignal.Notifications.addEventListener("click", (event) => {
      const data: any = event.notification.additionalData;

      if (data?.postId) {
        router.push(`/${data.postId}`);
      }
    });
  }, []);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Stack screenOptions={{ headerTitleAlign: "center" }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="[id]" options={{ headerShown: false }} />
        <Stack.Screen name="about" options={{ title: "About" }} />
        <Stack.Screen name="settings" options={{ title: "Settings" }} />
      <Stack.Screen
  name="ai"
  options={{ title: "Education AI" }}
/>
        <Stack.Screen name="cvbuilder" options={{ title: "CV Builder" }} />
        <Stack.Screen name="program-finder" options={{ title: "Program Finder" }} />
        <Stack.Screen name="institute-finder" options={{ title: "Institute Finder" }} />
        <Stack.Screen name="admissions-open" options={{ title: "Admissions Open" }} />
      </Stack>

      {showSplash ? (
        <View style={styles.splash}>
          <Animated.View
            style={{
              opacity: fade,
              transform: [{ scale }],
              alignItems: "center",
            }}
          >
            <Image
              source={require("../../assets/images/splash-icon.png")}
              style={styles.logo}
              resizeMode="contain"
            />

            <Text style={styles.title}>Education in Pakistan</Text>
            <Text style={styles.tagline}>Your Guide to Education & Careers</Text>
            <Text style={styles.goldText}>We Guide | You Grow</Text>
          </Animated.View>
        </View>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  splash: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#061A36",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  },

  logo: {
    width: 170,
    height: 170,
    marginBottom: 18,
  },

  title: {
    color: "#fff",
    fontSize: 38,
    fontWeight: "900",
    letterSpacing: 1,
  },

  tagline: {
    color: "#ffffffcc",
    fontSize: 14,
    marginTop: 8,
    fontWeight: "700",
  },

  goldText: {
    color: "#D4A032",
    fontSize: 14,
    marginTop: 8,
    fontWeight: "900",
  },
});