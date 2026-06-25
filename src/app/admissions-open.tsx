import { ActivityIndicator, StatusBar, StyleSheet, Text, View } from "react-native";
import { WebView } from "react-native-webview";
import { COLORS } from "../theme";

export default function AdmissionsOpen() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryDark} />

      <WebView
        source={{ uri: "https://educationinkarachi.net/admissions-open/" }}
        style={styles.webview}
        startInLoadingState
        renderLoading={() => (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Loading admissions...</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  webview: {
    flex: 1,
  },

  loader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    marginTop: 10,
    color: COLORS.textSoft,
    fontWeight: "600",
  },
});