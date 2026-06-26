import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Platform } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#D4A032",
        tabBarInactiveTintColor: "#CBD5E1",
        tabBarStyle: {
          height: Platform.OS === "ios" ? 82 : 72,
          paddingBottom: Platform.OS === "ios" ? 22 : 12,
          paddingTop: 8,
          backgroundColor: "#061A36",
          borderTopWidth: 0,
          elevation: 12,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "700",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />

     <Tabs.Screen
  name="search"
  options={{
    title: "Categories",
    tabBarIcon: ({ color, size }) => (
      <Ionicons name="grid" size={size} color={color} />
    ),
  }}
/>

   <Tabs.Screen
  name="downloads"
  options={{
    title: "Downloads",
    tabBarIcon: ({ color, size }) => (
      <Ionicons name="download" size={size} color={color} />
    ),
  }}
/>

      <Tabs.Screen
        name="bookmarks"
        options={{
          title: "Saved",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="bookmark" size={size} color={color} />
          ),
        }}
      />

    <Tabs.Screen
  name="profile"
  options={{
    title: "Profile",
    tabBarIcon: ({ color, size }) => (
      <Ionicons name="person" size={size} color={color} />
    ),
  }}
/>
<Tabs.Screen
  name="jobs"
  options={{
    href: null,
  }}
/>

<Tabs.Screen
  name="admissions"
  options={{
    href: null,
  }}
/>
    </Tabs>
  );
}