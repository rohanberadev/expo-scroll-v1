import { AppLogo } from "@/components/AppLogo";
import { images } from "@/constants/image";
import { useAuth } from "@/contexts/auth";
import { useFetchPostsByUserId } from "@/hooks/posts";
import { Post } from "@/interfaces/appwrite";
import { config, storage } from "@/services/appwrite";
import { Link } from "expo-router";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";

const imageUrls = [
  "https://images.pexels.com/photos/29352449/pexels-photo-29352449/free-photo-of-tokyo-tower-illuminated-night-skyline-view.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  "https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW1hZ2V8ZW58MHx8MHx8fDA%3D",
];

export default function Profile() {
  const { signOut, user } = useAuth();

  const { data: posts, isSuccess } = useFetchPostsByUserId({
    userId: user?.$id!,
  });

  return (
    <View className="flex-1 bg-primary">
      <FlatList
        data={posts}
        renderItem={({ item }) => (
          <View className="h-full px-3.5 mb-8">
            <PostCard post={item} />
          </View>
        )}
        className="w-full"
        numColumns={3}
        horizontal={false}
        ListHeaderComponent={
          <>
            <Image source={images.bg} className="absolute z-0 w-full" />
            <AppLogo />

            <View className="px-5 mt-20 items-center">
              <View className="size-32 overflow-hidden rounded-full border-[2px] border-white">
                <Image
                  source={{ uri: imageUrls[1] }}
                  className="w-full h-full"
                />
              </View>

              <Text className="text-lg text-white font-bold mt-1.5">
                {user?.name}
              </Text>
            </View>

            <View className="w-full h-[1px] bg-gray-700 my-5"></View>

            <View className="px-5">
              <Text className="text-lg text-white font-bold">Your Posts</Text>
            </View>

            <View className="px-5 mt-5"></View>
          </>
        }
        ListFooterComponent={<View className="w-full h-32"></View>}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const PostCard = ({ post }: { post: Post }) => {
  return (
    <Link href={{ pathname: "/post/[id]", params: { id: post.$id } }} asChild>
      <TouchableOpacity className="w-32 overflow-hidden">
        <Image
          source={{
            uri: post.imageId
              ? storage.getFileView(config.storage.images, post.imageId).href
              : "",
          }}
          className="w-full h-52 rounded-lg"
        />

        <Text className="text-sm text-white mt-2 font-bold" numberOfLines={1}>
          {post.title}
        </Text>
      </TouchableOpacity>
    </Link>
  );
};
