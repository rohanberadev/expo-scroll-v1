import { icons } from "@/constants/icons";
import { Link } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";

const imageUrls = [
  "https://images.pexels.com/photos/29352449/pexels-photo-29352449/free-photo-of-tokyo-tower-illuminated-night-skyline-view.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  "https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW1hZ2V8ZW58MHx8MHx8fDA%3D",
];

export const PostCard = () => {
  return (
    <Link href="/post" asChild>
      <TouchableOpacity className="w-full flex-col gap-y-2.5">
        <View className="w-full rounded-xl overflow-hidden relative">
          <Image
            source={{
              uri: imageUrls[0],
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
                <Text className="text-sm text-white font-bold">John Doe</Text>
                <Text className="text-xs text-white" numberOfLines={1}>
                  I am in Paris
                </Text>
              </View>
            </View>

            <View className="flex-row items-center gap-x-5 mr-4">
              <TouchableOpacity className="flex-col items-center gap-y-1">
                <Image
                  source={icons.heart}
                  className="size-6"
                  tintColor="#fff"
                />
                <Text className="text-xs text-white">999</Text>
              </TouchableOpacity>

              <Link href="/post" asChild>
                <TouchableOpacity className="flex-col items-center gap-y-1">
                  <Image
                    source={icons.message}
                    className="size-6"
                    tintColor="#fff"
                  />
                  <Text className="text-xs text-white">999</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );
};
