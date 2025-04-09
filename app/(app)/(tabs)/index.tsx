import { AppLogo } from "@/components/AppLogo";
import { PostCard } from "@/components/PostCard";
import { Searchbar } from "@/components/SearchBar";
import { TrendingPostCard } from "@/components/TrendingPostCard";
import { images } from "@/constants/image";
import { useRouter } from "expo-router";
import { Image, Keyboard, ScrollView, Text, View } from "react-native";

export default function Index() {
  const router = useRouter();

  return (
    <ScrollView
      className="flex-1 bg-primary"
      horizontal={false}
      showsVerticalScrollIndicator={false}
    >
      <Image source={images.bg} className="absolute z-0 w-full" />
      <AppLogo />

      <View className="w-full mt-10 px-5">
        <Searchbar
          placeholder="Search new people"
          onPress={() => {
            Keyboard.dismiss();
            router.push("/search");
          }}
        />
      </View>

      <View className="w-full mt-10 px-5">
        <Text className="text-lg text-white font-bold">Trending Posts</Text>
        <View className="w-full mt-5">
          <TrendingPostCard />
        </View>
      </View>

      <View className="w-full mt-20 px-5 flex-col pb-40">
        <Text className="text-lg text-white font-bold">Latest Posts</Text>
        <View className="w-full mt-5">
          <PostCard />
        </View>
      </View>
    </ScrollView>
  );
}
