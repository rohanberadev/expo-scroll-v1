import { images } from "@/constants/image";
import { useAuth } from "@/contexts/auth";
import {
  useDeleteComment,
  useFetchComment,
  useFetchIsCommentByUser,
} from "@/hooks/comment";
import { useFetchUserProfile } from "@/hooks/userProfiles";
import { PostComment } from "@/interfaces/appwrite";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Link } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";

export const CommentCard = ({ comment }: { comment: PostComment }) => {
  const { user } = useAuth();
  const { data: userProfile } = useFetchUserProfile({ userId: comment.userId });
  const { data: commentDetails } = useFetchComment({
    commentId: comment.$id,
    initialData: comment,
  });
  const { data: isCommentOwner, error } = useFetchIsCommentByUser({
    userId: user?.$id!,
    commentId: comment.$id,
  });
  const { mutateAsync: deleteComment } = useDeleteComment({
    commentId: comment.$id,
    postId: comment.postId,
  });

  return (
    <View className="w-full flex-row items-center justify-between px-5 py-2 border-[1px] border-light-300 rounded-md my-5">
      <View className="flex-1 flex-row gap-x-10 items-center">
        <View className="gap-y-1">
          <Link
            href={
              user?.$id === userProfile?.userId
                ? "/myProfile"
                : {
                    pathname: "/profile/[id]",
                    params: { id: userProfile?.userId! },
                  }
            }
            asChild
          >
            <TouchableOpacity className="size-8 overflow-hidden rounded-full border-[1px] border-gray-600">
              {userProfile?.profileImage ? (
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
          <Text className="text-xs text-light-300 font-semibold">
            {userProfile?.name}
          </Text>
        </View>
        {/* <View className="flex-row"> */}
        <Text className="text-sm font-bold text-white flex-1 flex-wrap">
          {commentDetails?.content}
        </Text>
        {/* </View> */}
      </View>
      {isCommentOwner ? (
        <TouchableOpacity onPress={() => deleteComment()}>
          <AntDesign name="delete" size={24} color="red" />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};
