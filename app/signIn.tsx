import { MyTextInput } from "@/components/MyTextInput";
import { icons } from "@/constants/icons";
import { images } from "@/constants/image";
import { Link } from "expo-router";
import { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

export default function SignIn() {
  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");

  return (
    <View className="flex-1 bg-primary">
      <Image source={images.bg} className="absolute z-0" />
      <Image source={icons.logo} className="mt-20 mx-auto" />

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
          // onPress={handleSubmit}
        >
          <Text className="text-lg font-bold">Sign In</Text>
        </TouchableOpacity>

        <Link href="/signUp" className="mt-5">
          <Text className="text-sm text-light-200 font-semibold underline">
            Don't have an account? Sign Up
          </Text>
        </Link>
      </View>
    </View>
  );
}
