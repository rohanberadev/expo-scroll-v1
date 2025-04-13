import { images } from "@/constants/image";
import { Post } from "@/interfaces/appwrite";
import { config, storage } from "@/services/appwrite";
import MaskedView from "@react-native-masked-view/masked-view";
import { Link } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";

const imageUrls = [
  "https://images.pexels.com/photos/29352449/pexels-photo-29352449/free-photo-of-tokyo-tower-illuminated-night-skyline-view.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  "https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW1hZ2V8ZW58MHx8MHx8fDA%3D",
];

export const TrendingPostCard = ({
  post,
  ranking,
}: {
  post: Post;
  ranking: number;
}) => {
  return (
    <Link href={{ pathname: "/post/[id]", params: { id: post.$id } }} asChild>
      <TouchableOpacity className="w-36 relative pl-5">
        <Image
          source={{
            uri: storage.getFileView(config.storage.images, post.imageId).href,
          }}
          className="w-full h-48 rounded-lg"
        />

        <View className="absolute bottom-4 -left-2 px-2 py-1 rounded-full">
          <MaskedView
            maskElement={
              <Text className="text-6xl font-bold text-white">{ranking}</Text>
            }
          >
            <Image
              source={images.rankingGradient}
              className="size-16"
              resizeMode="cover"
            />
          </MaskedView>
        </View>

        <Text className="text-sm text-white mt-2 font-bold" numberOfLines={1}>
          {post.title}
        </Text>
      </TouchableOpacity>
    </Link>
  );
};
