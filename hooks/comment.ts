import {
  COMMENT_QUERY_TAG,
  POST_QUERY_TAG,
  QUERY_KEY,
} from "@/constants/query";
import {
  createComment,
  deleteComment,
  fetchComment,
  fetchComments,
} from "@/data/appwrite";
import { Post, PostComment } from "@/interfaces/appwrite";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useFetchComments = ({ postId }: { postId: string }) => {
  return useQuery({
    queryFn: () => fetchComments({ postId }),
    queryKey: [QUERY_KEY.comments, postId],
  });
};

export const useFetchComment = ({
  commentId,
  initialData,
}: {
  commentId: string;
  initialData?: PostComment;
}) => {
  return useQuery({
    queryKey: [QUERY_KEY.comments, commentId],
    queryFn: () => fetchComment({ commentId: commentId }),
    initialData,
    enabled: Boolean(!initialData),
  });
};

export const useFetchIsCommentByUser = ({
  userId,
  commentId,
}: {
  userId: string;
  commentId: string;
}) => {
  const queryClient = useQueryClient();
  const commentQueryKey = [QUERY_KEY.comments, commentId];

  return useQuery({
    queryFn: () => {
      const comment = queryClient.getQueryData(commentQueryKey) as PostComment;
      if (!comment) throw new Error("Comment not exist");
      if (comment.userId !== userId)
        throw new Error(`Comment is not commented by the user:${userId}`);
      return true;
    },
    queryKey: [QUERY_KEY.comments, COMMENT_QUERY_TAG.isCommented, commentId],
  });
};

export const useCreateComment = ({
  postId,
  userId,
  content,
}: {
  postId: string;
  userId: string;
  content: string;
}) => {
  const queryClient = useQueryClient();
  const commentsQueryKey = [QUERY_KEY.comments, postId];

  return useMutation({
    mutationFn: () => createComment({ postId, userId, content }),

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: commentsQueryKey });

      const prevComments =
        (queryClient.getQueryData(commentsQueryKey) as PostComment[]) ?? [];

      queryClient.setQueryData(commentsQueryKey, [
        { userId, content, postId, id: null },
        ...prevComments,
      ]);

      return { prevComments };
    },

    onError: (error, variables, context) => {
      if (context) {
        queryClient.setQueryData(
          commentsQueryKey,
          context.prevComments ?? null
        );
      }
    },

    onSuccess: (data) => {
      queryClient.setQueryData(commentsQueryKey, data);
      const post = queryClient.getQueryData([
        QUERY_KEY.posts,
        POST_QUERY_TAG.detail,
        data.postId,
      ]) as Post;

      if (post) {
        queryClient.setQueryData(
          [QUERY_KEY.posts, POST_QUERY_TAG.detail, data.postId],
          { ...post, commentCount: post.commentCount + 1 }
        );
      }
    },
  });
};

export const useDeleteComment = ({
  commentId,
  postId,
}: {
  commentId: string;
  postId: string;
}) => {
  const queryClient = useQueryClient();

  const commentsQueryKey = [QUERY_KEY.comments, postId];
  const commentQueryKey = [QUERY_KEY.comments, commentId];
  const isCommentedQueryKey = [
    QUERY_KEY.comments,
    COMMENT_QUERY_TAG.isCommented,
    commentId,
  ];

  return useMutation({
    mutationFn: () => deleteComment({ commentId, postId }),

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: commentsQueryKey });
      await queryClient.cancelQueries({ queryKey: commentQueryKey });
      await queryClient.cancelQueries({ queryKey: isCommentedQueryKey });

      const prevComments =
        (queryClient.getQueryData(commentsQueryKey) as PostComment[]) ?? [];
      const prevComment = queryClient.getQueryData(
        commentQueryKey
      ) as PostComment;
      const prevIsCommented = queryClient.getQueryData(
        isCommentedQueryKey
      ) as Boolean;

      queryClient.setQueryData(
        commentsQueryKey,
        prevComments.filter((comment) => comment.$id !== commentId)
      );
      queryClient.setQueryData(commentQueryKey, null);
      if (prevIsCommented) {
        queryClient.setQueryData(isCommentedQueryKey, null);
      }

      return { prevComment, prevComments, prevIsCommented };
    },

    onError: (error, variables, context) => {
      if (context) {
        queryClient.setQueryData(commentsQueryKey, context.prevComments);
        queryClient.setQueryData(commentQueryKey, context.prevComment ?? null);
        queryClient.setQueryData(
          isCommentedQueryKey,
          context.prevIsCommented ?? null
        );
      }
    },

    onSuccess: () => {
      const post = queryClient.getQueryData([
        QUERY_KEY.posts,
        POST_QUERY_TAG.detail,
        postId,
      ]) as Post;

      if (post) {
        queryClient.setQueryData(
          [QUERY_KEY.posts, POST_QUERY_TAG.detail, postId],
          { ...post, commentCount: post.commentCount - 1 }
        );
      }
    },
  });
};
