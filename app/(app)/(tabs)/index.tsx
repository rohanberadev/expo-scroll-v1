import { AppLogo } from "@/components/AppLogo";
import { PostCard } from "@/components/PostCard";
import { Searchbar } from "@/components/SearchBar";
import { images } from "@/constants/image";
import { useRouter } from "expo-router";
import { Image, Text, View } from "react-native";

const imageUrls = [
  "https://images.pexels.com/photos/29352449/pexels-photo-29352449/free-photo-of-tokyo-tower-illuminated-night-skyline-view.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  "https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW1hZ2V8ZW58MHx8MHx8fDA%3D",
];

export default function Index() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-primary">
      <Image source={images.bg} className="absolute z-0 w-full" />
      <AppLogo />

      <View className="w-full mt-10 px-5">
        <Searchbar
          placeholder="Search new people"
          onPress={() => router.push("/search")}
        />
      </View>

      <View className="w-full mt-8 px-5">
        <Text className="text-lg text-white font-bold">Trending Posts</Text>
      </View>

      <View className="w-full mt-10 px-5 flex-col">
        <PostCard />
      </View>
    </View>
  );
}
