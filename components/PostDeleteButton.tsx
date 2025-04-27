import { useAuth } from "@/contexts/auth";
import { useDeletePost } from "@/hooks/posts";
import { Post } from "@/interfaces/appwrite";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";

export const PostDeleteButton = ({ post }: { post: Post }) => {
  const { user } = useAuth();
  const router = useRouter();

  const { mutateAsync: deletePost, isPending: isDeletePostPending } =
    useDeletePost({ postId: post.$id });

  if (user?.$id !== post.userId) return null;

  return (
    <TouchableOpacity
      onPress={async () => {
        router.back();
        await deletePost();
      }}
      disabled={isDeletePostPending}
    >
      <AntDesign name="delete" size={24} color="red" />
    </TouchableOpacity>
  );
};
