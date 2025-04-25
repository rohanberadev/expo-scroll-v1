import { Text, TextInput, View } from "react-native";

export const MyTextInput = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  className,
}: {
  label?: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  className?: string;
}) => {
  return (
    <View className={`w-full flex-col gap-y-2 ${className}`}>
      {label ? (
        <Text className="text-sm text-white font-semibold ml-2">{label}</Text>
      ) : null}
      <View className="bg-dark-200 rounded-lg flex-row px-2 border-[1px] border-gray-600">
        <TextInput
          className="flex-1 text-white py-4"
          placeholder={placeholder}
          placeholderTextColor="#ab8bff"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
        />
      </View>
    </View>
  );
};
