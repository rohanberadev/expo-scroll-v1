import { icons } from "@/constants/icons";
import { images } from "@/constants/image";
import { useAuth } from "@/contexts/auth";
import {
  useFetchLike,
  useFetchPostDetails,
  useHandleLike,
} from "@/hooks/posts";
import { useFetchUserProfile } from "@/hooks/userProfiles";
import { Post } from "@/interfaces/appwrite";
import { config, storage } from "@/services/appwrite";
import { Link } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";

export const PostCard = ({ post }: { post: Post }) => {
  const { user } = useAuth();

  const { data: postDetails } = useFetchPostDetails({
    id: post.$id,
    initialData: post,
  });
  const { data: like, isSuccess: isLikeSuccess } = useFetchLike({
    postId: post.$id,
    userId: user?.$id!,
  });
  const {
    data: userProfile,
    isSuccess: isUserProfileSuccess,
    isLoading: isUserProfileLoading,
  } = useFetchUserProfile({ userId: post.userId! });
  const { mutateAsync: handleLike, isPending: ishandleLikePending } =
    useHandleLike({
      postId: postDetails?.$id!,
      userId: user?.$id!,
    });

  return (
    <Link href={{ pathname: "/post/[id]", params: { id: post.$id } }} asChild>
      <TouchableOpacity className="w-full flex-col gap-y-2.5">
        <View className="w-full rounded-xl overflow-hidden relative">
          <Image
            source={{
              uri: storage.getFileView(
                config.storage.images,
                postDetails?.imageId!
              ).href,
            }}
            className="w-full h-[400px]"
            resizeMode="cover"
          />

          <View className="absolute bottom-0 bg-black w-full h-16 z-50 opacity-80 flex flex-row items-center justify-between">
            <View className="flex-row items-center gap-x-2">
              <View className="ml-2 w-10 h-10 rounded-full overflow-hidden">
                {isUserProfileLoading && (
                  <Image
                    source={images.placeholderProfile}
                    className="w-full h-full"
                  />
                )}

                {userProfile?.profileImage &&
                isUserProfileSuccess &&
                !isUserProfileLoading ? (
                  <Image
                    source={{ uri: userProfile.profileImage }}
                    className="w-full h-full"
                  />
                ) : (
                  <Image
                    source={images.placeholderProfile}
                    className="w-full h-full"
                  />
                )}
              </View>

              <View className="flex-col">
                <Text className="text-sm text-white font-bold">
                  {postDetails?.userName}
                </Text>
                <Text className="text-xs text-white" numberOfLines={1}>
                  {postDetails?.title}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center gap-x-5 mr-4">
              <View className="flex-col items-center gap-y-1">
                <TouchableOpacity
                  onPress={async () => {
                    if (user?.$id && postDetails?.$id) {
                      await handleLike();
                    }
                  }}
                  disabled={ishandleLikePending || !isLikeSuccess}
                >
                  {like ? (
                    <Image source={icons.heartFill} className="size-6" />
                  ) : (
                    <Image
                      source={icons.heart}
                      className="size-7"
                      tintColor="#fff"
                    />
                  )}
                </TouchableOpacity>

                <Text className="text-xs text-white">
                  {postDetails?.likeCount}
                </Text>
              </View>

              <View className="flex-col items-center gap-y-1">
                <Link
                  href={{ pathname: "/post/[id]", params: { id: post.$id } }}
                  asChild
                >
                  <TouchableOpacity>
                    <Image
                      source={icons.message}
                      className="size-6"
                      tintColor="#fff"
                    />
                  </TouchableOpacity>
                </Link>

                <Text className="text-xs text-white">
                  {postDetails?.commentCount}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );
};
