import { router, Stack } from "expo-router";
import { useEffect } from "react";
import { OneSignal } from "react-native-onesignal";

export default function RootLayout() {
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

  return (
    <Stack screenOptions={{ headerTitleAlign: "center" }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="[id]" options={{ title: "Post" }} />
      <Stack.Screen name="about" options={{ title: "About" }} />
      <Stack.Screen name="settings" options={{ title: "Settings" }} />
      <Stack.Screen name="ai" options={{ title: "Rahnuma AI" }} />
      <Stack.Screen name="cvbuilder" options={{ title: "CV Builder" }} />
      <Stack.Screen name="program-finder" options={{ title: "Program Finder" }} />
      <Stack.Screen name="institute-finder" options={{ title: "Institute Finder" }} />
      <Stack.Screen name="admissions-open" options={{ title: "Admissions Open" }} />
    </Stack>
  );
}