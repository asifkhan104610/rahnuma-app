import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
    Image,
    Linking,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function AppDrawer({ visible, onClose }: Props) {
  const router = useRouter();

  const go = (path: string) => {
    onClose();
    router.push(path as any);
  };

  const openWebsite = () => {
    onClose();
    Linking.openURL("https://www.educationinkarachi.net");
  };

  const items = [
    { icon: "home-outline", label: "Home", path: "/" },
    { icon: "school-outline", label: "Admissions", path: "/admissions-open" },
    { icon: "briefcase-outline", label: "Jobs", path: "/jobs" },
    { icon: "grid-outline", label: "Categories", path: "/search" },
    { icon: "download-outline", label: "Downloads", path: "/downloads" },
    { icon: "bookmark-outline", label: "Saved Posts", path: "/bookmarks" },
    { icon: "sparkles-outline", label: "Rahnuma AI", path: "/ai" },
    { icon: "person-outline", label: "Profile", path: "/profile" },
    { icon: "settings-outline", label: "Settings", path: "/settings" },
    { icon: "information-circle-outline", label: "About", path: "/about" },
  ];

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View style={styles.drawer}>
          <View style={styles.header}>

  <Image
    source={require("../../assets/images/founder.png")}
    style={styles.profileImage}
  />

  <Text style={styles.name}>
    Asif Khan
  </Text>

  <Text style={styles.role}>
    Founder - Rahnuma
  </Text>

  <Text style={styles.tagline}>
    Your Guide to Education & Careers
  </Text>

</View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {items.map((item) => (
              <Pressable
                key={item.label}
                style={styles.item}
                onPress={() => go(item.path)}
              >
                <Ionicons name={item.icon as any} size={22} color="#061A36" />
                <Text style={styles.itemText}>{item.label}</Text>
              </Pressable>
            ))}

            <Pressable style={styles.item} onPress={openWebsite}>
              <Ionicons name="globe-outline" size={22} color="#061A36" />
              <Text style={styles.itemText}>Website</Text>
            </Pressable>
          </ScrollView>

          <Text style={styles.footer}>Made with ❤️ in Pakistan</Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: "row",
  },

  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
  },

  drawer: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: "78%",
    backgroundColor: "#F8FAFC",
    borderTopRightRadius: 26,
    borderBottomRightRadius: 26,
    overflow: "hidden",
  },

  header: {
    backgroundColor: "#061A36",
    paddingTop: 52,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomRightRadius: 24,
  },

  logo: {
    color: "#D4A032",
    fontSize: 28,
    fontWeight: "900",
  },

  tagline: {
    color: "#ffffffcc",
    marginTop: 6,
    fontSize: 13,
    fontWeight: "700",
  },

  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },

  itemText: {
    marginLeft: 14,
    color: "#061A36",
    fontSize: 15,
    fontWeight: "800",
  },

  profileImage: {
  width: 95,
  height: 95,
  borderRadius: 48,
  borderWidth: 3,
  borderColor: "#D4A032",
  marginBottom: 14,
  alignSelf: "center",
},

name: {
  color: "#fff",
  fontSize: 20,
  fontWeight: "900",
  textAlign: "center",
},

role: {
  color: "#D4A032",
  fontSize: 14,
  fontWeight: "800",
  marginTop: 4,
  textAlign: "center",
},

tagline: {
  color: "#ffffffcc",
  marginTop: 6,
  textAlign: "center",
  fontSize: 13,
},

  footer: {
    textAlign: "center",
    color: "#64748B",
    fontSize: 12,
    fontWeight: "700",
    paddingVertical: 14,
  },
});