import { POST_QUERY_TAG, QUERY_KEY } from "@/constants/query";
import {
  fetchLike,
  fetchPostById,
  fetchPosts,
  fetchTrendingPosts,
  handleLike,
  uploadPost,
} from "@/data/appwrite";
import { Like, Post } from "@/interfaces/appwrite";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ImagePickerAsset } from "expo-image-picker";

export const useUploadPost = ({
  data,
  asset,
}: {
  data: Omit<Post, "$id" | "commentCount" | "likeCount" | "imageId">;
  asset: ImagePickerAsset;
}) => {
  const queryClient = useQueryClient();
  const queryKey = [QUERY_KEY.posts, POST_QUERY_TAG.user, data.userId];

  return useMutation({
    mutationFn: () => uploadPost({ data, asset }),
    onSuccess: (data) => {
      const prevData = (queryClient.getQueryData(queryKey) as Post[]) ?? [];
      queryClient.setQueryData(queryKey, [data, ...prevData]);
    },
  });
};

export const useFetchPostsByUserId = ({ userId }: { userId: string }) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: [QUERY_KEY.posts, POST_QUERY_TAG.user, userId],
    queryFn: async () => {
      const posts = await fetchPosts({ userId });

      posts.forEach((post) =>
        queryClient.setQueryData<Post>(
          [QUERY_KEY.posts, POST_QUERY_TAG.detail, post.$id],
          post
        )
      );

      return posts;
    },
  });
};

export const useFetchLatestPosts = () => {
  return useQuery({
    queryKey: [QUERY_KEY.posts, POST_QUERY_TAG.latest],
    queryFn: async () => fetchPosts({}),
  });
};

export const useFetchPostDetails = ({
  id,
  initialData,
}: {
  id: string;
  initialData?: Post;
}) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: [QUERY_KEY.posts, POST_QUERY_TAG.detail, id],
    queryFn: async () => {
      const cacheData = queryClient.getQueryData([
        QUERY_KEY.posts,
        POST_QUERY_TAG.detail,
        id,
      ]) as Post;

      if (cacheData) return cacheData;

      return await fetchPostById({ id });
    },
    initialData: initialData,
  });
};

export const useFetchTrendingPosts = () => {
  return useQuery({
    queryKey: [QUERY_KEY.posts, POST_QUERY_TAG.trending],
    queryFn: fetchTrendingPosts,
  });
};

export const useFetchLike = ({
  postId,
  userId,
}: {
  postId: string;
  userId: string;
}) => {
  return useQuery({
    queryKey: [QUERY_KEY.posts, POST_QUERY_TAG.like, postId],
    queryFn: () => fetchLike({ userId, postId }),
    enabled: Boolean(postId && userId),
  });
};

export const useHandleLike = ({
  postId,
  userId,
}: {
  postId: string;
  userId: string;
}) => {
  const queryClient = useQueryClient();
  const likeQueryKey = [QUERY_KEY.posts, POST_QUERY_TAG.like, postId];
  const postDetailQueryKey = [QUERY_KEY.posts, POST_QUERY_TAG.detail, postId];

  return useMutation({
    mutationFn: () => handleLike({ postId, userId }),

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: likeQueryKey });
      await queryClient.cancelQueries({ queryKey: postDetailQueryKey });

      const prevLike = queryClient.getQueryData(likeQueryKey) as Like;

      const prevPostDetail = queryClient.getQueryData([
        QUERY_KEY.posts,
        POST_QUERY_TAG.detail,
        postId,
      ]) as Post;

      if (prevLike) {
        queryClient.setQueryData(likeQueryKey, null);

        queryClient.setQueryData<Post>(postDetailQueryKey, {
          ...prevPostDetail,
          likeCount: prevPostDetail.likeCount - 1,
        });
      } else {
        queryClient.setQueryData(likeQueryKey, { userId, postId });

        queryClient.setQueryData<Post>(postDetailQueryKey, {
          ...prevPostDetail,
          likeCount: prevPostDetail.likeCount + 1,
        });
      }

      return { prevLike, prevPostDetail };
    },

    onError: (err, variables, context) => {
      if (context) {
        queryClient.setQueryData(likeQueryKey, context.prevLike ?? null);
        queryClient.setQueryData(
          postDetailQueryKey,
          context.prevPostDetail ?? null
        );
      }
    },

    onSuccess: (data) => {
      queryClient.setQueryData(likeQueryKey, data);
    },
  });
};
