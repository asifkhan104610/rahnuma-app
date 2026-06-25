import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    Pressable,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../../theme";

const FILTERS = [
  { name: "All", ids: "154,806,36,155,1730,1522" },
  { name: "Admissions", ids: "154" },
  { name: "Results", ids: "806" },
  { name: "News", ids: "36" },
  { name: "Scholarships", ids: "155" },
  { name: "Date Sheets", ids: "1730" },
  { name: "Forms", ids: "1522" },
];

function cleanText(html: string) {
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

export default function AdmissionsTab() {
  const router = useRouter();
  const [active, setActive] = useState(FILTERS[0]);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPosts = () => {
    setLoading(true);

    fetch(
      `https://www.educationinkarachi.net/wp-json/wp/v2/posts?categories=${active.ids}&per_page=20&_embed`
    )
      .then((r) => r.json())
      .then((data) => setPosts(Array.isArray(data) ? data : []))
      .catch((e) => console.log(e))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadPosts();
  }, [active]);

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryDark} />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Updates</Text>
        <Text style={styles.headerSub}>
          Admissions, results, news, scholarships & forms
        </Text>
      </View>

      <View style={styles.filterWrap}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {FILTERS.map((item) => {
            const isActive = active.name === item.name;

            return (
              <Pressable
                key={item.name}
                onPress={() => setActive(item)}
                style={[styles.chip, isActive && styles.chipActive]}
              >
                <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                  {item.name}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
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
          ListEmptyComponent={
            <Text style={styles.empty}>Koi update nahi mili.</Text>
          }
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
                    <Text style={{ fontSize: 24 }}>📰</Text>
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

  filterWrap: {
    backgroundColor: COLORS.bg,
    paddingTop: 14,
    paddingBottom: 6,
    paddingLeft: 12,
  },

  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: COLORS.card,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  chipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },

  chipText: {
    fontSize: 12,
    fontWeight: "800",
    color: COLORS.textSoft,
  },

  chipTextActive: {
    color: "#fff",
  },

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