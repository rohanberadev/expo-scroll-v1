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

export default function SignUp() {
  const { signUp, loading, error } = useAuth();

  const [nameValue, setNameValue] = useState("");
  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");

  const handleSubmit = async () => {
    if (emailValue && nameValue && passwordValue) {
      await signUp({
        email: emailValue,
        password: passwordValue,
        name: nameValue,
      });
    }
  };

  return (
    <KeyboardAwareScrollView className="flex-1 bg-primary" bottomOffset={12}>
      <Image source={images.bg} className="absolute z-0 w-full" />
      <AppLogo />

      <View className="mt-32 flex-col items-center justify-between px-6">
        <Text className="text-6xl font-semibold text-white italic">
          Sign Up
        </Text>

        <View className="w-full mt-20">
          <MyTextInput
            label="Enter your name"
            placeholder="Eg: John Doe"
            value={nameValue}
            onChangeText={(text) => setNameValue(text)}
          />
        </View>

        <View className="w-full mt-10">
          <MyTextInput
            label="Enter your email"
            placeholder="Eg: johnDoe@example.com"
            value={emailValue}
            onChangeText={(text) => setEmailValue(text)}
          />
        </View>

        <View className="w-full mt-10">
          <MyTextInput
            label="Enter your password"
            placeholder="Eg: password"
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
            <Text className="text-lg font-bold">Sign Up</Text>
          )}
        </TouchableOpacity>

        {error && (
          <Text className="w-full mt-3 pl-2 text-red-600 text-sm font-bold text-left">
            {error}
          </Text>
        )}

        <Link href="/signIn" className="mt-5">
          <Text className="text-sm text-light-200 font-semibold underline">
            Already have an account? Sign Up
          </Text>
        </Link>
      </View>
    </KeyboardAwareScrollView>
  );
}
