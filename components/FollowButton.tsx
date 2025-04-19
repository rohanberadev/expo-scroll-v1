import { useAuth } from "@/contexts/auth";
import { useFetchFollowing, useHandleFollow } from "@/hooks/follows";
import { Text, TouchableOpacity } from "react-native";

export const FollowButton = ({ othersUserId }: { othersUserId: string }) => {
  const { user } = useAuth();

  const {
    data: follow,
    isLoading: isfollowLoading,
    error: followError,
  } = useFetchFollowing({
    myUserId: user?.$id!,
    userId: othersUserId,
  });

  const {
    mutateAsync: handleFollow,
    isPending: isHandleFollowPending,
    error: handleFollowError,
  } = useHandleFollow({
    myUserId: user?.$id!,
    userId: othersUserId,
  });

  if (isfollowLoading) return null;

  return (
    <TouchableOpacity
      className={`px-8 py-2 justify-center items-center ${
        follow
          ? "bg-dark-200 rounded-xl border-[1px] border-accent"
          : "bg-accent rounded-full"
      }`}
      onPress={async () => {
        if (user?.$id && othersUserId) {
          await handleFollow();
        }
      }}
      disabled={isHandleFollowPending || isfollowLoading}
    >
      <Text
        className={`text-base font-bold ${
          follow ? "text-white" : "text-black"
        }`}
      >
        {follow ? "Unfollow" : "Follow"}
      </Text>
    </TouchableOpacity>
  );
};
