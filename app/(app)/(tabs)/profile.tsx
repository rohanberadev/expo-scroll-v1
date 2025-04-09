import { AppLogo } from "@/components/AppLogo";
import { images } from "@/constants/image";
import { useAuth } from "@/contexts/auth";
import { Image, Text, TouchableOpacity, View } from "react-native";

export default function Profile() {
  const { signOut } = useAuth();

  return (
    <View className="flex-1 bg-primary">
      <Image source={images.bg} className="absolute z-0 w-full" />
      <AppLogo />

      <Text className="text-white text-center mt-10">Profile Page</Text>

      <TouchableOpacity
        className="mt-5 mx-auto bg-red-600 px-4 py-2 rounded-lg"
        onPress={signOut}
      >
        <Text className="text-sm text-white font-semibold">Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}
