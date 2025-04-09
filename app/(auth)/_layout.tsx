import { useAuth } from "@/contexts/auth";
import { Redirect, Slot } from "expo-router";

export default function AuthLayout() {
  const { session } = useAuth();
  return session ? <Redirect href="/" /> : <Slot />;
}
