import { QUERY_KEY } from "@/constants/query";
import { fetchUserProfiles } from "@/data/appwrite";
import { useQuery } from "@tanstack/react-query";

export const useFetchUserProfiles = ({ query }: { query: string }) => {
  return useQuery({
    queryKey: [QUERY_KEY.userProfiles, query],
    queryFn: () => fetchUserProfiles({ query }),
    enabled: Boolean(query),
  });
};
