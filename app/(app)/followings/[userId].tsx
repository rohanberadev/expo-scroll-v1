import { UserProfileCard } from "@/components/UserProfileCard";
import { icons } from "@/constants/icons";
import { useFetchFollowings } from "@/hooks/follows";
import { useFetchUserProfile } from "@/hooks/userProfiles";
import { useLocalSearchParams, useRouter } from "expo-router";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";

export default function Followings() {
  const { userId } = useLocalSearchParams();
  const router = useRouter();

  const { data: followings } = useFetchFollowings({ userId: userId as string });

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

        <Text className="text-xl text-white font-bold">Followers</Text>
      </View>

      <FlatList
        data={followings}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => <UserCard userId={item.followerId} />}
        ListEmptyComponent={
          <Text className="self-center text-lg text-light-300 font-bold">
            Nothing to see here.
          </Text>
        }
      />
    </View>
  );
}

const UserCard = ({ userId }: { userId: string }) => {
  const { data: userProfile } = useFetchUserProfile({ userId });

  if (!userProfile) return null;

  return <UserProfileCard user={userProfile} />;
};
