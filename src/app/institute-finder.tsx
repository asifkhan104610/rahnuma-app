import { StatusBar, View } from "react-native";
import { WebView } from "react-native-webview";
import { COLORS } from "../theme";

export default function InstituteFinder() {
  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryDark} />
      <WebView
        source={{ uri: "https://educationinkarachi.net/institute-finder/" }}
        style={{ flex: 1 }}
        startInLoadingState
      />
    </View>
  );
}