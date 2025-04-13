import { AppLogo } from "@/components/AppLogo";
import { PostCard } from "@/components/PostCard";
import { Searchbar } from "@/components/SearchBar";
import { TrendingPostCard } from "@/components/TrendingPostCard";
import { images } from "@/constants/image";
import { useAuth } from "@/contexts/auth";
import { useFetchLatestPosts, useFetchTrendingPosts } from "@/hooks/posts";
import { useRouter } from "expo-router";
import { FlatList, Image, Keyboard, Text, View } from "react-native";

export default function Index() {
  const router = useRouter();
  const { user } = useAuth();

  const {
    data: latestPosts,
    error: latestPostsError,
    isError: isLatestPostsError,
    isSuccess: isLatestPostsSuccess,
    isLoading: isLatestPostsLoading,
  } = useFetchLatestPosts({ userId: user?.$id! });

  const {
    data: trendingPosts,
    error: trendingPostsError,
    isLoading: isTrendingPostsLoading,
    isError: isTrendingPostsError,
    isSuccess: isTrendingPostsSuccess,
  } = useFetchTrendingPosts();

  return (
    <View className="flex-1 bg-primary">
      <Image source={images.bg} className="absolute z-0 w-full" />

      <FlatList
        data={latestPosts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <View className="px-5 mt-10">
            <PostCard post={item} />
          </View>
        )}
        ListHeaderComponent={
          <>
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

            <View className="w-full mt-10">
              <Text className="text-lg text-white font-bold pl-5 mb-5">
                Trending Posts
              </Text>
              <FlatList
                data={trendingPosts}
                keyExtractor={(item) => item.$id}
                renderItem={({ item, index }) => (
                  <View className="mx-5">
                    <TrendingPostCard post={item} ranking={index + 1} />
                  </View>
                )}
                horizontal={true}
              />
            </View>

            <Text className="text-lg text-white font-bold pl-5 mt-10">
              Latest Posts
            </Text>
          </>
        }
        ListFooterComponent={<View className="w-full h-32"></View>}
      />

      {/* <View className="w-full mt-20 px-5 flex-col pb-40">
        <Text className="text-lg text-white font-bold">Latest Posts</Text>
        <View className="w-full mt-5">
          <PostCard />
        </View>
      </View> */}
    </View>
  );
}
