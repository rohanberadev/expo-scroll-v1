import { Platform } from "react-native";
import { Account, Client, Databases, Storage } from "react-native-appwrite";

const config = {
  apiEndpoint: process.env.EXPO_PUBLIC_APPWRITE_API_ENDPOINT!,
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
  databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!,
  androidPackageName: process.env.EXPO_PUBLIC_APPWRITE_ANDROID_PACKAGE_NAME!,
  storage: { images: process.env.EXPO_PUBLIC_APPWRITE_BUCKET_IMAGES! },
  col: {
    userProfiles: {
      id: process.env.EXPO_PUBLIC_APPWRITE_COL_USER_PROFILES!,
      attr: {
        userId: "userId",
        name: "name",
        email: "email",
        profileImage: "profileImage",
      },
    },

    posts: {
      id: process.env.EXPO_PUBLIC_APPWRITE_COL_POSTS!,
      attr: {
        userId: "userId",
        userName: "name",
        imageId: "imageId",
        title: "title",
        likeCount: "likeCount",
        commentCount: "commentCount",
      },
    },

    likes: {
      id: process.env.EXPO_PUBLIC_APPWRITE_COL_LIKES!,
      attr: {
        postId: "postId",
        userId: "userId",
      },
    },
  },
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

const database = new Databases(client);

const storage = new Storage(client);

export { account, client, config, database, storage };
