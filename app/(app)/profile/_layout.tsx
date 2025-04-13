import { useAuth } from "@/contexts/auth";
import { Redirect, Slot, useLocalSearchParams } from "expo-router";

export default function ProfileLayout() {
  const { user } = useAuth();
  const { id } = useLocalSearchParams();
  return user?.$id !== id ? <Slot /> : <Redirect href="/myProfile" />;
}
