import { Linking, Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";

const LINKS = {
  website: "https://www.educationinkarachi.net",
  whatsapp: "https://wa.me/923042836015",
  facebook: "https://www.facebook.com/educationinkarachi.net/",
  instagram: "https://www.instagram.com/educationinkarachiofficial/",
  youtube: "https://www.youtube.com/@EducationinKarachiNet",
};

export default function SettingsScreen() {
  const open = (url: string) => {
    Linking.openURL(url).catch((e) => console.log("Link error:", e));
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <StatusBar barStyle="light-content" backgroundColor="#061A36" />

      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.sub}>Manage Education in Pakistan app options</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.heading}>App</Text>

        <Pressable style={styles.row} onPress={() => alert("Notifications will be added in final APK build.")}>
          <Text style={styles.rowText}>🔔 Notifications</Text>
          <Text style={styles.badge}>Coming Soon</Text>
        </Pressable>

        <Pressable style={styles.row} onPress={() => alert("Dark mode coming soon.")}>
          <Text style={styles.rowText}>🌙 Dark Mode</Text>
          <Text style={styles.badge}>Soon</Text>
        </Pressable>

        <Pressable style={styles.row} onPress={() => alert("Education in Pakistan App v1.1")}>
          <Text style={styles.rowText}>📱 App Version</Text>
          <Text style={styles.value}>1.1</Text>
        </Pressable>
      </View>

      <View style={styles.card}>
        <Text style={styles.heading}>Connect</Text>

        <Pressable style={styles.row} onPress={() => open(LINKS.website)}>
          <Text style={styles.rowText}>🌐 Visit Website</Text>
          <Text style={styles.arrow}>›</Text>
        </Pressable>

        <Pressable style={styles.row} onPress={() => open(LINKS.whatsapp)}>
          <Text style={styles.rowText}>💬 WhatsApp</Text>
          <Text style={styles.arrow}>›</Text>
        </Pressable>

        <Pressable style={styles.row} onPress={() => open(LINKS.facebook)}>
          <Text style={styles.rowText}>📘 Facebook</Text>
          <Text style={styles.arrow}>›</Text>
        </Pressable>

        <Pressable style={styles.row} onPress={() => open(LINKS.instagram)}>
          <Text style={styles.rowText}>📷 Instagram</Text>
          <Text style={styles.arrow}>›</Text>
        </Pressable>

        <Pressable style={styles.row} onPress={() => open(LINKS.youtube)}>
          <Text style={styles.rowText}>▶️ YouTube</Text>
          <Text style={styles.arrow}>›</Text>
        </Pressable>
      </View>

      <View style={styles.card}>
        <Text style={styles.heading}>Legal</Text>

        <Pressable style={styles.row} onPress={() => alert("Privacy Policy page will be added soon.")}>
          <Text style={styles.rowText}>🌐 Privacy Policy</Text>
          <Text style={styles.arrow}>›</Text>
        </Pressable>

        <Pressable style={styles.row} onPress={() => alert("Terms page will be added soon.")}>
          <Text style={styles.rowText}>📄 Terms & Conditions</Text>
          <Text style={styles.arrow}>›</Text>
        </Pressable>
      </View>

      <Text style={styles.footer}>© 2026 Education in Pakistan | Education in Karachi</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },

  header: {
    backgroundColor: "#061A36",
    paddingTop: 52,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },

  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "900",
  },

  sub: {
    color: "#ffffffcc",
    marginTop: 4,
    fontSize: 13,
  },

  card: {
    backgroundColor: "#fff",
    margin: 14,
    marginBottom: 0,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    elevation: 2,
  },

  heading: {
    fontSize: 17,
    fontWeight: "900",
    color: "#061A36",
    marginBottom: 8,
  },

  row: {
    minHeight: 52,
    borderBottomWidth: 1,
    borderBottomColor: "#EEF2F7",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  rowText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#061A36",
  },

  arrow: {
    fontSize: 28,
    color: "#94A3B8",
  },

  badge: {
    backgroundColor: "#FFF8E6",
    color: "#A16207",
    fontWeight: "900",
    fontSize: 11,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },

  value: {
    color: "#64748B",
    fontWeight: "900",
  },

  footer: {
    textAlign: "center",
    color: "#64748B",
    fontSize: 12,
    marginTop: 22,
    marginBottom: 10,
  },
});