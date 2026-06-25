import { useRouter } from "expo-router";
import { Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";

const DOWNLOADS = [
  { title: "PDF Books", icon: "📖", categoryId: 2597 },
  { title: "Class 9 Books", icon: "9️⃣", categoryId: 2598 },
  { title: "Class 10 Books", icon: "🔟", categoryId: 2599 },
  { title: "Class 11 Books", icon: "1️⃣", categoryId: 2600 },
  { title: "Class 12 Books", icon: "2️⃣", categoryId: 2601 },
  { title: "Entry Test Books", icon: "🎯", categoryId: 2602 },
  { title: "Past Papers", icon: "📚", categoryId: 2514 },
  { title: "MDCAT Papers", icon: "🩺", categoryId: 2515 },
  { title: "Practice Tests", icon: "✅", categoryId: 2564 },
  { title: "Model Papers", icon: "📝", query: "model papers" },
];

export default function DownloadsScreen() {
  const router = useRouter();

const openItem = (item: any) => {
  if (item.categoryId) {
    router.push({
      pathname: "/(tabs)",
      params: { cat: String(item.categoryId) },
    } as any);
    return;
  }

  if (item.query) {
    router.push({
      pathname: "/search",
      params: { query: item.query },
    } as any);
  }
};

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#061A36" />

      <View style={styles.header}>
        <Text style={styles.title}>Downloads Hub</Text>
        <Text style={styles.sub}>Books, papers, notes and practice material</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 120 }}>
        <Text style={styles.sectionTitle}>Study Material</Text>

        <View style={styles.grid}>
          {DOWNLOADS.map((item, index) => (
            <Pressable
              key={index}
              style={styles.card}
              onPress={() => openItem(item)}
            >
              <Text style={styles.icon}>{item.icon}</Text>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardSub}>Open collection</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.noteBox}>
          <Text style={styles.noteTitle}>📥 Download History</Text>
          <Text style={styles.noteText}>
            Coming soon: downloaded PDFs and saved study material will appear here.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },

  header: {
    backgroundColor: "#061A36",
    paddingTop: 52,
    paddingBottom: 18,
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

  sectionTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#061A36",
    marginBottom: 10,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  card: {
    width: "48%",
    backgroundColor: "#061A36",
    borderRadius: 18,
    padding: 16,
    minHeight: 118,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#D4A032",
  },

  icon: {
    fontSize: 28,
    marginBottom: 8,
  },

  cardTitle: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "900",
  },

  cardSub: {
    color: "#ffffffbb",
    marginTop: 4,
    fontSize: 12,
  },

  noteBox: {
    marginTop: 8,
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  noteTitle: {
    fontSize: 17,
    fontWeight: "900",
    color: "#061A36",
  },

  noteText: {
    marginTop: 6,
    color: "#64748B",
    lineHeight: 21,
  },
});