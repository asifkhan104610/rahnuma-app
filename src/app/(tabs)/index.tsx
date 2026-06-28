import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, Pressable, RefreshControl, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppDrawer from "../../components/AppDrawer";
import NoInternet from "../../components/NoInternet";
import SkeletonCard from "../../components/SkeletonCard";
import { COLORS } from "../../theme";
const API = "https://educationinkarachi.net/wp-json/wp/v2";
// Tools (WebView/page wale) - tap par route khule
const TOOLS = [
  { categoryId: 154, name: "Admissions", desc: "Find admissions", icon: "🎓", color: "#061A36" },
  { categoryId: 806, name: "Results", desc: "Check results", icon: "📊", color: "#061A36" },
  { categoryId: 155, name: "Scholarships", desc: "Financial aid", icon: "🎁", color: "#061A36" },
  { categoryId: 171, name: "MDCAT / ECAT", desc: "Preparation", icon: "📚", color: "#061A36" },
  { categoryId: 2514, name: "Past Papers", desc: "Solved papers", icon: "📝", color: "#061A36" },
  { categoryId: 1274, name: "Jobs", desc: "Career opportunities", icon: "💼", color: "#061A36" },
];

// Categories (posts wale) - tap par us category ki posts
const CATEGORIES = [
  { id: 36, name: "News", desc: "Latest news", icon: "📰", color: "#061A36" },
  { id: 154, name: "Admissions", desc: "Admission updates", icon: "🏫", color: "#061A36" },
  { id: 1274, name: "Jobs", desc: "Latest jobs", icon: "💼", color: "#061A36" },
  { id: 806, name: "Results", desc: "Exam results", icon: "📊", color: "#061A36" },
  { id: 1732, name: "Guess Papers", desc: "Important guesses", icon: "📝", color: "#061A36" },
  { id: 1730, name: "Date Sheets", desc: "Exam schedule", icon: "📅", color: "#061A36" },
  { id: 1522, name: "Forms", desc: "Form updates", icon: "📋", color: "#061A36" },
  { id: 171, name: "MDCAT", desc: "Medical entry test", icon: "🩺", color: "#061A36"},
  { id: 155, name: "Scholarships", desc: "Funding chances", icon: "🎁", color: "#061A36" },
  { id: 1356, name: "Trending", desc: "Hot topics", icon: "🔥", color: "#061A36" },
  { id: 621, name: "Uni Ranking", desc: "Top universities", icon: "🏆", color: "#061A36" },
  { id: 2514, name: "Past Papers", desc: "Solved papers", icon: "📚", color: "#061A36" },
  { id: 2564, name: "Practice Tests", desc: "MCQ quizzes", icon: "✅", color: "#061A36"},
  { id: 2595, name: "Calculators", desc: "Useful tools", icon: "🧮", color: "#061A36" },
  { id: 2597, name: "PDF Books", desc: "Free books", icon: "📖", color: "#061A36" },
];

const SUBCATEGORIES = {
  2514: [
    { id: 2515, name: "Sindh MDCAT" }, { id: 2516, name: "Punjab MDCAT" }, { id: 2517, name: "KPK MDCAT" },
    { id: 2518, name: "Balochistan MDCAT" }, { id: 2519, name: "NUMS MDCAT" }, { id: 2520, name: "FMDC MDCAT" },
  ],
  2564: [
    { id: 2565, name: "Biology" }, { id: 2566, name: "Chemistry" }, { id: 2567, name: "Physics" },
    { id: 2568, name: "English" }, { id: 2569, name: "General Knowledge" }, { id: 2570, name: "Logical Reasoning" },
    { id: 2571, name: "IQ" }, { id: 2572, name: "Analytical Reasoning" }, { id: 2573, name: "Quantitative Reasoning" },
    { id: 2574, name: "MDCAT" }, { id: 2575, name: "ECAT" }, { id: 2576, name: "NTS / GAT / HAT" },
  ],
  1522: [{ id: 2577, name: "SSC Forms" }, { id: 2578, name: "HSSC Forms" }, { id: 2579, name: "ADP Forms" }],
  1730: [{ id: 2580, name: "SSC Date Sheets" }, { id: 2581, name: "HSSC Date Sheets" }],
  1732: [{ id: 2582, name: "Class 9" }, { id: 2583, name: "Class 10" }, { id: 2584, name: "Class 11" }, { id: 2585, name: "Class 12" }, { id: 2586, name: "Colleges Prelim" }],
  806: [{ id: 2587, name: "SSC Results" }, { id: 2588, name: "HSSC Results" }, { id: 2589, name: "ADP Results" }],
  1274: [{ id: 2590, name: "Government Jobs" }, { id: 1276, name: "Private Jobs" }],
  154: [{ id: 2591, name: "Govt Universities" }, { id: 2592, name: "Private Universities" }],
  2597: [{ id: 2598, name: "Class 9" }, { id: 2599, name: "Class 10" }, { id: 2600, name: "Class 11" }, { id: 2601, name: "Class 12" }, { id: 2602, name: "Entry Test" }],
};

function formatDate(dateStr) {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  } catch { return ""; }
}
function cleanText(html) {
  return html.replace(/&amp;/g, "&").replace(/&#8217;/g, "'").replace(/&#8220;/g, '"').replace(/&#8221;/g, '"').replace(/&nbsp;/g, " ").replace(/<[^>]+>/g, "");
}
function getImageUrl(item) {
  return item._embedded?.["wp:featuredmedia"]?.[0]?.source_url || null;
}

function getMeta(item, key) {
  return item?.meta?.[key] || "";
}

function getDaysLeft(dateStr) {
  if (!dateStr) return null;

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const deadline = new Date(dateStr);
    deadline.setHours(0, 0, 0, 0);

    const diff = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  } catch {
    return null;
  }
}

