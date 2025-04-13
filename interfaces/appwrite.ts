import { Models } from "react-native-appwrite";

export interface UserProfile extends Models.Document {
  userId: string;
  name: string;
  email: string;
  profileImage: string;
}

export interface Post extends Models.Document {
  title: string;
  userId: string;
  userName: string;
  imageId: string;
  likeCount: number;
  commentCount: number;
}
