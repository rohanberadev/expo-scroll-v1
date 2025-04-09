import { Platform } from "react-native";
import { Account, Client } from "react-native-appwrite";

const config = {
  apiEndpoint: process.env.EXPO_PUBLIC_APPWRITE_API_ENDPOINT!,
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
  androidPackageName: process.env.EXPO_PUBLIC_APPWRITE_ANDROID_PACKAGE_NAME!,
  col: {},
};

const client = new Client()
  .setEndpoint(config.apiEndpoint)
  .setProject(config.projectId);

switch (Platform.OS) {
  case "android":
    client.setPlatform(config.androidPackageName);
    break;
  case "ios":
    break;
}

const account = new Account(client);

export { account, client, config };
