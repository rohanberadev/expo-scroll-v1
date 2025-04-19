import { images } from "@/constants/image";
import { UserProfile } from "@/interfaces/appwrite";
import { Link } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { FollowButton } from "./FollowButton";

export const UserProfileCard = ({
  user,
  enableFollowButton,
}: {
  user: UserProfile;
  enableFollowButton?: boolean;
}) => {
  return (
    <Link
      href={{ pathname: "/profile/[id]", params: { id: user.userId } }}
      asChild
    >
      <TouchableOpacity className="w-full p-5 flex-row items-center border-b-[1px] border-gray-600 justify-between">
        <View className="flex-row gap-x-4 items-center">
          <View className="size-12 rounded-full overflow-hidden">
            {user.profileImage ? (
              <Image
                source={{
                  uri: user.profileImage,
                }}
                className="w-full h-full"
              />
            ) : (
              <Image
                source={images.placeholderProfile}
                className="w-full h-full"
              />
            )}
          </View>
          <Text className="text-lg text-white font-bold">{user.name}</Text>
        </View>

        {enableFollowButton && <FollowButton othersUserId={user.$id} />}
      </TouchableOpacity>
    </Link>
  );
};
