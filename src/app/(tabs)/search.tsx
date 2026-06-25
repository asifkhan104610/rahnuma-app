import { useRouter } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    Pressable,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../../theme";

const EXPLORE_CARDS = [
  { title: "Admissions", icon: "🎓", route: "/admissions-open" },
  { title: "Program Finder", icon: "🔎", route: "/program-finder" },
  { title: "Institute Finder", icon: "🏛️", route: "/institute-finder" },
  { title: "Jobs", icon: "💼", query: "jobs" },
  { title: "Scholarships", icon: "🎁", query: "scholarship" },
  { title: "Past Papers", icon: "📚", query: "past papers" },
  { title: "PDF Books", icon: "📖", query: "books" },
  { title: "Practice Tests", icon: "✅", query: "quiz" },
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

export default function SearchScreen() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const runSearch = (customQuery?: string) => {
    const finalQuery = customQuery || search;
    if (!finalQuery.trim()) return;

    setSearch(finalQuery);
    setLoading(true);
    setSearched(true);

    fetch(
      `https://www.educationinkarachi.net/wp-json/wp/v2/posts?search=${encodeURIComponent(
        finalQuery
      )}&per_page=20&_embed`
    )
      .then((r) => r.json())
      .then((data) => setPosts(Array.isArray(data) ? data : []))
      .catch((e) => console.log(e))
      .finally(() => setLoading(false));
  };

  const clearSearch = () => {
    setSearch("");
    setPosts([]);
    setSearched(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryDark} />

      <View style={styles.header}>
     <Text style={styles.headerTitle}>Categories</Text>
        <Text style={styles.headerSub}>
          Search admissions, jobs, results, books & guides
        </Text>
      </View>

      <View style={styles.searchWrap}>
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>🔍</Text>

          <TextInput
            style={styles.searchInput}
            placeholder="Search anything..."
            placeholderTextColor="#9aa0ab"
            value={search}
            onChangeText={setSearch}
            onSubmitEditing={() => runSearch()}
            returnKeyType="search"
          />

          {search.length > 0 && (
            <Pressable onPress={clearSearch} hitSlop={10}>
              <Text style={styles.clearText}>✕</Text>
            </Pressable>
          )}
        </View>

        <Pressable style={styles.searchButton} onPress={() => runSearch()}>
          <Text style={styles.searchButtonText}>Search</Text>
        </Pressable>
      </View>

      {!searched && (
        <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
         <Text style={styles.sectionTitle}>Browse Categories</Text>

          <View style={styles.grid}>
            {EXPLORE_CARDS.map((item, index) => (
              <Pressable
                key={index}
                style={styles.exploreCard}
                onPress={() => {
                  if (item.route) {
                    router.push(item.route as any);
                  } else if (item.query) {
                    runSearch(item.query);
                  }
                }}
              >
                <Text style={styles.exploreIcon}>{item.icon}</Text>
                <Text style={styles.exploreTitle}>{item.title}</Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.aiBox}>
            <Text style={styles.aiTitle}>🤖 Ask Rahnuma AI</Text>
            <Text style={styles.aiText}>
              Coming soon: career guidance, program suggestions and admission help.
            </Text>
          </View>
        </ScrollView>
      )}

      {searched &&
        (loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Searching...</Text>
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
        ))}
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

  searchWrap: {
    paddingHorizontal: 16,
    paddingTop: 16,
    flexDirection: "row",
    gap: 10,
  },

  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 52,
    borderWidth: 1,
    borderColor: COLORS.border,
    elevation: 2,
  },

  searchIcon: { fontSize: 15, marginRight: 8 },

  searchInput: {
    flex: 1,
    fontSize: 15,
    color: COLORS.text,
  },

  clearText: {
    fontSize: 18,
    color: COLORS.textSoft,
    fontWeight: "800",
  },

  searchButton: {
    height: 52,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
  },

  searchButtonText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 13,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: COLORS.text,
    marginTop: 22,
    marginBottom: 8,
    paddingHorizontal: 18,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 12,
    justifyContent: "space-between",
  },

  exploreCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 18,
    marginTop: 12,
    minHeight: 105,
    borderWidth: 1,
    borderColor: COLORS.border,
    elevation: 2,
  },

  exploreIcon: {
    fontSize: 28,
    marginBottom: 8,
  },

  exploreTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: COLORS.text,
  },

  aiBox: {
    backgroundColor: COLORS.primary,
    margin: 16,
    borderRadius: 18,
    padding: 18,
  },

  aiTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
  },

  aiText: {
    color: "#ffffffcc",
    marginTop: 6,
    fontSize: 13,
    lineHeight: 19,
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