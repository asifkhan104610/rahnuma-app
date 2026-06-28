import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const CHAT_KEY = "Education in Pakistan_AI_CHATS";


const DEFAULT_CHAT = [
  {
    id: "1",
    role: "ai",
    text: "Assalam o Alaikum! I am Education AI. Ask me about admissions, jobs, scholarships, MDCAT, ECAT, universities or career guidance.",
  },
];

const SUGGESTIONS = [
  "🎓 Latest Admissions",
  "💼 Latest Jobs",
  "🏫 Universities",
  "🎁 Scholarships",
  "📚 Past Papers",
  "🧮 Drug Dose Calculator",
  "🩺 MDCAT Preparation",
  "🤖 Career Guidance",
];

const cleanHtml = (html = "") =>
  html
    .replace(/&amp;/g, "&")
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/<[^>]+>/g, "");

const searchWebsitePosts = async (userText: string) => {
  try {
    const searchRes = await fetch(
      `https://www.educationinkarachi.net/wp-json/wp/v2/posts?search=${encodeURIComponent(
        userText
      )}&per_page=5&_embed`
    );

    const latestAdmissionsRes = await fetch(
      "https://www.educationinkarachi.net/wp-json/wp/v2/posts?categories=154&per_page=10&_embed"
    );

    const searchData = await searchRes.json();
    const admissionsData = await latestAdmissionsRes.json();

    const combined = [
      ...(Array.isArray(searchData) ? searchData : []),
      ...(Array.isArray(admissionsData) ? admissionsData : []),
    ];

    const uniquePosts = combined.filter(
      (post, index, self) =>
        index === self.findIndex((p: any) => p.id === post.id)
    );

    if (uniquePosts.length === 0) {
      return "No related website posts found.";
    }

    return uniquePosts
      .slice(0, 5)
      .map((post: any, index: number) => {
        const title = cleanHtml(post.title?.rendered || "");
        const excerpt = cleanHtml(post.excerpt?.rendered || "");
        const content = cleanHtml(post.content?.rendered || "").slice(0, 1000);

        return `
Post ${index + 1}
Title: ${title}
Excerpt: ${excerpt}
Content: ${content}
Link: ${post.link}
`;
      })
      .join("\n\n");
  } catch (error) {
    console.log("Website search error:", error);
    return "Website data could not be loaded.";
  }
};

const getQuickPrompt = (text: string) => {
  switch (text) {
    case "🎓 Latest Admissions":
      return "Show me the latest admissions in Pakistan with university names, last dates and website links.";

    case "💼 Latest Jobs":
      return "Show me the latest government and private jobs in Pakistan with useful links.";

    case "🏫 Universities":
      return "List universities currently offering admissions in Pakistan with city and admission links.";

    case "🎁 Scholarships":
      return "Show me the latest scholarships available for Pakistani students with eligibility and links.";

    case "📚 Past Papers":
      return "Show available past papers and preparation resources for students.";

    case "🧮 Drug Dose Calculator":
      return "Explain how to calculate medicine doses with simple examples for nursing students.";

    case "🩺 MDCAT Preparation":
      return "Give me a complete MDCAT preparation guide with subjects, daily plan and tips.";

    case "🤖 Career Guidance":
      return "Help me choose the best career according to my interests, education background and future scope.";

    default:
      return text;
  }
};

