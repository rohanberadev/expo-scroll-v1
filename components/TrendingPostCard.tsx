import { images } from "@/constants/image";
import MaskedView from "@react-native-masked-view/masked-view";
import { Link } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";

const imageUrls = [
  "https://images.pexels.com/photos/29352449/pexels-photo-29352449/free-photo-of-tokyo-tower-illuminated-night-skyline-view.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  "https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW1hZ2V8ZW58MHx8MHx8fDA%3D",
];

export const TrendingPostCard = () => {
  return (
    <Link href="/post" asChild>
      <TouchableOpacity className="w-36 relative pl-5">
        <Image
          source={{
            uri: imageUrls[0],
          }}
          className="w-full h-48 rounded-lg"
        />

        <View className="absolute -bottom-[68%] -left-2 px-2 py-1 rounded-full">
          <MaskedView
            maskElement={
              <Text className="text-6xl font-bold text-white">1</Text>
            }
          >
            <Image source={images.rankingGradient} resizeMode="cover" />
          </MaskedView>
        </View>

        <Text className="text-sm text-white mt-2 font-bold" numberOfLines={1}>
          I am in Paris
        </Text>
      </TouchableOpacity>
    </Link>
  );
};
