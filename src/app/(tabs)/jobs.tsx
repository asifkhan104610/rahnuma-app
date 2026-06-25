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
import { COLORS } from "../../theme";

function cleanText(html) {
  return html
    .replace(/&amp;/g, "&")
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&nbsp;/g, " ")
    .replace(/<[^>]+>/g, "");
}

function formatDate(dateStr) {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

const JOB_FILTERS = [
  { label: "All", id: 1274 },
  { label: "Government", id: 2590 },
  { label: "Private", id: 1276 },
];

export default function JobsTab() {
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(1274);

  useEffect(() => {
    setLoading(true);

    fetch(
      `https://www.educationinkarachi.net/wp-json/wp/v2/posts?categories=${activeCategory}&per_page=20&_embed`
    )
      .then((r) => r.json())
      .then((data) => setPosts(Array.isArray(data) ? data : []))
      .catch((e) => console.log(e))
      .finally(() => setLoading(false));
  }, [activeCategory]);

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryDark} />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Jobs</Text>
        <Text style={styles.headerSub}>Latest government & private jobs</Text>
      </View>

      <View style={styles.filterRow}>
        {JOB_FILTERS.map((filter) => (
          <Pressable
            key={filter.id}
            style={[
              styles.filterChip,
              activeCategory === filter.id && styles.filterChipActive,
            ]}
            onPress={() => setActiveCategory(filter.id)}
          >
            <Text
              style={[
                styles.filterText,
                activeCategory === filter.id && styles.filterTextActive,
              ]}
            >
              {filter.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading jobs...</Text>
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item, i) => item.id.toString() + "_" + i}
          contentContainerStyle={{ padding: 12, paddingBottom: 120 }}
          ListEmptyComponent={<Text style={styles.empty}>Koi post nahi mili.</Text>}
          renderItem={({ item }) => {
            const img =
              item._embedded?.["wp:featuredmedia"]?.[0]?.source_url || null;

            return (
              <Pressable
                style={styles.card}
                onPress={() => router.push(`/${item.id}`)}
                android_ripple={{ color: "#f0f0f0" }}
              >
                {img ? (
                  <Image source={{ uri: img }} style={styles.thumb} />
                ) : (
                  <View style={[styles.thumb, styles.ph]}>
                    <Text style={{ fontSize: 24 }}>💼</Text>
                  </View>
                )}

                <View style={styles.body}>
                  <Text style={styles.title} numberOfLines={3}>
                    {cleanText(item.title.rendered)}
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
  container: { flex: 1, backgroundColor: COLORS.bg },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 40,
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
    fontWeight: "600",
  },

  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 52,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
    elevation: 6,
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#fff",
  },

  headerSub: {
    fontSize: 12.5,
    color: "#c7ccf0",
    marginTop: 3,
  },

  filterRow: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: COLORS.bg,
  },

  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#E5E7EB",
    marginRight: 8,
  },

  filterChipActive: {
    backgroundColor: COLORS.primary,
  },

  filterText: {
    color: "#374151",
    fontWeight: "700",
  },

  filterTextActive: {
    color: "#fff",
  },

  card: {
    flexDirection: "row",
    backgroundColor: COLORS.card,
    borderRadius: 14,
    marginBottom: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.border,
    elevation: 2,
  },

  thumb: {
    width: 100,
    height: 100,
  },

  ph: {
    backgroundColor: "#f0f2f7",
    justifyContent: "center",
    alignItems: "center",
  },

  body: {
    flex: 1,
    padding: 12,
    justifyContent: "center",
  },

  title: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.text,
    lineHeight: 21,
  },

  date: {
    fontSize: 12,
    color: COLORS.textSoft,
    marginTop: 8,
    fontWeight: "600",
  },
});