export default function AiScreen() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [chats, setChats] = useState<any[]>(DEFAULT_CHAT);

  useEffect(() => {
    loadChats();
  }, []);

  const loadChats = async () => {
    const saved = await AsyncStorage.getItem(CHAT_KEY);
    if (saved) setChats(JSON.parse(saved));
  };

  const saveChats = async (list: any[]) => {
    setChats(list);
    await AsyncStorage.setItem(CHAT_KEY, JSON.stringify(list));
  };

  const clearChat = () => {
    Alert.alert("Clear Chat", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Clear",
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.removeItem(CHAT_KEY);
          setChats(DEFAULT_CHAT);
        },
      },
    ]);
  };

  const shareChat = async () => {
    const text = chats
      .map((item) =>
        item.role === "user"
          ? `User: ${item.text}`
          : `Education AI: ${item.text}`
      )
      .join("\n\n");

    await Share.share({
      message: `Education AI Conversation\n\n${text}`,
    });
  };

 const getGeminiReply = async (userText: string) => {
  const response = await fetch(
    "https://www.educationinkarachi.net/wp-json/rahnuma/v1/ai",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: userText }),
    }
  );

  const data = await response.json();

 if (!response.ok) {
  const err = await response.text();
  console.log("Gemini API Error:", err);
  throw new Error(err);
}

  return data.reply || "Sorry, mujhe jawab generate karne me issue aa gaya.";
};

  const sendMessage = async (custom?: string) => {
    const rawText = custom || message;
    if (!rawText.trim() || loading) return;

    const finalText = getQuickPrompt(rawText);

    const userMsg = {
      id: Date.now().toString(),
      role: "user",
      text: finalText,
    };

    const thinkingMsg = {
      id: (Date.now() + 1).toString(),
      role: "ai",
      text: "Thinking...",
    };

    const updated = [...chats, userMsg, thinkingMsg];
    await saveChats(updated);

    setMessage("");
    setLoading(true);

    try {
      const reply = await getGeminiReply(finalText);

      const finalChats = updated.map((item) =>
        item.id === thinkingMsg.id ? { ...item, text: reply } : item
      );

      await saveChats(finalChats);
    } catch (error) {
      console.log("Gemini error:", error);

      const finalChats = updated.map((item) =>
        item.id === thinkingMsg.id
          ? {
              ...item,
              text: "Sorry, Gemini se reply nahi aa saka. API key, internet ya model name check karein.",
            }
          : item
      );

      await saveChats(finalChats);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <StatusBar barStyle="light-content" backgroundColor="#061A36" />

      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>🤖 Education AI</Text>
          <Text style={styles.sub}>Education & Career Assistant</Text>
        </View>

        <Pressable onPress={clearChat} style={styles.clearBtn}>
          <Text style={styles.clearText}>Clear</Text>
        </Pressable>

        <Pressable onPress={shareChat} style={styles.shareBtn}>
          <Text style={styles.shareText}>Share</Text>
        </Pressable>
      </View>

      <View style={styles.quickBox}>
        <Text style={styles.quickTitle}>How can I help you today?</Text>

        <View style={styles.suggestionWrap}>
          {SUGGESTIONS.map((item, index) => (
            <Pressable
              key={index}
              style={styles.suggestion}
              onPress={() => sendMessage(item)}
              disabled={loading}
            >
              <Text style={styles.suggestionText}>{item}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        renderItem={({ item }) => (
          <View
            style={[
              styles.bubble,
              item.role === "user" ? styles.userBubble : styles.aiBubble,
            ]}
          >
            <Text
              style={[
                styles.bubbleText,
                item.role === "user" ? styles.userText : styles.aiText,
              ]}
            >
              {item.text}
            </Text>
          </View>
        )}
      />

      <View style={styles.inputWrap}>
        <TextInput
          style={styles.input}
          placeholder="Ask Education in Pakistan..."
          placeholderTextColor="#94A3B8"
          value={message}
          onChangeText={setMessage}
          multiline
        />

        <Pressable
          style={[styles.sendBtn, loading && { opacity: 0.6 }]}
          onPress={() => sendMessage()}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#061A36" />
          ) : (
            <Text style={styles.sendText}>Send</Text>
          )}
        </Pressable>
      </View>
    </KeyboardAvoidingView>
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
    flexDirection: "row",
    alignItems: "center",
  },

  title: { color: "#fff", fontSize: 24, fontWeight: "900" },
  sub: { color: "#ffffffcc", marginTop: 4 },

  clearBtn: {
    backgroundColor: "#D4A032",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
  },

  clearText: {
    color: "#061A36",
    fontWeight: "900",
  },

  shareBtn: {
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    marginLeft: 8,
  },

  shareText: {
    color: "#061A36",
    fontWeight: "900",
  },

  quickBox: {
    backgroundColor: "#fff",
    margin: 14,
    marginBottom: 0,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    elevation: 2,
  },

  quickTitle: {
    color: "#061A36",
    fontSize: 15,
    fontWeight: "900",
    marginBottom: 8,
  },

  suggestionWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  suggestion: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#D4A032",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 18,
    margin: 4,
  },

  suggestionText: {
    color: "#061A36",
    fontSize: 12,
    fontWeight: "800",
  },

  bubble: {
    maxWidth: "82%",
    padding: 14,
    borderRadius: 16,
    marginBottom: 10,
  },

  aiBubble: {
    backgroundColor: "#fff",
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  userBubble: {
    backgroundColor: "#061A36",
    alignSelf: "flex-end",
  },

  bubbleText: { fontSize: 15, lineHeight: 22 },
  aiText: { color: "#061A36" },
  userText: { color: "#fff" },

  inputWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    alignItems: "flex-end",
    padding: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },

  input: {
    flex: 1,
    maxHeight: 100,
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: "#061A36",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  sendBtn: {
    backgroundColor: "#D4A032",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    marginLeft: 8,
    minWidth: 62,
    alignItems: "center",
  },

  sendText: {
    color: "#061A36",
    fontWeight: "900",
  },
});