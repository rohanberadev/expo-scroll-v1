import { CommentCard } from "@/components/CommentCard";
import { FollowButton } from "@/components/FollowButton";
import { MyTextInput } from "@/components/MyTextInput";
import { PostDeleteButton } from "@/components/PostDeleteButton";
import { icons } from "@/constants/icons";
import { images } from "@/constants/image";
import { useAuth } from "@/contexts/auth";
import { useCreateComment, useFetchComments } from "@/hooks/comment";
import {
  useFetchLike,
  useFetchPostDetails,
  useHandleLike,
} from "@/hooks/posts";
import { useFetchUserProfile } from "@/hooks/userProfiles";
import { config, storage } from "@/services/appwrite";
import { Link, Redirect, useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Keyboard,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useKeyboardHandler } from "react-native-keyboard-controller";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

export default function Post() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const { user } = useAuth();

  const [commentValue, setCommentValue] = React.useState("");

  const {
    data: post,
    error: postError,
    isLoading: isPostLoading,
    isError: isPostError,
    isSuccess: isPostSuccess,
  } = useFetchPostDetails({ id: id as string });

  const {
    data: userProfile,
    isLoading: isUserProfileLoading,
    isSuccess: isUserProfileSuccess,
  } = useFetchUserProfile({ userId: post?.userId! });

  const { data: like } = useFetchLike({
    postId: post?.$id!,
    userId: user?.$id!,
  });

  const { mutateAsync: handleLike, isPending: ishandleLikePending } =
    useHandleLike({
      postId: post?.$id!,
      userId: user?.$id!,
    });

  const { data: comments, isLoading: isCommentsLoading } = useFetchComments({
    postId: id as string,
  });

  const {
    mutateAsync: createComment,
    isPending: isCreateCommentPending,
    error,
  } = useCreateComment({
    postId: id as string,
    userId: user?.$id!,
    content: commentValue,
  });

  const { height } = useGradualAnimation();

  const keyboardViewStyle = useAnimatedStyle(() => {
    return {
      bottom: Math.abs(height.value),
    };
  }, []);

  if (!isPostSuccess) return null;

  if (!post) return <Redirect href="/" />;

  if (isPostLoading) {
    return (
      <View className="flex-1 bg-primary justify-center items-center">
        <ActivityIndicator size="large" color="#AB8BFF" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-primary">
      <View className="z-50 flex-row items-center gap-x-2 border-b-[1px] border-light-300 w-full h-20">
        <TouchableOpacity onPress={() => router.back()} className="ml-2">
          <Image
            source={icons.chevron}
            className=" size-8 mt-1"
            tintColor="#fff"
          />
        </TouchableOpacity>

        <Text className="text-xl text-white font-bold">Post</Text>
      </View>

      <FlatList
        data={comments}
        keyExtractor={(item, index) => `${item.$id}-${index}`}
        renderItem={({ item }) => (
          <View className="px-5">
            <CommentCard comment={item} />
          </View>
        )}
        ListEmptyComponent={
          isCommentsLoading ? (
            <ActivityIndicator size="large" color="#fff" />
          ) : null
        }
        ListHeaderComponent={
          <View className="w-full">
            <View className="w-full p-5 flex-row justify-between items-center">
              <View className="flex-row items-center gap-x-4">
                <Link
                  href={{
                    pathname: "/profile/[id]",
                    params: { id: post?.userId! },
                  }}
                  asChild
                >
                  <TouchableOpacity className="size-12 overflow-hidden rounded-full">
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
                  </TouchableOpacity>
                </Link>

                <Text className="text-lg text-white font-bold">
                  {post?.userName}
                </Text>
              </View>
              {post?.userId !== user?.$id && (
                <FollowButton othersUserId={post?.userId!} />
              )}
              <PostDeleteButton post={post!} />
            </View>

            <View className="w-full">
              <View className="w-full h-[450px] overflow-hidden">
                <Image
                  source={{
                    uri: storage.getFileView(
                      config.storage.images,
                      post?.imageId!
                    ).href,
                  }}
                  className="w-full h-full"
                  resizeMode="stretch"
                />
              </View>

              <TouchableOpacity
                className="size-12 flex justify-center items-center bg-black absolute top-5 right-5 rounded-full"
                disabled={ishandleLikePending}
                onPress={async () => {
                  if (user?.$id && post?.$id) {
                    await handleLike();
                  }
                }}
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
            </View>

            <View className="my-5 w-full px-5 relative">
              <Text className="text-xl font-bold text-white">Comments</Text>
            </View>
          </View>
        }
      />

      <Animated.View
        style={[
          {
            flexDirection: "row",
            zIndex: 50,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 16,
            gap: 16,
            backgroundColor: "#030014",
            borderTopColor: "white",
            paddingVertical: 8,
          },
          keyboardViewStyle,
        ]}
      >
        <MyTextInput
          placeholder="Comment on this post"
          value={commentValue}
          onChangeText={(text) => setCommentValue(text)}
          className="flex-1 flex-row"
        />

        <TouchableOpacity
          className="bg-accent flex-col justify-center items-center p-3 rounded-lg"
          disabled={isCreateCommentPending || !commentValue}
          onPress={async () => {
            if (commentValue) {
              await createComment();
              setCommentValue("");
              Keyboard.dismiss();
            }
          }}
        >
          <Image source={icons.sendIcon} className="size-8" />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const useGradualAnimation = () => {
  const height = useSharedValue(0);

  useKeyboardHandler(
    {
      onMove: (e) => {
        "worklet";
        height.value = e.height;
      },

      onEnd: (e) => {
        "worklet";
        height.value = e.height;
      },
    },
    []
  );

  return { height };
};
