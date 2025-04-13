import { icons } from "@/constants/icons";
import { Post } from "@/interfaces/appwrite";
import { config, storage } from "@/services/appwrite";
import { Link } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";

const imageUrls = [
  "https://images.pexels.com/photos/29352449/pexels-photo-29352449/free-photo-of-tokyo-tower-illuminated-night-skyline-view.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  "https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW1hZ2V8ZW58MHx8MHx8fDA%3D",
];

export const PostCard = ({ post }: { post: Post }) => {
  return (
    <Link href={{ pathname: "/post/[id]", params: { id: post.$id } }} asChild>
      <TouchableOpacity className="w-full flex-col gap-y-2.5">
        <View className="w-full rounded-xl overflow-hidden relative">
          <Image
            source={{
              uri: storage.getFileView(config.storage.images, post.imageId)
                .href,
            }}
            className="w-full h-[400px]"
            resizeMode="cover"
          />

          <View className="absolute bottom-0 bg-black w-full h-16 z-50 opacity-80 flex flex-row items-center justify-between">
            <View className="flex-row items-center gap-x-2">
              <View className="ml-2 w-10 h-10 rounded-full overflow-hidden">
                <Image
                  source={{ uri: imageUrls[1] }}
                  className="w-full h-full"
                />
              </View>

              <View className="flex-col">
                <Text className="text-sm text-white font-bold">
                  {post.userName}
                </Text>
                <Text className="text-xs text-white" numberOfLines={1}>
                  {post.title}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center gap-x-5 mr-4">
              <View className="flex-col items-center gap-y-1">
                <TouchableOpacity>
                  <Image
                    source={icons.heart}
                    className="size-6"
                    tintColor="#fff"
                  />
                </TouchableOpacity>

                <Text className="text-xs text-white">{post.likeCount}</Text>
              </View>

              <View className="flex-col items-center gap-y-1">
                <Link
                  href={{ pathname: "/post/[id]", params: { id: "123" } }}
                  asChild
                >
                  <TouchableOpacity>
                    <Image
                      source={icons.message}
                      className="size-6"
                      tintColor="#fff"
                    />
                  </TouchableOpacity>
                </Link>

                <Text className="text-xs text-white">{post.commentCount}</Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );
};
