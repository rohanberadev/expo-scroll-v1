import { useAuth } from "@/contexts/auth";
import { Redirect, Slot } from "expo-router";

export default function AppLayout() {
  const { session } = useAuth();
  return session ? <Slot /> : <Redirect href="/signIn" />;
}
