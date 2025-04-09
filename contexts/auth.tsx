import { account } from "@/services/appwrite";
import React, { createContext, useContext, useEffect, useState } from "react";
import { ID } from "react-native-appwrite";

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [session, setSession] = useState<Session>();
  const [user, setUser] = useState<User>();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const responseSession = await account.getSession("current");
      setSession(responseSession);

      const responseUser = await account.get();
      setUser(responseUser);
    } catch (error: any) {
      // setError(error.message);
    } finally {
      setLoading(false);
    }
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
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuth can be only used inside an AuthProvider");
  return context;
};

export { AuthProvider, useAuth };
