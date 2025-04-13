import { AppLogo } from "@/components/AppLogo";
import { MyTextInput } from "@/components/MyTextInput";
import { icons } from "@/constants/icons";
import { images } from "@/constants/image";
import { useAuth } from "@/contexts/auth";
import { useUploadPost } from "@/hooks/posts";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

export default function Create() {
  const { user } = useAuth();

  const [titleValue, setTitleValue] = useState("");
  const [asset, setAsset] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [formError, setFormError] = useState("");

  const {
    mutateAsync: uploadPost,
    error: uploadPostError,
    isPending: isUploadPostPending,
    isError: isUploadPostError,
    isSuccess: isUploadPostSuccess,
  } = useUploadPost({
    data: { userId: user?.$id!, title: titleValue, userName: user?.name! },
    asset: asset!,
  });

  useEffect(() => {
    if (isUploadPostSuccess) {
      setAsset(null);
      setTitleValue("");
    }
  }, [isUploadPostSuccess]);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [5, 6],
        quality: 0.7,
      });

      if (!result.canceled) {
        setAsset(result.assets[0]);
      }
    } catch (error: any) {
      setFormError(error.message);
    }
  };

  const handleSubmit = async () => {
    if (asset && user) {
      await uploadPost();
    }
  };

  return (
    <KeyboardAwareScrollView className="flex-1 bg-primary">
      <Image source={images.bg} className="absolute z-0 w-full" />
      <AppLogo />

      <View className="px-5 mt-20 flex-col gap-y-16">
        <MyTextInput
          value={titleValue}
          onChangeText={(text) => setTitleValue(text)}
          placeholder="Enter post title"
          label="Post title"
        />

        <View className="gap-y-2">
          <Text className="text-sm text-white font-semibold ml-2">
            Post Image
          </Text>
          <TouchableOpacity
            className="w-full h-[100px] border-[1px] border-dashed border-gray-600 p-5 items-center justify-center rounded-lg"
            onPress={pickImage}
            disabled={isUploadPostPending}
          >
            <Text className="text-xl text-gray-600 font-bold">
              Upload Image
            </Text>
          </TouchableOpacity>
        </View>

        {asset && (
          <View className="gap-y-2">
            <Text className="text-sm text-white font-bold">Image Previews</Text>
            <View className="w-32 h-52 rounded-lg overflow-hidden relative">
              <Image
                source={{ uri: asset.uri ?? "" }}
                className="w-full h-full"
                resizeMode="cover"
              />
              <TouchableOpacity
                className="bg-black p-1 rounded-full absolute top-2 right-2 z-50"
                onPress={() => setAsset(null)}
                disabled={isUploadPostPending}
              >
                <Image
                  source={icons.plus}
                  className="size-6 rotate-45"
                  tintColor="#fff"
                />
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View className="gap-y-2">
          <TouchableOpacity
            className="w-full px-3 py-4 bg-accent rounded-xl flex-row justify-center items-center"
            onPress={handleSubmit}
            disabled={isUploadPostPending}
          >
            {isUploadPostPending ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text className="text-lg font-bold">Upload</Text>
            )}
          </TouchableOpacity>

          {formError && (
            <Text className="text-sm text-red-600 font-bold">{formError}</Text>
          )}

          {isUploadPostError && (
            <Text className="text-sm text-red-600 font-bold">
              {uploadPostError.message}
            </Text>
          )}
        </View>
      </View>

      <View className="w-full h-[200px]"></View>
    </KeyboardAwareScrollView>
  );
}
