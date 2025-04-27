import { Models } from "react-native-appwrite";

export interface UserProfile extends Models.Document {
  userId: string;
  name: string;
  email: string;
  profileImage: string;
  followerCount: number;
  followingCount: number;
}

export interface Post extends Models.Document {
  title: string;
  userId: string;
  userName: string;
  imageId: string;
  likeCount: number;
  commentCount: number;
}

export interface Like extends Models.Document {
  userId: string;
  postId: string;
}

export interface Follow extends Models.Document {
  followerId: string;
  followingId: string;
}

export interface PostComment extends Models.Document {
  postId: string;
  userId: string;
  content: string;
}
