import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Linking,
  Pressable,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { WebView } from "react-native-webview";
import { COLORS } from "../theme";

const BOOKMARK_KEY = "Education in Pakistan_BOOKMARKS";

function cleanTitle(html = "") {
  return html.replace(/&amp;/g, "&").replace(/&#8217;/g, "'").replace(/<[^>]+>/g, "");
}

export default function PostDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch(`https://www.educationinkarachi.net/wp-json/wp/v2/posts/${id}?_embed`)
      .then((r) => r.json())
      .then((data) => setPost(data?.title ? data : null))
      .catch((e) => console.log("Post error:", e))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    checkBookmark();
  }, [id]);

  const checkBookmark = async () => {
    const raw = await AsyncStorage.getItem(BOOKMARK_KEY);
    const list = raw ? JSON.parse(raw) : [];
    setSaved(list.some((item: any) => item.id?.toString() === id?.toString()));
  };

  const toggleBookmark = async () => {
    if (!post) return;

    const raw = await AsyncStorage.getItem(BOOKMARK_KEY);
    const list = raw ? JSON.parse(raw) : [];

    const exists = list.some((item: any) => item.id?.toString() === post.id?.toString());

    let updated;

    if (exists) {
      updated = list.filter((item: any) => item.id?.toString() !== post.id?.toString());
      setSaved(false);
    } else {
      updated = [
        {
          id: post.id,
          title: cleanTitle(post.title.rendered),
          link: post.link,
          date: post.date,
        },
        ...list,
      ];
      setSaved(true);
    }

    await AsyncStorage.setItem(BOOKMARK_KEY, JSON.stringify(updated));
  };

  const onShare = async () => {
    if (!post) return;
    await Share.share({
      message: `${cleanTitle(post.title.rendered)}\n\n${post.link}`,
    });
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading post...</Text>
      </View>
    );
  }

  if (!post) {
    return (
      <View style={styles.center}>
        <Text style={styles.loadingText}>Post nahi mila.</Text>
      </View>
    );
  }

  const html = `
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
 body{
  margin:0;
  padding:16px;
  max-width:100%;
  overflow-x:hidden;
}
  .title {
    font-size: 25px;
    font-weight: 800;
    line-height: 1.3;
    margin-bottom: 8px;
  }
  .date {
    color: #64748B;
    font-size: 14px;
    margin-bottom: 16px;
  }
 img{
    max-width:100%;
    border-radius:14px;
    margin:18px 0;
}
  p,
li{
    font-size:17px;
    line-height:1.8;
}
 h1,h2,h3,h4{
    color:#0F172A;
    font-weight:800;
    margin-top:22px;
}
  a {
    color: #1E3A8A;
    font-weight: 700;
    text-decoration: none;
  }
 table{
    display:block;
    overflow-x:auto;
    border-radius:12px;
}
  th, td {
    border: 1px solid #E2E8F0;
    padding: 10px;
    font-size: 14px;
  }
  th {
    background: #EEF2FF;
    font-weight: 800;
  }
  iframe { max-width: 100% !important; }
</style>
</head>
<body>
  <div class="title">${post.title.rendered}</div>
  <div class="date">${new Date(post.date).toLocaleDateString("en-GB")}</div>
  ${post.content.rendered}
</body>
</html>
`;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#061A36" />

      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} style={styles.iconBtn}>
          <Text style={styles.iconText}>←</Text>
        </Pressable>

       <Text style={styles.topTitle} numberOfLines={1}>
  {cleanTitle(post.title.rendered)}
</Text>

        <Pressable onPress={toggleBookmark} style={styles.iconBtn}>
          <Text style={styles.iconText}>{saved ? "★" : "☆"}</Text>
        </Pressable>

        <Pressable onPress={onShare} style={styles.iconBtn}>
          <Text style={styles.iconText}>↗</Text>
        </Pressable>

        <Pressable onPress={() => Linking.openURL(post.link)} style={styles.browserBtn}>
          <Text style={styles.browserText}>Open</Text>
        </Pressable>
      </View>

    <WebView
  originWhitelist={["*"]}
  source={{ html, baseUrl: "https://educationinkarachi.net" }}
  style={styles.webview}

  startInLoadingState

  scalesPageToFit={false}

  setBuiltInZoomControls={false}

  showsHorizontalScrollIndicator={false}

  javaScriptEnabled

  domStorageEnabled

  renderLoading={() => (
    <View style={styles.webLoader}>
      <ActivityIndicator size="large" color={COLORS.primary} />
    </View>
  )}
/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  webview: { flex: 1, backgroundColor: "#F8FAFC" },

  center: {
    flex: 1,
    backgroundColor: COLORS.bg,
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    marginTop: 10,
    color: COLORS.textSoft,
    fontWeight: "600",
  },

topBar: {
  backgroundColor: "#061A36",
  paddingTop: 42,
  paddingBottom: 10,
  paddingHorizontal: 10,
  flexDirection: "row",
  alignItems: "center",
},

  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.12)",
    marginLeft: 6,
  },

  iconText: {
    color: "#D4A032",
    fontWeight: "900",
    fontSize: 20,
  },

  topTitle: {
    flex: 1,
    color: "#fff",
    fontWeight: "900",
    fontSize: 16,
    marginLeft: 8,
  },

  browserBtn: {
    backgroundColor: "#D4A032",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 18,
    marginLeft: 6,
  },

browserText: {
  color: "#061A36",
  fontWeight: "900",
  fontSize: 12,
},

  webLoader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
  },
});