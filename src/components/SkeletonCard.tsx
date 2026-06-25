import { StyleSheet, View } from "react-native";

export default function SkeletonCard() {
  return (
    <View style={styles.card}>
      <View style={styles.image} />

      <View style={styles.body}>
        <View style={styles.title} />
        <View style={styles.line} />
        <View style={styles.lineSmall} />

        <View style={styles.button} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    marginHorizontal: 16,
    marginBottom: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  image: {
    height: 170,
    backgroundColor: "#E5E7EB",
  },

  body: {
    padding: 14,
  },

  title: {
    height: 18,
    width: "85%",
    borderRadius: 6,
    backgroundColor: "#E5E7EB",
    marginBottom: 12,
  },

  line: {
    height: 12,
    width: "60%",
    borderRadius: 6,
    backgroundColor: "#E5E7EB",
    marginBottom: 8,
  },

  lineSmall: {
    height: 12,
    width: "40%",
    borderRadius: 6,
    backgroundColor: "#E5E7EB",
    marginBottom: 16,
  },

  button: {
    height: 38,
    borderRadius: 10,
    backgroundColor: "#E5E7EB",
  },
});