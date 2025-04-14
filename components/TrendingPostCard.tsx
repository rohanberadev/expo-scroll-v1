import { images } from "@/constants/image";
import { Post } from "@/interfaces/appwrite";
import { config, storage } from "@/services/appwrite";
import MaskedView from "@react-native-masked-view/masked-view";
import { Link } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";

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
