import { AppLogo } from "@/components/AppLogo";
import { Searchbar } from "@/components/SearchBar";
import { images } from "@/constants/image";
import { useFetchUserProfiles } from "@/hooks/userProfiles";
import { UserProfile } from "@/interfaces/appwrite";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Search() {
  const [debounceSearchQuery, setDebounceSearchQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const {
    data: userProfiles,
    error,
    isLoading,
    isSuccess,
    isError,
  } = useFetchUserProfiles({
    query: debounceSearchQuery,
  });

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery) {
        setDebounceSearchQuery(searchQuery);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  return (
    <View className="flex-1 bg-primary">
      <FlatList
        data={userProfiles}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => <UserPorfileCard user={item} />}
        contentContainerStyle={{ paddingBottom: 30 }}
        ListEmptyComponent={
          !isLoading && !isError ? (
            <Text className="text-sm text-center text-light-300 font-bold mt-10">
              Search people name
            </Text>
          ) : null
        }
        ListHeaderComponent={
          <>
            <Image source={images.bg} className="absolute z-0 w-full" />
            <AppLogo />

            <View className="w-full mt-10 px-5">
              <Searchbar
                value={searchQuery}
                onChangeText={(text) => setSearchQuery(text)}
                placeholder="Search new people"
              />

              {isLoading && (
                <ActivityIndicator
                  size="large"
                  color="#AB8BFF"
                  className="self-center mt-10"
                />
              )}
            </View>
            {isSuccess && (
              <Text className="text-lg text-white font-bold px-5 my-5">
                Search result for:{" "}
                <Text className="text-lg text-light-300 font-bold">
                  {searchQuery}
                </Text>
              </Text>
            )}
          </>
        }
      />
    </View>
  );
}

const UserPorfileCard = ({ user }: { user: UserProfile }) => {
  return (
    <Link
      href={{ pathname: "/profile/[id]", params: { id: user.userId } }}
      asChild
    >
      <TouchableOpacity className="w-full p-5 flex-row items-center gap-x-4 border-b-[1px] border-gray-600">
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
      </TouchableOpacity>
    </Link>
  );
};
