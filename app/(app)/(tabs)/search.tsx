import { AppLogo } from "@/components/AppLogo";
import { Searchbar } from "@/components/SearchBar";
import { UserProfileCard } from "@/components/UserProfileCard";
import { images } from "@/constants/image";
import { useAuth } from "@/contexts/auth";
import { useFetchUserProfiles } from "@/hooks/userProfiles";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, Text, View } from "react-native";

export default function Search() {
  const { user } = useAuth();
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
    myUserId: user?.$id!,
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
        renderItem={({ item }) => <UserProfileCard user={item} />}
        contentContainerStyle={{ paddingBottom: 30 }}
        ListEmptyComponent={
          searchQuery && !isLoading && !isError ? (
            <Text className="text-sm text-center text-light-300 font-bold mt-10">
              People with this keyword not found
            </Text>
          ) : !isLoading && !isError ? (
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
