import "@/global.css";
import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <SafeAreaView className="flex-1 min-h-screen">
      <StatusBar hidden={true} />
      <KeyboardProvider>
        <Stack>
          <Stack.Screen name="(app)" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        </Stack>
      </KeyboardProvider>
    </SafeAreaView>
  );
}