function getDeadlineLabel(daysLeft) {
  if (daysLeft === null) return "Deadline available";
  if (daysLeft < 0) return "Closed";
  if (daysLeft === 0) return "Last Date Today";
  if (daysLeft === 1) return "1 Day Left";
  return `${daysLeft} Days Left`;
}

function SectionHeader({ title, onPress }) {
  return (
    <View style={styles.sectionHeaderRow}>
      <Text style={styles.sectionTitleNoMargin}>{title}</Text>

      <Pressable onPress={onPress} hitSlop={10}>
        <Text style={styles.viewAllText}>View All →</Text>
      </Pressable>
    </View>
  );
}

function LatestHorizontalCard({ item, fallbackIcon = "📰", onPress }) {
  const imageUrl = getImageUrl(item);
  const lastDate = item?.meta?._eik_last_date || "";
  const daysLeft = lastDate ? getDaysLeft(lastDate) : null;

  return (
    <Pressable
      style={styles.horizontalPostCard}
      onPress={onPress}
      android_ripple={{ color: "#F1F5F9" }}
    >
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.horizontalThumb} />
      ) : (
        <View style={[styles.horizontalThumb, styles.horizontalThumbPlaceholder]}>
          <Text style={{ fontSize: 28 }}>{fallbackIcon}</Text>
        </View>
      )}

      <View style={styles.horizontalBody}>
        <Text numberOfLines={2} style={styles.horizontalTitle}>
          {cleanText(item.title?.rendered || "")}
        </Text>

    {item?.meta?._eik_institute ? (
  <>
    <Text numberOfLines={1} style={styles.horizontalMeta}>
      📍 {item.meta._eik_city || "Pakistan"}
    </Text>

    {item.meta._eik_sector ? (
      <View
        style={{
          alignSelf: "flex-start",
          marginTop: 6,
          backgroundColor:
            item.meta._eik_sector.toLowerCase().includes("public")
              ? "#DBEAFE"
              : "#F3E8FF",
          paddingHorizontal: 8,
          paddingVertical: 3,
          borderRadius: 8,
        }}
      >
        <Text
          style={{
            fontSize: 11,
            fontWeight: "800",
            color:
              item.meta._eik_sector.toLowerCase().includes("public")
                ? "#1D4ED8"
                : "#7E22CE",
          }}
        >
          🏛 {item.meta._eik_sector}
        </Text>
      </View>
    ) : null}
  </>
) : null}

        {lastDate ? (
          <>
            <Text style={styles.horizontalDeadline}>
              ⏰ {formatDate(lastDate)}
            </Text>
<Pressable
  onPress={onPress}
  style={{
    marginTop: 10,
    backgroundColor: "#061A36",
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: "center",
  }}
>
  <Text
    style={{
      color: "#D4A032",
      fontWeight: "800",
      fontSize: 12,
    }}
  >
    Apply Now →
  </Text>
</Pressable>


         <View
  style={{
    alignSelf: "flex-start",
    marginTop: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor:
      daysLeft === 0
        ? "#FEE2E2"
        : daysLeft !== null && daysLeft <= 7
        ? "#FFEDD5"
        : "#DCFCE7",
  }}
>
  <Text
    style={{
      fontSize: 11,
      fontWeight: "900",
      color:
        daysLeft === 0
          ? "#B91C1C"
          : daysLeft !== null && daysLeft <= 7
          ? "#C2410C"
          : "#15803D",
    }}
  >
    {daysLeft === 0
      ? "🚨 TODAY"
      : daysLeft !== null && daysLeft <= 7
      ? `⏰ ${daysLeft} DAYS LEFT`
      : "✅ OPEN"}
  </Text>
</View>
          </>
        ) : (
          <Text style={styles.horizontalDate}>{formatDate(item.date)}</Text>
        )}
      </View>
    </Pressable>
  );
}

