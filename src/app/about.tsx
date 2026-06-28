import {
    Image,
    Linking,
    Pressable,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { COLORS } from "../theme";

const LINKS = {
  facebook: "https://www.facebook.com/educationinkarachi.net/",
  instagram: "https://www.instagram.com/educationinkarachiofficial/",
  youtube: "https://www.youtube.com/@EducationinKarachiNet",
  website: "https://www.educationinkarachi.net",
  whatsapp: "https://wa.me/923042836015",
};

export default function AboutScreen() {
  const open = (url: string) => {
    Linking.openURL(url).catch((e) => console.log("Link error:", e));
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <StatusBar barStyle="light-content" backgroundColor="#061A36" />

      <View style={styles.top}>
        <Image
          source={require("../../assets/images/founder.png")}
          style={styles.founder}
        />

        <Text style={styles.name}>Asif Khan</Text>
        <Text style={styles.role}>Founder - Education in Pakistan</Text>
        <Text style={styles.tagline}>Your Guide to Education & Careers</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>About Education in Pakistan</Text>
        <Text style={styles.para}>
          Education in Pakistan is an education and career guidance platform designed to help
          students find authentic updates about admissions, results, jobs,
          scholarships, past papers, books and entry test preparation.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Our Mission</Text>
        <Text style={styles.para}>
          Our mission is to guide students with trusted, simple and timely
          information so they can make better educational and career decisions.
        </Text>
      </View>

      <View style={styles.visionBox}>
        <Text style={styles.quote}>“</Text>
        <Text style={styles.visionTitle}>Our Vision</Text>
        <Text style={styles.visionText}>
          To become Pakistan’s most trusted platform for education and career
          guidance.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Connect With Us</Text>

        <Pressable style={[styles.linkBtn, { backgroundColor: "#25D366" }]} onPress={() => open(LINKS.whatsapp)}>
          <Text style={styles.linkText}>💬 WhatsApp: 03042836015</Text>
        </Pressable>

        <Pressable style={[styles.linkBtn, { backgroundColor: "#061A36" }]} onPress={() => open(LINKS.website)}>
          <Text style={styles.linkText}>🌐 educationinkarachi.net</Text>
        </Pressable>

        <Pressable style={[styles.linkBtn, { backgroundColor: "#1877F2" }]} onPress={() => open(LINKS.facebook)}>
          <Text style={styles.linkText}>📘 Facebook</Text>
        </Pressable>

        <Pressable style={[styles.linkBtn, { backgroundColor: "#E1306C" }]} onPress={() => open(LINKS.instagram)}>
          <Text style={styles.linkText}>📷 Instagram</Text>
        </Pressable>

        <Pressable style={[styles.linkBtn, { backgroundColor: "#FF0000" }]} onPress={() => open(LINKS.youtube)}>
          <Text style={styles.linkText}>▶️ YouTube</Text>
        </Pressable>
      </View>

      <Text style={styles.footer}>© 2026 Education in Pakistan | Education in Karachi</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },

  top: {
    backgroundColor: "#061A36",
    alignItems: "center",
    paddingTop: 52,
    paddingBottom: 34,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },

  founder: {
    width: 118,
    height: 118,
    borderRadius: 59,
    borderWidth: 3,
    borderColor: "#D4A032",
    marginBottom: 14,
  },

  name: {
    fontSize: 21,
    fontWeight: "900",
    color: "#fff",
  },

  role: {
    fontSize: 14,
    fontWeight: "800",
    color: "#D4A032",
    marginTop: 4,
  },

  tagline: {
    fontSize: 13,
    color: "#ffffffcc",
    marginTop: 6,
  },

  section: {
    backgroundColor: COLORS.card,
    margin: 14,
    marginBottom: 0,
    borderRadius: 18,
    padding: 18,
    elevation: 2,
  },

  heading: {
    fontSize: 18,
    fontWeight: "900",
    color: COLORS.text,
    marginBottom: 10,
  },

  para: {
    fontSize: 15,
    lineHeight: 25,
    color: COLORS.textSoft,
  },

  visionBox: {
    backgroundColor: "#061A36",
    margin: 14,
    marginBottom: 0,
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: "#D4A032",
  },

  quote: {
    color: "#D4A032",
    fontSize: 38,
    fontWeight: "900",
    lineHeight: 38,
  },

  visionTitle: {
    color: "#D4A032",
    fontSize: 17,
    fontWeight: "900",
    marginBottom: 8,
  },

  visionText: {
    color: "#ffffffcc",
    fontSize: 15,
    lineHeight: 24,
  },

  linkBtn: {
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 11,
    alignItems: "center",
  },

  linkText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "800",
  },

  footer: {
    textAlign: "center",
    color: COLORS.textSoft,
    fontSize: 12,
    marginTop: 22,
    marginBottom: 10,
  },
});