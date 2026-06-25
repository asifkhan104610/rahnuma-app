import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  loading?: boolean;
  onRetry: () => void;
};

export default function NoInternet({
  loading = false,
  onRetry,
}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>📡</Text>

      <Text style={styles.title}>No Internet Connection</Text>

      <Text style={styles.desc}>
        Please check your internet connection and try again.
      </Text>

      <Pressable
        style={styles.button}
        onPress={onRetry}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#061A36" />
        ) : (
          <Text style={styles.buttonText}>Retry</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },

  icon: {
    fontSize: 72,
  },

  title: {
    marginTop: 20,
    fontSize: 24,
    fontWeight: "900",
    color: "#061A36",
  },

  desc: {
    marginTop: 10,
    textAlign: "center",
    color: "#64748B",
    lineHeight: 22,
    fontSize: 15,
  },

  button: {
    marginTop: 30,
    backgroundColor: "#D4A032",
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 14,
  },

  buttonText: {
    color: "#061A36",
    fontWeight: "900",
    fontSize: 15,
  },
});