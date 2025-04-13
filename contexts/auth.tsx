import { icons } from "@/constants/icons";
import { images } from "@/constants/image";
import { account } from "@/services/appwrite";
import React, { createContext, useContext, useEffect, useState } from "react";
import { ActivityIndicator, Image, StatusBar, View } from "react-native";
import { ID } from "react-native-appwrite";
import { SafeAreaView } from "react-native-safe-area-context";

type Session = Awaited<ReturnType<typeof account.getSession>>;
type User = Awaited<ReturnType<typeof account.get>>;

type AuthContextProps = {
  user: User | undefined;
  session: Session | undefined;
  loading: boolean;
  error: string;

  signUp: ({
    email,
    password,
    name,
  }: {
    email: string;
    password: string;
    name: string;
  }) => Promise<void>;

  signIn: ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => Promise<void>;

  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [initialLoading, setInitialLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [session, setSession] = useState<Session>();
  const [user, setUser] = useState<User>();

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    try {
      setInitialLoading(true);
      await checkAuth();
    } catch (error: any) {
    } finally {
      setInitialLoading(false);
    }
  };

  const checkAuth = async () => {
    const responseSession = await account.getSession("current");
    setSession(responseSession);

    const responseUser = await account.get();
    setUser(responseUser);
  };

  const signUp = async ({
    email,
    password,
    name,
  }: {
    email: string;
    password: string;
    name: string;
  }) => {
    try {
      setLoading(true);

      const responseUser = await account.create(
        ID.unique(),
        email,
        password,
        name
      );
      const responseSession = await account.createEmailPasswordSession(
        email,
        password
      );

      setSession(responseSession);
      setUser(responseUser);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    try {
      setLoading(true);

      const responseSession = await account.createEmailPasswordSession(
        email,
        password
      );
      const responseUser = await account.get();

      setSession(responseSession);
      setUser(responseUser);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await account.deleteSession("current");
      setSession(undefined);
      setUser(undefined);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const contextData = {
    user,
    session,
    loading,
    error,
    signUp,
    signIn,
    signOut,
  };

  return (
    <AuthContext.Provider value={contextData}>
      {initialLoading ? (
        <SafeAreaView className="flex-1">
          <View className="flex-1 bg-primary">
            <Image source={images.bg} className="absolute z-0 w-full" />
            <Image
              source={icons.logo}
              className="w-12 h-10 mb-5 mx-auto mt-20"
            />

            <ActivityIndicator size="large" color="#0000ff" className="mt-10" />
          </View>
          <StatusBar hidden={true} />
        </SafeAreaView>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuth can be only used inside an AuthProvider");
  return context;
};

export { AuthProvider, useAuth };