function HorizontalPostSection({ title, posts, onViewAll, fallbackIcon, onPostPress }) {
  return (
    <View style={styles.horizontalSection}>
      <SectionHeader title={title} onPress={onViewAll} />

      {posts.length === 0 ? (
        <View style={styles.horizontalLoadingCard}>
          <ActivityIndicator size="small" color={COLORS.primary} />
          <Text style={styles.horizontalLoadingText}>Loading...</Text>
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
        >
          {posts.slice(0, 8).map((item) => (
            <LatestHorizontalCard
              key={item.id}
              item={item}
              fallbackIcon={fallbackIcon}
              onPress={() => onPostPress(item)}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
}



function FeaturedUniversityCard({ university, onPress }) {
  return (
    <Pressable
      style={styles.universityCard}
      onPress={onPress}
      android_ripple={{ color: "#EEF2FF" }}
    >
      <View style={styles.universityIconWrap}>
        <Text style={styles.universityIcon}>🎓</Text>
      </View>

      <Text numberOfLines={2} style={styles.universityName}>
        {university.name}
      </Text>

      <Text numberOfLines={1} style={styles.universityCity}>
        📍 {university.city || "Pakistan"}
      </Text>

      <View style={styles.universityBadge}>
        <Text style={styles.universityBadgeText}>
          {university.count} Active {university.count === 1 ? "Admission" : "Admissions"}
        </Text>
      </View>
    </Pressable>
  );
}

function FeaturedUniversitiesSection({ posts, onViewAll, onUniversityPress }) {
  const universitiesMap = {};

  posts.forEach((item) => {
    const meta = item?.meta || {};
    const name = meta._eik_institute || "";
    if (!name) return;

    if (!universitiesMap[name]) {
      universitiesMap[name] = {
        name,
        city: meta._eik_city || "",
        count: 0,
      };
    }

    universitiesMap[name].count += 1;
  });

  const universities = Object.values(universitiesMap)
    .sort((a: any, b: any) => b.count - a.count)
    .slice(0, 10);

  if (universities.length === 0) return null;

  return (
    <View style={styles.universitySection}>
      <SectionHeader title="🎓 Featured Universities" onPress={onViewAll} />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.universityList}
      >
        {universities.map((university: any) => (
          <FeaturedUniversityCard
            key={university.name}
            university={university}
            onPress={() => onUniversityPress(university)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

function ClosingSoonCard({ item, onPress }) {
  const meta = item?.meta || {};
  const institute = meta._eik_institute || cleanText(item.title?.rendered || "Admission");
  const city = meta._eik_city || "Pakistan";
  const lastDate = meta._eik_last_date || "";
  const daysLeft = getDaysLeft(lastDate);
  const urgent = daysLeft !== null && daysLeft <= 7 && daysLeft >= 0;

  return (
    <Pressable
      style={[styles.deadlineCard, urgent && styles.deadlineCardUrgent]}
      onPress={onPress}
      android_ripple={{ color: "#FFF7ED" }}
    >
      <View style={styles.deadlineTopRow}>
        <Text style={styles.deadlineIcon}>{urgent ? "⚠️" : "⏰"}</Text>
        <View style={[styles.deadlineBadge, urgent && styles.deadlineBadgeUrgent]}>
          <Text style={[styles.deadlineBadgeText, urgent && styles.deadlineBadgeTextUrgent]}>
            {getDeadlineLabel(daysLeft)}
          </Text>
        </View>
      </View>

      <Text numberOfLines={2} style={styles.deadlineInstitute}>
        {institute}
      </Text>

      <Text style={styles.deadlineCity}>📍 {city}</Text>

      <View style={styles.deadlineFooter}>
        <Text style={styles.deadlineDate}>
          Last Date: {lastDate ? formatDate(lastDate) : "Check details"}
        </Text>
        <Text style={styles.deadlineOpen}>Open →</Text>
      </View>
    </Pressable>
  );
}

function ClosingSoonSection({ posts, onViewAll, onPostPress }) {
  const closingPosts = posts
    .filter((item) => {
      const daysLeft = getDaysLeft(item?.meta?._eik_last_date);
      return daysLeft !== null && daysLeft >= 0;
    })
    .sort((a, b) => {
      const da = getDaysLeft(a?.meta?._eik_last_date) ?? 9999;
      const db = getDaysLeft(b?.meta?._eik_last_date) ?? 9999;
      return da - db;
    })
    .slice(0, 8);

  if (closingPosts.length === 0) return null;

  return (
    <View style={styles.closingSection}>
      <SectionHeader title="⏰ Closing Soon" onPress={onViewAll} />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.deadlineList}
      >
        {closingPosts.map((item) => (
          <ClosingSoonCard
            key={item.id}
            item={item}
            onPress={() => onPostPress(item)}
          />
        ))}
      </ScrollView>
    </View>
  );
}
export default function HomeScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [activeCat, setActiveCat] = useState<number | null>(null); // null = grid dikhe, koi id = us ki posts
  const [activeSub, setActiveSub] = useState(null);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [posts, setPosts] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [homeError, setHomeError] = useState(false);
const [latestAdmissions, setLatestAdmissions] = useState([]);
const [sectorFilter, setSectorFilter] = useState("all");
const [cityFilter, setCityFilter] = useState("all");
const [latestJobs, setLatestJobs] = useState([]);
const [latestNews, setLatestNews] = useState([]);
const [latestResults, setLatestResults] = useState([]);
const [stats, setStats] = useState({
  admissions: 0,
  jobs: 0,
  news: 0,
  scholarships: 0,
});
  const effectiveCat = activeSub || activeCat;
  const subs = activeCat ? (SUBCATEGORIES[activeCat] || null) : null;
  const showingPosts = activeCat !== null || query.trim() !== "";
useEffect(() => {
  if (params.cat) {
    const catId = Number(params.cat);

    if (!isNaN(catId)) {
      setActiveCat(catId);
      setActiveSub(null);
      setQuery("");
      setSearch("");
      setPosts([]);
    }
  }
}, [params.cat]);
  const buildUrl = useCallback((pageNum) => {
    const base = "https://www.educationinkarachi.net/wp-json/wp/v2/posts";
    if (query.trim() !== "") return `${base}?search=${encodeURIComponent(query)}&per_page=10&page=${pageNum}&_embed`;
    return `${base}?categories=${effectiveCat}&per_page=10&page=${pageNum}&_embed`;
  }, [effectiveCat, query]);

const loadFirst = useCallback(() => {
  if (!showingPosts) return;

  setLoading(true);
  setHomeError(false);
  setPage(1);
  setHasMore(true);

  fetch(buildUrl(1))
    .then((r) => r.json())
    .then((data) => {
      setPosts(Array.isArray(data) ? data : []);
      if (!Array.isArray(data) || data.length < 10) setHasMore(false);
    })
    .catch((e) => {
      console.log("Error:", e);
      setHomeError(true);
    })
    .finally(() => setLoading(false));
}, [buildUrl, showingPosts]);

  useEffect(() => { loadFirst(); }, [loadFirst]);
useEffect(() => {
  const loadCategory = async (
    categoryId: number,
    setter: (data: any[]) => void,
    limit = 5,
    sortByDeadline = false
  ) => {
    try {
      const res = await fetch(
        `${API}/posts?categories=${categoryId}&per_page=${limit}&_embed`
      );

      const data = await res.json();
      const list = Array.isArray(data) ? data : [];

      if (sortByDeadline) {
        const sorted = [...list].sort((a, b) => {
          const da = getDaysLeft(a?.meta?._eik_last_date) ?? 9999;
          const db = getDaysLeft(b?.meta?._eik_last_date) ?? 9999;

          if (da < 0 && db >= 0) return 1;
          if (db < 0 && da >= 0) return -1;

          return da - db;
        });

        setter(sorted);
        return;
      }

      setter(list);
    } catch (error) {
      console.log("Category load error:", error);
      setter([]);
    }
  };
const loadCount = async (
  categoryId: number,
  key: "admissions" | "jobs" | "news" | "scholarships"
) => {
  try {
    const res = await fetch(
      `${API}/posts?categories=${categoryId}&per_page=1`
    );

    const total = Number(res.headers.get("X-WP-Total")) || 0;

    setStats((prev) => ({
      ...prev,
      [key]: total,
    }));
  } catch (e) {
    console.log("Count error:", e);
  }
};
  loadCategory(154, setLatestAdmissions, 30, true);
  loadCategory(1274, setLatestJobs, 5);
  loadCategory(806, setLatestResults, 5);
  loadCategory(36, setLatestNews, 5);

  loadCount(154, "admissions");
loadCount(1274, "jobs");
loadCount(36, "news");
loadCount(155, "scholarships");
}, []);
  const onRefresh = useCallback(() => {
    setRefreshing(true); setPage(1); setHasMore(true);
    fetch(buildUrl(1)).then((r) => r.json()).then((data) => {
      setPosts(Array.isArray(data) ? data : []);
      if (!Array.isArray(data) || data.length < 10) setHasMore(false);
    }).catch((e) => console.log("Error:", e)).finally(() => setRefreshing(false));
  }, [buildUrl]);

  const loadMore = useCallback(() => {
    if (loadingMore || !hasMore || loading) return;
    const next = page + 1; setLoadingMore(true);
    fetch(buildUrl(next)).then((r) => r.json()).then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        setPosts((prev) => [...prev, ...data]); setPage(next);
        if (data.length < 10) setHasMore(false);
      } else setHasMore(false);
    }).catch((e) => console.log("Error:", e)).finally(() => setLoadingMore(false));
  }, [buildUrl, page, hasMore, loadingMore, loading]);

  const openCategory = (id) => { setActiveCat(id); setActiveSub(null); setQuery(""); setSearch(""); };
  const openUniversity = (university) => {
    setActiveCat(null);
    setActiveSub(null);
    setSearch(university.name);
    setQuery(university.name);
    setPosts([]);
  };
const goHome = () => {
  setActiveCat(null);
  setActiveSub(null);
  setQuery("");
  setSearch("");
  setPosts([]);
  router.replace("/");
};
const filteredAdmissions = latestAdmissions.filter((item: any) => {
  const sector = item?.meta?._eik_sector?.toLowerCase() || "";
  const city = item?.meta?._eik_city || "";

  const sectorMatch =
    sectorFilter === "all" || sector.includes(sectorFilter);

  const cityMatch =
    cityFilter === "all" || city === cityFilter;

  return sectorMatch && cityMatch;
});
const cities = [
  "all",
  ...new Set(
    latestAdmissions
      .map((item: any) => item?.meta?._eik_city)
      .filter(Boolean)
  ),
];
  const runSearch = () => { if (search.trim()) setQuery(search); };
  const clearSearch = () => { setSearch(""); setQuery(""); };

  // ===== GRID HOME (cards) =====
  if (!showingPosts) {
    return (
 <SafeAreaView style={styles.container} edges={["bottom"]}>
  <StatusBar
    barStyle="light-content"
    backgroundColor={COLORS.primaryDark}
  />

  <AppDrawer
    visible={drawerOpen}
    onClose={() => setDrawerOpen(false)}
  />

<View style={styles.header}>
  <Pressable
    onPress={() => setDrawerOpen(true)}
    style={styles.infoBtn}
    hitSlop={10}
  >
    <Text style={styles.infoIcon}>☰</Text>
  </Pressable>

  <View style={[styles.headerTextWrap, { alignItems: "center" }]}>
    <Text style={styles.headerTitle}>Education in Pakistan</Text>
    <Text style={styles.headerSub}>
      Your Guide to Education & Careers
    </Text>
  </View>

  <Pressable
  onPress={() => router.push("/notifications")}
  style={styles.infoBtn}
  hitSlop={10}
>
  <Text style={styles.infoIcon}>🔔</Text>
</Pressable>
</View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
        >
<View style={styles.heroBanner}>
 <View style={[styles.heroContent, { justifyContent: "center" }]}>
  <View style={{ flex: 1, alignItems: "center" }}>

      <View style={styles.heroBadge}>
        <Text style={styles.heroBadgeText}>🎓 Pakistan's Education Guide</Text>
      </View>

      <Text style={styles.heroTitle}>
        Welcome to{"\n"}
        <Text style={styles.heroHighlight}>Education in Pakistan</Text>
      </Text>

      <Text style={styles.heroSub}>
        Admissions • Jobs • Results • Scholarships
      </Text>

      <Text style={styles.heroTagline}>
        We Guide | You Grow
      </Text>

      <Pressable
        style={styles.heroButton}
        onPress={() => router.push("/ai")}
      >
        <Text style={styles.heroButtonText}>
          🤖 Ask Education AI
        </Text>
      </Pressable>

    </View>

 
  </View>
</View>

<View style={styles.highlightsRow}>
  <View style={styles.highlightCard}>
    <Text style={styles.highlightIcon}>🎓</Text>
  <Text style={styles.statNumber}>{stats.admissions.toLocaleString()}+</Text>
    <Text style={styles.highlightLabel}>Admissions</Text>
  </View>

  <View style={styles.highlightCard}>
    <Text style={styles.highlightIcon}>💼</Text>
   <Text style={styles.statNumber}>{stats.jobs.toLocaleString()}+</Text>
    <Text style={styles.highlightLabel}>Jobs</Text>
  </View>

  <View style={styles.highlightCard}>
    <Text style={styles.highlightIcon}>🏆</Text>
<Text style={styles.statNumber}>{stats.scholarships.toLocaleString()}+</Text>
<Text style={styles.statLabel}>Scholarships</Text>
  </View>

  <View style={styles.highlightCard}>
    <Text style={styles.highlightIcon}>📰</Text>
 <Text style={styles.statNumber}>{stats.news.toLocaleString()}+</Text>
<Text style={styles.statLabel}>News</Text>
  </View>
</View>

          {/* Search */}
          <View style={styles.searchWrap}>
            <View style={styles.searchBox}>
              <Text style={styles.searchIcon}>🔍</Text>
              <TextInput
                style={styles.searchInput}
                placeholder="Search anything..."
                placeholderTextColor="#9aa0ab"
                value={search}
                onChangeText={setSearch}
                onSubmitEditing={runSearch}
                returnKeyType="search"
              />
            </View>
          </View>

     {/* Tools */}
       <Text style={styles.sectionTitle}>Quick Access</Text>
          <View style={styles.grid}>
            {TOOLS.map((t) => (
              <Pressable key={t.key} style={[styles.card, { backgroundColor: t.color }]} android_ripple={{ color: "#ffffff20" }} onPress={() => openCategory(t.categoryId)}>
                <Text style={styles.cardIcon}>{t.icon}</Text>
                <Text style={styles.cardName}>{t.name}</Text>
                <Text style={styles.cardDesc}>{t.desc}</Text>
              </Pressable>
            ))}
          </View>
<View style={styles.filterRow}>
  {[
    { key: "all", label: "All" },
    { key: "public", label: "🏛 Government" },
    { key: "private", label: "🏢 Private" },
  ].map((item) => (
    <Pressable
      key={item.key}
      onPress={() => setSectorFilter(item.key)}
      style={[
        styles.filterChip,
        sectorFilter === item.key && styles.filterChipActive,
      ]}
    >
      <Text
        style={[
          styles.filterChipText,
          sectorFilter === item.key && styles.filterChipTextActive,
        ]}
      >
        {item.label}
      </Text>
    </Pressable>
  ))}
</View>

<ScrollView
  horizontal
  showsHorizontalScrollIndicator={false}
  contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 10 }}
>
  {cities.map((city) => (
    <Pressable
      key={city}
      onPress={() => setCityFilter(city)}
      style={[
        styles.filterChip,
        cityFilter === city && styles.filterChipActive,
        { marginRight: 8 },
      ]}
    >
      <Text
        style={[
          styles.filterChipText,
          cityFilter === city && styles.filterChipTextActive,
        ]}
      >
        {city === "all" ? "🌍 All Cities" : `📍 ${city}`}
      </Text>
    </Pressable>
  ))}
</ScrollView>

        <ClosingSoonSection
  posts={filteredAdmissions}
  onViewAll={() => openCategory(154)}
  onPostPress={(item) => router.push(`/${item.id}`)}
/>
<FeaturedUniversitiesSection
  posts={filteredAdmissions}
  onViewAll={() => openCategory(154)}
  onUniversityPress={openUniversity}
/>
  <HorizontalPostSection
  title="🔥 Latest Admissions"
  posts={filteredAdmissions}
  fallbackIcon="🏫"
  onViewAll={() => openCategory(154)}
  onPostPress={(item) => router.push(`/${item.id}`)}
/>

<HorizontalPostSection
  title="💼 Latest Jobs"
  posts={latestJobs}
  fallbackIcon="💼"
  onViewAll={() => openCategory(1274)}
  onPostPress={(item) => router.push(`/${item.id}`)}
/>

<HorizontalPostSection
  title="📊 Latest Results"
  posts={latestResults}
  fallbackIcon="📊"
  onViewAll={() => openCategory(806)}
  onPostPress={(item) => router.push(`/${item.id}`)}
/>

<HorizontalPostSection
  title="📰 Latest News"
  posts={latestNews}
  fallbackIcon="📰"
  onViewAll={() => openCategory(36)}
  onPostPress={(item) => router.push(`/${item.id}`)}
/>
     
<View style={styles.aiBox}>
  <View style={styles.aiTopRow}>
    <View style={styles.aiIconCircle}>
      <Text style={styles.aiIcon}>🤖</Text>
    </View>

    <View style={{ flex: 1 }}>
      <Text style={styles.aiTitle}>Education AI Assistant</Text>
      <Text style={styles.aiSubtitle}>Admissions • Careers • Study Help</Text>
    </View>
  </View>

  <Text style={styles.aiText}>
    Ask about admissions, universities, eligibility, scholarships, jobs and career guidance.
  </Text>

  <Pressable
    style={styles.aiButton}
    onPress={() => router.push("/ai")}
  >
    <Text style={styles.aiButtonText}>Launch AI Assistant →</Text>
  </Pressable>
</View>
          {/* Categories */}
          <Text style={styles.sectionTitle}>Categories</Text>
          <View style={styles.grid}>
            {CATEGORIES.map((c) => (
              <Pressable key={c.id} style={[styles.card, { backgroundColor: c.color }]} android_ripple={{ color: "#ffffff20" }} onPress={() => openCategory(c.id)}>
                <Text style={styles.cardIcon}>{c.icon}</Text>
                <Text style={styles.cardName}>{c.name}</Text>
                <Text style={styles.cardDesc}>{c.desc}</Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ===== POSTS VIEW =====
  const catName = query.trim() !== "" ? `Search: ${query}` : (CATEGORIES.find((c) => c.id === activeCat)?.name || "Posts");

  const ListHeader = subs ? (
    <View style={styles.subWrap}>
      <Pressable onPress={() => setActiveSub(null)} style={[styles.subChip, activeSub === null && styles.subChipActive]}>
        <Text style={[styles.subText, activeSub === null && styles.subTextActive]}>All</Text>
      </Pressable>
      {subs.map((sub) => (
        <Pressable key={sub.id} onPress={() => setActiveSub(sub.id)} style={[styles.subChip, activeSub === sub.id && styles.subChipActive]}>
          <Text style={[styles.subText, activeSub === sub.id && styles.subTextActive]}>{sub.name}</Text>
        </Pressable>
      ))}
    </View>
  ) : null;

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryDark} />
      <View style={styles.header}>
        <Pressable onPress={goHome} hitSlop={10} style={{ marginRight: 12 }}>
          <Text style={{ fontSize: 22, color: "#fff" }}>←</Text>
        </Pressable>
        <View style={styles.headerTextWrap}>
          <Text style={styles.headerTitle}>{catName}</Text>
        </View>
      </View>
{homeError ? (
  <NoInternet loading={loading} onRetry={loadFirst} />
) : loading ? (
       <View style={{ paddingTop: 14 }}>
  <SkeletonCard />
  <SkeletonCard />
  <SkeletonCard />
</View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item, index) => item.id.toString() + "_" + index}
          ListHeaderComponent={ListHeader}
          contentContainerStyle={{ paddingBottom: 120 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} tintColor={COLORS.primary} />}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={loadingMore ? <ActivityIndicator size="small" color={COLORS.primary} style={{ marginVertical: 24 }} /> : null}
          ListEmptyComponent={<Text style={styles.empty}>Koi post nahi mili.</Text>}
          renderItem={({ item }) => {
            const imageUrl = item._embedded?.["wp:featuredmedia"]?.[0]?.source_url || null;
            return (
              <Pressable style={styles.postCard} android_ripple={{ color: "#f0f0f0" }} onPress={() => router.push(`/${item.id}`)}>
                {imageUrl ? <Image source={{ uri: imageUrl }} style={styles.thumb} /> : <View style={[styles.thumb, styles.thumbPlaceholder]}><Text style={{ fontSize: 26 }}>📰</Text></View>}
                <View style={styles.postBody}>
                  <Text style={styles.postTitle} numberOfLines={3}>{cleanText(item.title.rendered)}</Text>
                  <View style={styles.postFooter}><View style={styles.dot} /><Text style={styles.date}>{formatDate(item.date)}</Text></View>
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
  center: { flex: 1, justifyContent: "center", alignItems: "center", paddingTop: 60 },
  loadingText: { marginTop: 12, color: COLORS.textSoft },
  empty: { textAlign: "center", marginTop: 50, color: COLORS.textSoft },

  header: {
   backgroundColor: "#061A36",
    paddingTop: 52,
    paddingBottom: 18,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  headerTextWrap: { flex: 1 },
headerTitle: {
  fontSize: 20,
  fontWeight: "800",
  color: "#fff",
},
 headerSub: {
  fontSize: 13,
  color: "#c7ccf0",
  marginTop: 4,
},
 infoBtn: {
  width: 48,
  height: 48,
  borderRadius: 24,
  backgroundColor: "rgba(255,255,255,0.15)",
  alignItems: "center",
  justifyContent: "center",
},
  infoIcon: { fontSize: 22 },

  searchWrap: { paddingHorizontal: 16, paddingTop: 16 },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 54,
    borderWidth: 1,
    borderColor: COLORS.border,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },

filterRow: {
  flexDirection: "row",
  paddingHorizontal: 16,
  paddingTop: 12,
  gap: 8,
},

filterChip: {
  backgroundColor: "#fff",
  borderWidth: 1,
  borderColor: "#E2E8F0",
  borderRadius: 18,
  paddingHorizontal: 13,
  paddingVertical: 8,
},

filterChipActive: {
  backgroundColor: "#061A36",
  borderColor: "#D4A032",
},

filterChipText: {
  color: "#64748B",
  fontSize: 12,
  fontWeight: "800",
},

filterChipTextActive: {
  color: "#D4A032",
},

  searchIcon: { fontSize: 15, marginRight: 8 },
  searchInput: { flex: 1, fontSize: 15, color: COLORS.text },

  sectionTitle: { fontSize: 17, fontWeight: "800", color: COLORS.text, marginTop: 22, marginBottom: 4, paddingHorizontal: 18 },
featuredWrap: {
  marginTop: 6,
},
latestDate: {
  fontSize: 12,
  color: COLORS.textSoft,
  marginTop: 6,
  fontWeight: "600",
},
featuredCard: {
  width: 240,
  minHeight: 115,
  borderRadius: 18,
  padding: 16,
  marginRight: 12,
  justifyContent: "center",
  elevation: 4,
},

featuredIcon: {
  fontSize: 26,
  marginBottom: 8,
},

featuredTitle: {
  color: "#fff",
  fontSize: 16,
  fontWeight: "800",
},
sectionHeaderRow: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  paddingHorizontal: 18,
  marginTop: 22,
  marginBottom: 4,
},

sectionTitleNoMargin: {
  fontSize: 17,
  fontWeight: "800",
  color: COLORS.text,
},
aiButton: {
  marginTop: 12,
  backgroundColor: "#D4A032",
  paddingVertical: 12,
  borderRadius: 12,
  alignItems: "center",
},

aiButtonText: {
  color: "#061A36",
  fontWeight: "800",
},
viewAllText: {
  fontSize: 13,
  fontWeight: "800",
  color: COLORS.primary,
},
featuredDesc: {
  color: "#ffffffcc",
  fontSize: 12,
  marginTop: 3,
},
  grid: { flexDirection: "row", flexWrap: "wrap", paddingHorizontal: 12, justifyContent: "space-between" },
  card: {
    width: "48%",
    borderRadius: 18,
    padding: 16,
    marginTop: 12,
    minHeight: 120,
    justifyContent: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  cardIcon: { fontSize: 28, marginBottom: 8 },
  cardName: { color: "#fff", fontWeight: "800", fontSize: 16 },
  cardDesc: { color: "#ffffffcc", fontSize: 12, marginTop: 2 },
latestCard: {
  flexDirection: "row",
  backgroundColor: "#fff",
  marginHorizontal: 16,
  marginTop: 10,
  borderRadius: 14,
  borderWidth: 1,
  borderColor: "#ECEEF3",
  overflow: "hidden",
  elevation: 2,
},
latestThumb: {
  width: 86,
  height: 86,
},

latestThumbPlaceholder: {
  backgroundColor: "#F1F5F9",
  alignItems: "center",
  justifyContent: "center",
},

latestBody: {
  flex: 1,
  padding: 12,
  justifyContent: "center",
},
latestTitle: {
  fontSize: 14,
  fontWeight: "700",
  color: COLORS.text,
},

horizontalSection: {
  marginTop: 2,
},

horizontalList: {
  paddingHorizontal: 16,
  paddingTop: 8,
  paddingBottom: 4,
},

horizontalPostCard: {
  width: 230,
  backgroundColor: "#fff",
  borderRadius: 18,
  marginRight: 12,
  borderWidth: 1,
  borderColor: "#ECEEF3",
  overflow: "hidden",
  elevation: 3,
  shadowColor: "#000",
  shadowOpacity: 0.08,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 3 },
},

horizontalThumb: {
  width: "100%",
  height: 118,
},

horizontalThumbPlaceholder: {
  backgroundColor: "#F1F5F9",
  alignItems: "center",
  justifyContent: "center",
},

horizontalBody: {
  padding: 12,
  minHeight: 86,
},

horizontalTitle: {
  fontSize: 14,
  fontWeight: "800",
  color: COLORS.text,
  lineHeight: 20,
},

horizontalDate: {
  fontSize: 12,
  color: COLORS.textSoft,
  marginTop: 8,
  fontWeight: "700",
},

horizontalLoadingCard: {
  marginHorizontal: 16,
  marginTop: 10,
  backgroundColor: "#fff",
  borderRadius: 18,
  padding: 18,
  borderWidth: 1,
  borderColor: "#E2E8F0",
  flexDirection: "row",
  alignItems: "center",
},

horizontalLoadingText: {
  marginLeft: 10,
  color: COLORS.textSoft,
  fontWeight: "700",
},

universitySection: {
  marginTop: 2,
},

universityList: {
  paddingHorizontal: 16,
  paddingTop: 8,
  paddingBottom: 6,
},

universityCard: {
  width: 210,
  backgroundColor: "#fff",
  borderRadius: 20,
  padding: 16,
  marginRight: 12,
  borderWidth: 1,
  borderColor: "#E2E8F0",
  elevation: 3,
  shadowColor: "#000",
  shadowOpacity: 0.08,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 3 },
},

universityIconWrap: {
  width: 46,
  height: 46,
  borderRadius: 23,
  backgroundColor: "#EEF2FF",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: 12,
},

universityIcon: {
  fontSize: 24,
},

universityName: {
  fontSize: 15,
  fontWeight: "900",
  color: "#061A36",
  lineHeight: 20,
  minHeight: 40,
},

universityCity: {
  color: COLORS.textSoft,
  fontSize: 12,
  fontWeight: "700",
  marginTop: 6,
},

universityBadge: {
  marginTop: 12,
  backgroundColor: "#FFF8E6",
  borderRadius: 14,
  paddingVertical: 7,
  paddingHorizontal: 10,
  alignSelf: "flex-start",
},

universityBadgeText: {
  color: "#A16207",
  fontSize: 11,
  fontWeight: "900",
},

horizontalMeta: {
  fontSize: 12,
  color: COLORS.textSoft,
  marginTop: 8,
  fontWeight: "700",
},

horizontalDeadline: {
  fontSize: 12,
  color: "#B45309",
  marginTop: 6,
  fontWeight: "900",
},

closingSection: {
  marginTop: 4,
},

deadlineList: {
  paddingHorizontal: 16,
  paddingTop: 8,
  paddingBottom: 6,
},

deadlineCard: {
  width: 250,
  backgroundColor: "#fff",
  borderRadius: 20,
  marginRight: 12,
  padding: 16,
  borderWidth: 1,
  borderColor: "#E2E8F0",
  elevation: 3,
  shadowColor: "#000",
  shadowOpacity: 0.08,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 3 },
},

deadlineCardUrgent: {
  borderColor: "#FDBA74",
  backgroundColor: "#FFF7ED",
},

deadlineTopRow: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: 10,
},

deadlineIcon: {
  fontSize: 24,
},

deadlineBadge: {
  backgroundColor: "#EEF2FF",
  paddingHorizontal: 10,
  paddingVertical: 5,
  borderRadius: 14,
},

deadlineBadgeUrgent: {
  backgroundColor: "#FED7AA",
},

deadlineBadgeText: {
  color: COLORS.primary,
  fontSize: 11,
  fontWeight: "900",
},

deadlineBadgeTextUrgent: {
  color: "#9A3412",
},

deadlineInstitute: {
  fontSize: 16,
  lineHeight: 22,
  fontWeight: "900",
  color: "#061A36",
  minHeight: 44,
},

deadlineCity: {
  marginTop: 8,
  color: "#64748B",
  fontSize: 13,
  fontWeight: "700",
},

deadlineFooter: {
  marginTop: 12,
  borderTopWidth: 1,
  borderTopColor: "#E2E8F0",
  paddingTop: 10,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
},

deadlineDate: {
  flex: 1,
  color: "#B45309",
  fontSize: 12,
  fontWeight: "900",
},

deadlineOpen: {
  color: COLORS.primary,
  fontSize: 12,
  fontWeight: "900",
  marginLeft: 8,
},
  subWrap: { flexDirection: "row", flexWrap: "wrap", paddingHorizontal: 12, paddingVertical: 12, backgroundColor: COLORS.card },
  subChip: { paddingHorizontal: 13, paddingVertical: 6, backgroundColor: COLORS.accentSoft, borderRadius: 16, margin: 4 },
  subChipActive: { backgroundColor: COLORS.accent },
  subText: { color: COLORS.accent, fontWeight: "700", fontSize: 12 },
  subTextActive: { color: "#fff" },

  postCard: { flexDirection: "row", backgroundColor: COLORS.card, borderRadius: 16, marginHorizontal: 16, marginTop: 12, overflow: "hidden", elevation: 2, shadowColor: "#000", shadowOpacity: 0.07, shadowRadius: 6, shadowOffset: { width: 0, height: 3 } },
  thumb: { width: 104, height: 104 },
  thumbPlaceholder: { backgroundColor: "#f0f2f7", justifyContent: "center", alignItems: "center" },
  postBody: { flex: 1, padding: 14, justifyContent: "center" },
  postTitle: { fontSize: 15, fontWeight: "700", color: COLORS.text, lineHeight: 21 },
  postFooter: { flexDirection: "row", alignItems: "center", marginTop: 10 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.accent, marginRight: 7 },
  date: { fontSize: 12, color: COLORS.textSoft, fontWeight: "600" },

heroBanner: {
  marginHorizontal: 16,
  marginTop: 10,
  borderRadius: 24,
  backgroundColor: "#061A36",
  padding: 16,
  borderWidth: 1,
  borderColor: "#D4A032",
  elevation: 8,
},

heroContent: {
  flexDirection: "row",
  alignItems: "center",
},

heroSmall: {
  color: "#ffffff",
  fontSize: 18,
  fontWeight: "600",
  textAlign: "center",
},

heroBig: {
  color: "#D4A032",
  fontSize: 32,
  fontWeight: "800",
  marginTop: 4,
  textAlign: "center",
},

heroDesc: {
  color: "#ffffffcc",
  fontSize: 13,
  marginTop: 4,
  textAlign: "center",
},
statsWrap: {
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "space-between",
  paddingHorizontal: 16,
  marginTop: 14,
},

statCard: {
  width: "48%",
  backgroundColor: "#fff",
  borderRadius: 18,
  paddingVertical: 18,
  marginBottom: 10,
  alignItems: "center",
  borderWidth: 1,
  borderColor: "#E2E8F0",
  elevation: 2,
},

statNumber: {
  fontSize: 22,
  fontWeight: "900",
  color: "#061A36",
},

statLabel: {
  marginTop: 4,
  fontSize: 12,
  fontWeight: "700",
  color: "#64748B",
},

heroBadge: {
  alignSelf: "flex-start",
  backgroundColor: "rgba(212,160,50,0.15)",
  borderColor: "#D4A032",
  borderWidth: 1,
  borderRadius: 20,
  paddingHorizontal: 10,
  paddingVertical: 5,
  marginBottom: 14,
},

heroBadgeText: {
  color: "#D4A032",
  fontSize: 11,
  fontWeight: "800",
},

heroTitle: {
  color: "#fff",
  fontSize: 25,
  fontWeight: "900",
  lineHeight: 31,
},

heroHighlight: {
  color: "#D4A032",
  textAlign: "center",
},

heroSub: {
  color: "#ffffffcc",
  marginTop: 8,
  fontSize: 13,
  lineHeight: 20,
},

heroTagline: {
  color: "#D4A032",
  fontSize: 15,
  fontWeight: "900",
  marginTop: 10,
},

heroButton: {
  marginTop: 14,
  backgroundColor: "#D4A032",
  paddingHorizontal: 16,
  paddingVertical: 10,
  borderRadius: 14,
  alignSelf: "flex-start",
},

heroButtonText: {
  color: "#061A36",
  fontWeight: "900",
  fontSize: 13,
},
aiBox: {
  backgroundColor: "#061A36",
  marginHorizontal: 16,
  marginTop: 22,
  borderRadius: 22,
  padding: 18,
  borderWidth: 1,
  borderColor: "#D4A032",
  elevation: 4,
},

aiTopRow: {
  flexDirection: "row",
  alignItems: "center",
},

aiIconCircle: {
  width: 52,
  height: 52,
  borderRadius: 26,
  backgroundColor: "rgba(212,160,50,0.15)",
  alignItems: "center",
  justifyContent: "center",
  marginRight: 12,
  borderWidth: 1,
  borderColor: "#D4A032",
},

aiIcon: {
  fontSize: 26,
},

aiTitle: {
  color: "#fff",
  fontSize: 18,
  fontWeight: "900",
},

aiSubtitle: {
  color: "#D4A032",
  fontSize: 12,
  fontWeight: "800",
  marginTop: 3,
},

aiText: {
  color: "#ffffffcc",
  fontSize: 14,
  lineHeight: 22,
  marginTop: 14,
},

aiButton: {
  marginTop: 16,
  backgroundColor: "#D4A032",
  paddingVertical: 13,
  borderRadius: 14,
  alignItems: "center",
},

aiButtonText: {
  color: "#061A36",
  fontWeight: "900",
  fontSize: 14,
},

highlightsRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  marginHorizontal: 16,
  marginTop: 18,
},

highlightCard: {
  flex: 1,
  backgroundColor: "#fff",
  borderRadius: 16,
  paddingVertical: 14,
  marginHorizontal: 4,
  alignItems: "center",
  elevation: 3,
},

highlightIcon: {
  fontSize: 22,
},

highlightNumber: {
  marginTop: 6,
  fontSize: 18,
  fontWeight: "900",
  color: "#061A36",
},

highlightLabel: {
  marginTop: 2,
  fontSize: 11,
  color: "#666",
  fontWeight: "700",
},
founderImage: {
  width: 120,
  height: 120,
  borderRadius: 60,
  borderWidth: 3,
  borderColor: "#D4A032",
}

});