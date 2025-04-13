import { icons } from "@/constants/icons";
import { useAuth } from "@/contexts/auth";
import { useFetchPostDetails } from "@/hooks/posts";
import { useFetchUserProfile } from "@/hooks/userProfiles";
import { config, storage } from "@/services/appwrite";
import { Link, Redirect, useLocalSearchParams, useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const imageUrls = [
  "https://images.pexels.com/photos/29352449/pexels-photo-29352449/free-photo-of-tokyo-tower-illuminated-night-skyline-view.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  "https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW1hZ2V8ZW58MHx8MHx8fDA%3D",
];

export default function Post() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const { user } = useAuth();
  const { data: userProfile } = useFetchUserProfile({ userId: user?.$id! });

  const [commentValue, setCommentValue] = useState("");
  const scrollViewRef = useRef<ScrollView>(null);

  const {
    data: post,
    error: postError,
    isLoading: isPostLoading,
    isError: isPostError,
    isSuccess: isPostSuccess,
  } = useFetchPostDetails({ id: id as string });

  function scrollToTop() {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  }

  if (isPostSuccess && !post) {
    return <Redirect href="/" />;
  }

  if (isPostLoading) {
    return (
      <View className="flex-1 bg-primary justify-center items-center">
        <ActivityIndicator size="large" color="#AB8BFF" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-primary">
      <ScrollView ref={scrollViewRef}>
        <View className="fixed z-50 flex-row items-center gap-x-2 border-b-[1px] border-light-300 w-full h-20">
          <TouchableOpacity onPress={() => router.back()} className="ml-2">
            <Image
              source={icons.chevron}
              className=" size-8 mt-1"
              tintColor="#fff"
            />
          </TouchableOpacity>

          <Text className="text-xl text-white font-bold">Post</Text>
        </View>

        <View className="w-full">
          <View className="w-full p-5 flex-row justify-between items-center">
            <View className="flex-row items-center gap-x-4">
              <Link
                href={{ pathname: "/profile/[id]", params: { id: user?.$id! } }}
                asChild
              >
                <TouchableOpacity className="size-12 overflow-hidden rounded-full">
                  <Image
                    source={{
                      uri: userProfile?.profileImage,
                    }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              </Link>

              <Text className="text-lg text-white font-bold">
                {post?.userName}
              </Text>
            </View>
            {post?.userId !== user?.$id && (
              <TouchableOpacity className="px-8 py-2 justify-center items-center bg-accent rounded-full">
                <Text className="text-base font-bold">Follow</Text>
              </TouchableOpacity>
            )}
          </View>

          <View className="w-full">
            <View className="w-full h-[450px] overflow-hidden rounded-b-xl">
              <Image
                source={{
                  uri: storage.getFileView(
                    config.storage.images,
                    post?.imageId!
                  ).href,
                }}
                className="w-full h-full"
                resizeMode="stretch"
              />
            </View>

            <TouchableOpacity className="size-12 flex justify-center items-center bg-black absolute top-5 right-5 rounded-full">
              <Image source={icons.heart} tintColor="#fff" className="size-6" />
            </TouchableOpacity>
          </View>

          <View className="mt-5 w-full px-5 relative h-[3000px]">
            <Text className="text-xl font-bold text-white">Comments</Text>
          </View>

          {/* <View className="w-full px-5 mt-10">
          <MyTextInput
          placeholder="Eg: I like your photo"
          label="Enter your comment"
          value={commentValue}
          onChangeText={(text) => setCommentValue(text)}
          />
          </View> */}
        </View>
      </ScrollView>
      <TouchableOpacity
        className="absolute -bottom-20 left-1/2 -translate-x-1/2 z-50 w-48 bg-accent p-2 justify-center items-center rounded-full"
        onPress={scrollToTop}
      >
        <Text className="text-xl text-white">Back to top</Text>
      </TouchableOpacity>
    </View>
  );
}
