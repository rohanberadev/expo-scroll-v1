import { FOLLOWS_QUERY_TAG, QUERY_KEY } from "@/constants/query";
import {
  fetchFollowers,
  fetchFollowing,
  fetchFollowings,
  handleFollow,
} from "@/data/appwrite";
import { Follow } from "@/interfaces/appwrite";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useFetchFollowing = ({
  myUserId,
  userId,
}: {
  myUserId: string;
  userId: string;
}) => {
  return useQuery({
    queryFn: () => fetchFollowing({ userId, myUserId }),
    queryKey: [QUERY_KEY.follows, FOLLOWS_QUERY_TAG.isFollowing, userId],
    enabled: Boolean(myUserId && userId),
  });
};

export const useHandleFollow = ({
  myUserId,
  userId,
}: {
  myUserId: string;
  userId: string;
}) => {
  const queryClient = useQueryClient();

  const followQueryKey = [
    QUERY_KEY.follows,
    FOLLOWS_QUERY_TAG.isFollowing,
    userId,
  ];

  return useMutation({
    mutationFn: () => handleFollow({ myUserId, userId }),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: followQueryKey });

      const prevFollow = queryClient.getQueryData(followQueryKey) as Follow;

      queryClient.setQueryData(followQueryKey, {
        followerId: userId,
        followingId: myUserId,
      });

      return { prevFollow };
    },

    onError: (err, variables, context) => {
      if (context) {
        queryClient.setQueryData(followQueryKey, context.prevFollow ?? null);
      }
    },

    onSuccess: (data, variables, context) => {
      queryClient.setQueryData(followQueryKey, data);
    },
  });
};

export const useFetchFollowings = ({
  userId,
  limit,
  initialData,
}: {
  userId: string;
  limit?: number;
  initialData?: Follow[];
}) => {
  return useQuery({
    queryFn: () => fetchFollowings({ userId, limit }),
    queryKey: [QUERY_KEY.follows, FOLLOWS_QUERY_TAG.following, userId],
    initialData,
  });
};

export const useFetchFollowers = ({
  userId,
  limit,
  initialData,
}: {
  userId: string;
  limit?: number;
  initialData?: Follow[];
}) => {
  return useQuery({
    queryFn: () => fetchFollowers({ userId, limit }),
    queryKey: [QUERY_KEY.follows, FOLLOWS_QUERY_TAG.follower, userId],
    initialData,
  });
};
