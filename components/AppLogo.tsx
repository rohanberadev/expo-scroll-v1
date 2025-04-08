import { icons } from "@/constants/icons";
import { Image } from "react-native";

export const AppLogo = ({ className }: { className?: string }) => {
  return (
    <Image
      source={icons.logo}
      className={`mt-20 mx-auto w-12 h-10 ${className}`}
    />
  );
};
