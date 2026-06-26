import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    Pressable,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../theme";

const API = "https://www.educationinkarachi.net/wp-json/wp/v2/posts";

const FILTERS = [
  { label: "All", category: "" },
  { label: "Admissions", category: "154" },
  { label: "Jobs", category: "1274" },
  { label: "Results", category: "806" },
  { label: "News", category: "36" },
];

function cleanText(html = "") {
  return html
    .replace(/&amp;/g, "&")
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&nbsp;/g, " ")
    .replace(/<[^>]+>/g, "");
}

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

export default function NotificationsScreen() {
  const router = useRouter();
  const [active, setActive] = useState("");
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const loadPosts = async (category = "") => {
    setLoading(true);
    try {
      const url = category
        ? `${API}?categories=${category}&per_page=20&_embed`
        : `${API}?per_page=20&_embed`;

      const res = await fetch(url);
      const data = await res.json();
      setPosts(Array.isArray(data) ? data : []);
    } catch (e) {
      console.log("Notifications error:", e);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts(active);
  }, [active]);

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <StatusBar barStyle="light-content" backgroundColor="#061A36" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>🔔 Notifications</Text>
        <Text style={styles.headerSub}>Latest updates from Education in Karachi</Text>
      </View>

      <View style={styles.filterRow}>
        {FILTERS.map((item) => (
          <Pressable
            key={item.label}
            style={[
              styles.filterChip,
              active === item.category && styles.filterChipActive,
            ]}
            onPress={() => setActive(item.category)}
          >
            <Text
              style={[
                styles.filterText,
                active === item.category && styles.filterTextActive,
              ]}
            >
              {item.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading updates...</Text>
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item, i) => item.id.toString() + "_" + i}
          contentContainerStyle={{ padding: 12, paddingBottom: 120 }}
          ListEmptyComponent={<Text style={styles.empty}>Koi update nahi mili.</Text>}
          renderItem={({ item }) => {
            const img =
              item._embedded?.["wp:featuredmedia"]?.[0]?.source_url || null;

            return (
              <Pressable
                style={styles.card}
                onPress={() => router.push("/notifications")}
                android_ripple={{ color: "#f0f0f0" }}
              >
                {img ? (
                  <Image source={{ uri: img }} style={styles.thumb} />
                ) : (
                  <View style={[styles.thumb, styles.ph]}>
                    <Text style={{ fontSize: 24 }}>🔔</Text>
                  </View>
                )}

                <View style={styles.body}>
                  <Text style={styles.title} numberOfLines={3}>
                    {cleanText(item.title?.rendered || "")}
                  </Text>

                  <Text style={styles.date}>{formatDate(item.date)}</Text>
                </View>
              </Pressable>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },

  header: {
    backgroundColor: "#061A36",
    paddingTop: 52,
    paddingBottom: 18,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
    elevation: 6,
  },

  headerTitle: {
    fontSize: 23,
    fontWeight: "900",
    color: "#fff",
  },

  headerSub: {
    fontSize: 13,
    color: "#ffffffcc",
    marginTop: 4,
  },

  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 12,
    paddingTop: 14,
  },

  filterChip: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 18,
    margin: 4,
  },

  filterChipActive: {
    backgroundColor: "#061A36",
    borderColor: "#D4A032",
  },

  filterText: {
    color: "#64748B",
    fontSize: 12,
    fontWeight: "800",
  },

  filterTextActive: {
    color: "#D4A032",
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    marginTop: 10,
    color: COLORS.textSoft,
    fontWeight: "600",
  },

  empty: {
    textAlign: "center",
    marginTop: 40,
    color: COLORS.textSoft,
    fontWeight: "700",
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    elevation: 2,
  },

  thumb: {
    width: 104,
    height: 104,
  },

  ph: {
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },

  body: {
    flex: 1,
    padding: 12,
    justifyContent: "center",
  },

  title: {
    fontSize: 15,
    fontWeight: "800",
    color: "#061A36",
    lineHeight: 21,
  },

  date: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 8,
    fontWeight: "700",
  },
});