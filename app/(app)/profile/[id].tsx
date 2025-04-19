import { FollowButton } from "@/components/FollowButton";
import { icons } from "@/constants/icons";
import { images } from "@/constants/image";
import { useFetchPostsByUserId } from "@/hooks/posts";
import { useFetchUserProfile } from "@/hooks/userProfiles";
import { Post } from "@/interfaces/appwrite";
import { config, storage } from "@/services/appwrite";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import {
  FlatList,
  Image,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Profile() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const { data: posts, isSuccess } = useFetchPostsByUserId({
    userId: id as string,
  });

  const { data: userProfile } = useFetchUserProfile({ userId: id as string });

  return (
    <View className="flex-1 bg-primary">
      <ImageBackground
        source={images.bg}
        className="z-50 flex-row items-center gap-x-2 w-full h-20"
      >
        <TouchableOpacity onPress={() => router.back()} className="ml-2">
          <Image
            source={icons.chevron}
            className=" size-8 mt-1"
            tintColor="#fff"
          />
        </TouchableOpacity>

        <Text className="text-xl text-white font-bold">Back</Text>
      </ImageBackground>
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

            <View className="px-5 mt-20 items-center">
              <View className="reltaive">
                <View className="size-32 overflow-hidden rounded-full border-[2px] border-white">
                  <Image
                    source={{ uri: userProfile?.profileImage }}
                    className="w-full h-full"
                  />
                </View>
              </View>

              <Text className="text-lg text-white font-bold mt-1.5">
                {userProfile?.name}
              </Text>

              <View className="w-full mt-5">
                <FollowButton othersUserId={userProfile?.userId!} />
              </View>
            </View>

            <View className="w-full h-[1px] bg-gray-700 my-5"></View>

            <View className="px-5">
              <Text className="text-lg text-white font-bold">Posts</Text>
            </View>

            <View className="px-5 mt-5"></View>
          </>
        }
        ListFooterComponent={<View className="w-full h-[5000px]"></View>}
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
