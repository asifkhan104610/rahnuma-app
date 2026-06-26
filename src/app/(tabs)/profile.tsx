import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import {
  Alert,
  Image,
  Linking,
  Pressable,
  ScrollView,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

const LINKS = {
  website: "https://www.educationinkarachi.net",
  whatsapp: "https://wa.me/923042836015",
  facebook: "https://www.facebook.com/educationinkarachi.net/",
  instagram: "https://www.instagram.com/educationinkarachiofficial/",
  youtube: "https://www.youtube.com/@EducationinKarachiNet",
  playstore: "https://play.google.com/store/apps/details?id=com.educationinkarachi.app",
  privacy: "https://www.educationinkarachi.net/privacy-policy/",
  terms: "https://www.educationinkarachi.net/terms-and-conditions/",
};

const AI_CHAT_KEY = "RAHNUMA_AI_CHATS";

export default function ProfileScreen() {
  const router = useRouter();

  const open = (url: string) => {
    Linking.openURL(url).catch((e) => console.log("Link error:", e));
  };

  const shareApp = async () => {
    await Share.share({
      message:
        "Download Rahnuma App for admissions, jobs, scholarships, past papers and career guidance:\n\nhttps://www.educationinkarachi.net",
    });
  };

  const clearAiChat = () => {
    Alert.alert("Clear AI Chat", "Are you sure you want to clear Rahnuma AI chat history?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Clear",
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.removeItem(AI_CHAT_KEY);
          Alert.alert("Done", "AI chat history cleared.");
        },
      },
    ]);
  };

  const MenuItem = ({
    icon,
    title,
    sub,
    onPress,
  }: {
    icon: string;
    title: string;
    sub?: string;
    onPress: () => void;
  }) => (
    <Pressable style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuIcon}>
        <Text style={styles.menuIconText}>{icon}</Text>
      </View>

      <View style={{ flex: 1 }}>
        <Text style={styles.menuTitle}>{title}</Text>
        {sub ? <Text style={styles.menuSub}>{sub}</Text> : null}
      </View>

      <Text style={styles.arrow}>›</Text>
    </Pressable>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 120 }}>
      <StatusBar barStyle="light-content" backgroundColor="#061A36" />

      <View style={styles.header}>
        <Image
          source={require("../../../assets/images/founder.png")}
          style={styles.photo}
        />

        <Text style={styles.name}>Asif Khan</Text>
        <Text style={styles.role}>Founder - Rahnuma</Text>
        <Text style={styles.tagline}>Your Guide to Education & Careers</Text>
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Welcome to Rahnuma</Text>
        <Text style={styles.summaryText}>
          Get authentic updates about admissions, jobs, results, scholarships,
          books, past papers and career guidance across Pakistan.
        </Text>

        <View style={styles.versionPill}>
          <Text style={styles.versionPillText}>Rahnuma v1.4</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>App</Text>

        <MenuItem
          icon="⚙️"
          title="Settings"
          sub="Manage app preferences"
          onPress={() => router.push("/settings")}
        />

        <MenuItem
          icon="🔖"
          title="Saved Posts"
          sub="View your bookmarked posts"
          onPress={() => router.push("/bookmarks")}
        />

        <MenuItem
          icon="📥"
          title="Downloads"
          sub="Books, papers and study material"
          onPress={() => router.push("/downloads")}
        />

        <MenuItem
          icon="🤖"
          title="Clear AI Chat"
          sub="Delete Rahnuma AI chat history"
          onPress={clearAiChat}
        />

        <MenuItem
          icon="📤"
          title="Share App"
          sub="Invite students to use Rahnuma"
          onPress={shareApp}
        />

        <MenuItem
          icon="⭐"
          title="Rate App"
          sub="Support us on Play Store"
          onPress={() => open(LINKS.playstore)}
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Connect</Text>

        <MenuItem
          icon="🌐"
          title="Website"
          sub="educationinkarachi.net"
          onPress={() => open(LINKS.website)}
        />

        <MenuItem
          icon="💬"
          title="WhatsApp"
          sub="03042836015"
          onPress={() => open(LINKS.whatsapp)}
        />

        <MenuItem
          icon="📘"
          title="Facebook"
          sub="Education in Karachi"
          onPress={() => open(LINKS.facebook)}
        />

        <MenuItem
          icon="📷"
          title="Instagram"
          sub="@educationinkarachiofficial"
          onPress={() => open(LINKS.instagram)}
        />

        <MenuItem
          icon="▶️"
          title="YouTube"
          sub="@EducationinKarachiNet"
          onPress={() => open(LINKS.youtube)}
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Legal</Text>

        <MenuItem
          icon="🔒"
          title="Privacy Policy"
          sub="How we handle user data"
          onPress={() => open(LINKS.privacy)}
        />

        <MenuItem
          icon="📄"
          title="Terms & Conditions"
          sub="App usage terms"
          onPress={() => open(LINKS.terms)}
        />

        <MenuItem
          icon="ℹ️"
          title="About Rahnuma"
          sub="Learn more about the app"
          onPress={() => router.push("/about")}
        />
      </View>

      <Text style={styles.footer}>Made with ❤️ in Pakistan</Text>
      <Text style={styles.footerSmall}>© 2026 Education in Karachi</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },

  header: {
    backgroundColor: "#061A36",
    alignItems: "center",
    paddingTop: 52,
    paddingBottom: 32,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },

  photo: {
    width: 118,
    height: 118,
    borderRadius: 59,
    borderWidth: 3,
    borderColor: "#D4A032",
    marginBottom: 14,
  },

  name: {
    color: "#fff",
    fontSize: 21,
    fontWeight: "900",
  },

  role: {
    color: "#D4A032",
    fontSize: 14,
    fontWeight: "900",
    marginTop: 4,
  },

  tagline: {
    color: "#ffffffcc",
    fontSize: 13,
    marginTop: 6,
  },

  summaryCard: {
    backgroundColor: "#061A36",
    margin: 14,
    marginBottom: 0,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: "#D4A032",
  },

  summaryTitle: {
    color: "#D4A032",
    fontSize: 18,
    fontWeight: "900",
  },

  summaryText: {
    color: "#ffffffcc",
    marginTop: 8,
    fontSize: 14,
    lineHeight: 22,
  },

  versionPill: {
    marginTop: 14,
    backgroundColor: "#D4A032",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    alignSelf: "flex-start",
  },

  versionPillText: {
    color: "#061A36",
    fontWeight: "900",
    fontSize: 12,
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

  cardTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#061A36",
    marginBottom: 8,
    paddingHorizontal: 4,
  },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },

  menuIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  menuIconText: {
    fontSize: 20,
  },

  menuTitle: {
    color: "#061A36",
    fontSize: 15,
    fontWeight: "900",
  },

  menuSub: {
    color: "#64748B",
    fontSize: 12,
    marginTop: 3,
    fontWeight: "600",
  },

  arrow: {
    color: "#94A3B8",
    fontSize: 28,
    fontWeight: "300",
  },

  footer: {
    textAlign: "center",
    color: "#061A36",
    fontWeight: "900",
    marginTop: 18,
  },

  footerSmall: {
    textAlign: "center",
    color: "#64748B",
    fontSize: 12,
    marginTop: 4,
  },
});