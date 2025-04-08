import { icons } from "@/constants/icons";
import { images } from "@/constants/image";
import { Link } from "expo-router";
import { Image, Text, View } from "react-native";

export default function Index() {
  return (
    <View className="flex-1 bg-primary">
      <Image source={images.bg} className="absolute z-0" />
      <Image source={icons.logo} className="mt-20 mx-auto" />
      <Text className="text-white text-center mt-10">Home Page</Text>
      <Link href="/signIn" className="mt-5 text-white">
        Sign In
      </Link>
    </View>
  );
}
