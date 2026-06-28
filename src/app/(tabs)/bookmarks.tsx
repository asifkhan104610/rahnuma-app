import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View
} from "react-native";

const BOOKMARK_KEY = "Education in Pakistan_BOOKMARKS";

export default function BookmarksScreen() {
  const router = useRouter();
  const [items, setItems] = useState<any[]>([]);

  const loadBookmarks = async () => {
    const raw = await AsyncStorage.getItem(BOOKMARK_KEY);
    const list = raw ? JSON.parse(raw) : [];
    setItems(list);
  };

  useFocusEffect(
    useCallback(() => {
      loadBookmarks();
    }, [])
  );
const removeBookmark = async (id: number) => {
  Alert.alert(
    "Remove Bookmark",
    "Are you sure?",
    [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: async () => {
          const raw = await AsyncStorage.getItem(BOOKMARK_KEY);
          const list = raw ? JSON.parse(raw) : [];

          const updated = list.filter(
            (item: any) => item.id !== id
          );

          await AsyncStorage.setItem(
            BOOKMARK_KEY,
            JSON.stringify(updated)
          );

          setItems(updated);
        },
      },
    ]
  );
};
  return (
    <View style={styles.container}>
      <Text style={styles.title}>⭐ Bookmarks</Text>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <Text style={styles.empty}>
            No saved posts yet
          </Text>
        }
        renderItem={({ item }) => (
         <Pressable
  style={styles.card}
  onPress={() => router.push(`/${item.id}`)}
>
  <Text style={styles.cardTitle}>
    {item.title}
  </Text>

  <Text style={styles.date}>
    {new Date(item.date).toLocaleDateString()}
  </Text>

  <Pressable
    style={styles.removeBtn}
    onPress={() => removeBookmark(item.id)}
  >
    <Text style={styles.removeText}>
      Remove
    </Text>
  </Pressable>
</Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F8FAFC",
  },

  title: {
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 16,
    color: "#061A36",
  },
removeBtn: {
  marginTop: 10,
  backgroundColor: "#EF4444",
  paddingVertical: 8,
  borderRadius: 10,
  alignItems: "center",
},

removeText: {
  color: "#fff",
  fontWeight: "700",
},
  empty: {
    textAlign: "center",
    marginTop: 40,
    color: "#64748B",
  },

  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    marginBottom: 10,
    elevation: 2,
  },

  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#061A36",
  },

  date: {
    marginTop: 6,
    color: "#64748B",
    fontSize: 12,
  },
});