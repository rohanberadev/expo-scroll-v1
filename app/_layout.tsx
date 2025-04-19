import { AuthProvider } from "@/contexts/auth";
import "@/global.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaView } from "react-native-safe-area-context";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <SafeAreaView className="flex-1">
          <StatusBar hidden={true} />
          <KeyboardProvider>
            <Stack>
              <Stack.Screen name="(app)" options={{ headerShown: false }} />
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            </Stack>
          </KeyboardProvider>
        </SafeAreaView>
      </QueryClientProvider>
    </AuthProvider>
  );
}
