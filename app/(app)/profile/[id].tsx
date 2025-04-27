import { FollowButton } from "@/components/FollowButton";
import { icons } from "@/constants/icons";
import { images } from "@/constants/image";
import { useAuth } from "@/contexts/auth";
import { useFetchFollowers, useFetchFollowings } from "@/hooks/follows";
import { useFetchPostsByUserId } from "@/hooks/posts";
import { useFetchUserProfile } from "@/hooks/userProfiles";
import { Post } from "@/interfaces/appwrite";
import { config, storage } from "@/services/appwrite";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import {
  FlatList,
  Image,
  ImageBackground,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Profile() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const { data: posts, isSuccess } = useFetchPostsByUserId({
    userId: id as string,
  });

  const { data: followings } = useFetchFollowings({
    userId: id as string,
    limit: 5,
  });

  const { data: followers } = useFetchFollowers({
    userId: id as string,
    limit: 5,
  });

  const { data: userProfile } = useFetchUserProfile({ userId: id as string });

  return (
    <View className="flex-1 bg-primary">
      <ImageBackground
        source={images.bg}
        className="z-50 flex-row items-center gap-x-2 w-full h-20"
      >
        <TouchableOpacity onPress={() => router.back()} className="ml-2">
          <Image
            source={icons.chevron}
            className=" size-8 mt-1"
            tintColor="#fff"
          />
        </TouchableOpacity>

        <Text className="text-xl text-white font-bold">Back</Text>
      </ImageBackground>
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

            <View className="px-5 mt-20 items-center">
              <View className="reltaive">
                <View className="size-32 overflow-hidden rounded-full border-[2px] border-white">
                  {userProfile?.profileImage ? (
                    <Image
                      source={{ uri: userProfile?.profileImage }}
                      className="w-full h-full"
                    />
                  ) : (
                    <Image
                      source={images.placeholderProfile}
                      className="w-full h-full"
                    />
                  )}
                </View>
              </View>

              <Text className="text-lg text-white font-bold mt-1.5">
                {userProfile?.name}
              </Text>

              <View className="flex-row gap-x-4">
                <Text className="text-sm text-light-300 font-bold mt-1.5">
                  Followers: {userProfile?.followerCount}
                </Text>
                <Text className="text-sm text-light-300 font-bold mt-1.5">
                  Followings: {userProfile?.followingCount}
                </Text>
              </View>

              <View className="w-full mt-5">
                <FollowButton othersUserId={userProfile?.userId!} />
              </View>
            </View>

            <View className="w-full h-[1px] bg-gray-700 my-5"></View>

            <Link
              href={{
                pathname: "/followers/[userId]",
                params: { userId: id as string },
              }}
              asChild
            >
              <TouchableOpacity className="flex-row items-center gap-x-0.5 mb-5 px-5">
                <Text className="text-base text-white font-bold">
                  Followers
                </Text>

                <Image
                  source={icons.chevron}
                  tintColor="#fff"
                  className="size-6 rotate-180 mt-0.5"
                />
              </TouchableOpacity>
            </Link>

            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            >
              {followers?.length === 0 || !followers ? (
                <Text className="text-sm text-light-300 px-5">
                  Nothing to see here.
                </Text>
              ) : (
                followers?.map((follower) => (
                  <View className="ml-5 " key={follower.$id}>
                    <UserCard userId={follower.followingId} />
                  </View>
                ))
              )}
            </ScrollView>

            <Link
              href={{
                pathname: "/followings/[userId]",
                params: { userId: id as string },
              }}
              asChild
            >
              <TouchableOpacity className="flex-row items-center gap-x-0.5 my-5 px-5">
                <Text className="text-base text-white font-bold">
                  Followings
                </Text>

                <Image
                  source={icons.chevron}
                  tintColor="#fff"
                  className="size-6 rotate-180 mt-0.5"
                />
              </TouchableOpacity>
            </Link>

            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            >
              {followings?.length === 0 || !followings ? (
                <Text className="text-sm text-light-300 px-5">
                  Nothing to see here.
                </Text>
              ) : (
                followings?.map((following) => (
                  <View key={following.$id} className="ml-5">
                    <UserCard userId={following.followerId} />
                  </View>
                ))
              )}
            </ScrollView>

            <View className="px-5 w-full mt-10 mb-5">
              <Text className="text-base text-white font-bold">Posts</Text>
            </View>
          </>
        }
        ListFooterComponent={<View className="w-full h-[100px]"></View>}
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
  const { user } = useAuth();

  return (
    <Link
      href={
        user?.$id === userId
          ? "/myProfile"
          : {
              pathname: "/profile/[id]",
              params: { id: userId },
            }
      }
      asChild
    >
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
