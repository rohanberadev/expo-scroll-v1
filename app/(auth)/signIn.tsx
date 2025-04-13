import { AppLogo } from "@/components/AppLogo";
import { MyTextInput } from "@/components/MyTextInput";
import { images } from "@/constants/image";
import { useAuth } from "@/contexts/auth";
import { Link } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

export default function SignIn() {
  const { signIn, loading, error } = useAuth();

  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");

  const handleSubmit = async () => {
    if (emailValue && passwordValue) {
      await signIn({ email: emailValue, password: passwordValue });
    }
  };

  return (
    <KeyboardAwareScrollView className="flex-1 bg-primary" bottomOffset={12}>
      <Image source={images.bg} className="absolute z-0 w-full" />
      <AppLogo />

      <View className="mt-32 flex-col items-center justify-between px-8">
        <Text className="text-6xl font-semibold text-white italic">
          Sign In
        </Text>

        <View className="w-full mt-20">
          <MyTextInput
            label="Enter your email"
            placeholder="Eg: user@example.com"
            value={emailValue}
            onChangeText={(text) => setEmailValue(text)}
          />
        </View>

        <View className="w-full mt-10">
          <MyTextInput
            label="Enter your password"
            placeholder="Eg: 12345678"
            value={passwordValue}
            onChangeText={(text) => setPasswordValue(text)}
            secureTextEntry
          />
        </View>

        <TouchableOpacity
          className="w-full mt-10 px-3 py-4 bg-accent rounded-xl flex-row justify-center items-center"
          onPress={handleSubmit}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text className="text-lg font-bold">Sign In</Text>
          )}
        </TouchableOpacity>

        {error && (
          <Text className="w-full mt-3 pl-2 text-red-600 text-sm font-bold text-left">
            {error}
          </Text>
        )}

        <Link href="/signUp" className="mt-5">
          <Text className="text-sm text-light-200 font-semibold underline">
            Don't have an account? Sign Up
          </Text>
        </Link>
      </View>
    </KeyboardAwareScrollView>
  );
}
