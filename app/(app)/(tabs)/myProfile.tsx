import { AppLogo } from "@/components/AppLogo";
import { icons } from "@/constants/icons";
import { images } from "@/constants/image";
import { useAuth } from "@/contexts/auth";
import { uploadImage } from "@/data/appwrite";
import { useFetchFollowers, useFetchFollowings } from "@/hooks/follows";
import { useFetchPostsByUserId } from "@/hooks/posts";
import { useFetchUserProfile } from "@/hooks/userProfiles";
import { Post } from "@/interfaces/appwrite";
import { account, config, storage } from "@/services/appwrite";
import * as ImagePicker from "expo-image-picker";
import { Link } from "expo-router";
import {
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function MyProfile() {
  const { signOut, user, refetchUser } = useAuth();

  const { data: posts, isSuccess } = useFetchPostsByUserId({
    userId: user?.$id!,
  });

  const { data: followings } = useFetchFollowings({
    userId: user?.$id!,
    limit: 5,
  });

  const { data: followers } = useFetchFollowers({
    userId: user?.$id!,
    limit: 5,
  });

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [4, 4],
        quality: 0.7,
      });

      if (!result.canceled) {
        const image = await uploadImage(result.assets[0]);
        const imageUrl = storage.getFileView(config.storage.images, image.$id);
        await account.updatePrefs({ profileImage: imageUrl.href });
        await refetchUser();
      }
    } catch (error: any) {}
  };

  return (
    <View className="flex-1 bg-primary">
      <FlatList
        data={posts}
        renderItem={({ item }) => (
          <View className="h-full px-3.5 mb-8">
            <PostCard post={item} />
          </View>
        )}
        className="w-full"
        numColumns={3}
        horizontal={false}
        ListHeaderComponent={
          <>
            <Image source={images.bg} className="absolute z-0 w-full" />
            <AppLogo />

            <TouchableOpacity
              className="absolute z-50 top-8 right-10 bg-dark-200 p-3 rounded-full"
              onPress={signOut}
            >
              <Image source={icons.logout} tintColor="red" className="size-5" />
            </TouchableOpacity>

            <View className="px-5 mt-20 items-center">
              <View className="relative">
                <View className="size-32 overflow-hidden rounded-full border-[2px] border-white">
                  {user?.prefs.profileImage ? (
                    <Image
                      source={{ uri: user?.prefs.profileImage }}
                      className="w-full h-full"
                    />
                  ) : (
                    <Image
                      source={images.placeholderProfile}
                      className="w-full h-full"
                    />
                  )}
                </View>
                <TouchableOpacity
                  className="p-2 bg-accent rounded-full absolute bottom-0 right-0"
                  onPress={pickImage}
                >
                  <Image
                    source={icons.plus}
                    tintColor="#fff"
                    className="size-5"
                  />
                </TouchableOpacity>
              </View>

              <Text className="text-lg text-white font-bold mt-1.5">
                {user?.name}
              </Text>
            </View>

            <View className="w-full h-[1px] bg-gray-700 my-5"></View>

            <Link
              href={{
                pathname: "/followers/[userId]",
                params: { userId: user?.$id },
              }}
              asChild
            >
              <TouchableOpacity className="flex-row items-center gap-x-0.5 mb-5 px-5">
                <Text className="text-base text-white font-bold">
                  Your Followers
                </Text>

                <Image
                  source={icons.chevron}
                  tintColor="#fff"
                  className="size-6 rotate-180 mt-0.5"
                />
              </TouchableOpacity>
            </Link>

            <ScrollView className="px-5" horizontal={true}>
              {followers?.length === 0 || !followers ? (
                <Text className="text-sm text-light-300">
                  Nothing to see here.
                </Text>
              ) : (
                followers?.map((follower) => (
                  <UserCard key={follower.$id} userId={follower.followingId} />
                ))
              )}
            </ScrollView>

            <Link
              href={{
                pathname: "/followings/[userId]",
                params: { userId: user?.$id },
              }}
              asChild
            >
              <TouchableOpacity className="flex-row items-center gap-x-0.5 my-5 px-5">
                <Text className="text-base text-white font-bold">
                  Your Followings
                </Text>

                <Image
                  source={icons.chevron}
                  tintColor="#fff"
                  className="size-6 rotate-180 mt-0.5"
                />
              </TouchableOpacity>
            </Link>

            <ScrollView className="px-5" horizontal={true}>
              {followings?.length === 0 || !followings ? (
                <Text className="text-sm text-light-300">
                  Nothing to see here.
                </Text>
              ) : (
                followings?.map((following) => (
                  <UserCard key={following.$id} userId={following.followerId} />
                ))
              )}
            </ScrollView>

            <View className="px-5 w-full mt-10 mb-5">
              <Text className="text-base text-white font-bold">Your Posts</Text>
            </View>
          </>
        }
        ListFooterComponent={<View className="w-full h-32"></View>}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const PostCard = ({ post }: { post: Post }) => {
  return (
    <Link href={{ pathname: "/post/[id]", params: { id: post.$id } }} asChild>
      <TouchableOpacity className="w-32 overflow-hidden">
        <Image
          source={{
            uri: post.imageId
              ? storage.getFileView(config.storage.images, post.imageId).href
              : "",
          }}
          className="w-full h-52 rounded-lg"
        />

        <Text className="text-sm text-white mt-2 font-bold" numberOfLines={1}>
          {post.title}
        </Text>
      </TouchableOpacity>
    </Link>
  );
};

const UserCard = ({ userId }: { userId: string }) => {
  const { data: userProfile } = useFetchUserProfile({ userId });

  return (
    <Link href={{ pathname: "/profile/[id]", params: { id: userId } }} asChild>
      <TouchableOpacity className="w-24 h-28 overflow-hidden border-[1px] border-gray-600 rounded-lg relative">
        {userProfile?.profileImage ? (
          <Image
            source={{ uri: userProfile.profileImage }}
            className="w-full h-full"
          />
        ) : (
          <Image source={images.placeholderProfile} className="w-full h-full" />
        )}

        <View className="z-50 absolute w-full bottom-0 justify-center items-center py-2 bg-black opacity-60">
          <Text className="text-sm text-white font-bold">
            {userProfile?.name}
          </Text>
        </View>
      </TouchableOpacity>
    </Link>
  );
};
