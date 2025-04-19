import { QUERY_KEY } from "@/constants/query";
import { fetchUserProfile, fetchUserProfiles } from "@/data/appwrite";
import { useQuery } from "@tanstack/react-query";

export const useFetchUserProfiles = ({
  query,
  myUserId,
}: {
  query: string;
  myUserId: string;
}) => {
  return useQuery({
    queryKey: [QUERY_KEY.userProfiles, query],
    queryFn: () => fetchUserProfiles({ query, myUserId }),
    enabled: Boolean(query),
  });
};

export const useFetchUserProfile = ({ userId }: { userId: string }) => {
  return useQuery({
    queryKey: [QUERY_KEY.userProfiles, userId],
    queryFn: () => fetchUserProfile({ userId }),
    enabled: Boolean(userId),
  });
};
