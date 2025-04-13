import { POST_QUERY_TAG, QUERY_KEY } from "@/constants/query";
import {
  fetchPostById,
  fetchPosts,
  fetchTrendingPosts,
  uploadPost,
} from "@/data/appwrite";
import { Post } from "@/interfaces/appwrite";
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
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: [QUERY_KEY.posts, POST_QUERY_TAG.latest],
    queryFn: async () => {
      const posts = await fetchPosts({});

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

export const useFetchPostDetails = ({ id }: { id: string }) => {
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
  });
};

export const useFetchTrendingPosts = () => {
  return useQuery({
    queryKey: [QUERY_KEY.posts, POST_QUERY_TAG.trending],
    queryFn: fetchTrendingPosts,
  });
};
