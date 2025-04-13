import { Like, Post, UserProfile } from "@/interfaces/appwrite";
import { prepareNativeFile } from "@/lib/file";
import { config, database, storage } from "@/services/appwrite";
import { ImagePickerAsset } from "expo-image-picker";
import { ID, Permission, Query, Role } from "react-native-appwrite";

export const fetchUserProfiles = async ({ query }: { query: string }) => {
  const response = await database.listDocuments(
    config.databaseId,
    config.col.userProfiles.id,
    [Query.contains(config.col.userProfiles.attr.name, query)]
  );

  return response.documents as unknown as UserProfile[];
};

export const fetchUserProfile = async ({ userId }: { userId: string }) => {
  const response = await database.getDocument(
    config.databaseId,
    config.col.userProfiles.id,
    userId
  );

  return response as unknown as UserProfile;
};

export const uploadImage = (asset: ImagePickerAsset) => {
  const file = prepareNativeFile(asset);

  return storage.createFile(config.storage.images, ID.unique(), file, [
    Permission.read(Role.users()),
  ]);
};

export const uploadPost = async ({
  data,
  asset,
}: {
  data: Omit<Post, "$id" | "commentCount" | "likeCount" | "imageId">;
  asset: ImagePickerAsset;
}) => {
  if (!data.title) throw new Error("Title is required");
  if (data.title.length > 50) throw new Error("Title is too large");
  if (!asset) throw new Error("Invalid asset");

  const image = await uploadImage(asset);

  if (!image) throw new Error("Failed to upload image");

  try {
    const response = await database.createDocument(
      config.databaseId,
      config.col.posts.id,
      ID.unique(),
      {
        ...data,
        imageId: image.$id,
      }
    );

    return response as Post;
  } catch (error) {
    await storage.deleteFile(config.storage.images, image.$id);
    throw error;
  }
};

export const fetchPosts = async ({ userId }: { userId?: string }) => {
  const query = [Query.orderDesc("$createdAt")];

  if (userId) {
    query.push(Query.equal(config.col.posts.attr.userId, userId));
  }

  const response = await database.listDocuments(
    config.databaseId,
    config.col.posts.id,
    query
  );

  return response.documents as unknown as Post[];
};

export const fetchTrendingPosts = async () => {
  const posts = await database.listDocuments(
    config.databaseId,
    config.col.posts.id,
    [Query.orderDesc(config.col.posts.attr.likeCount), Query.limit(5)]
  );

  return posts.documents as unknown as Post[];
};

export const fetchPostById = ({ id }: { id: string }): Promise<Post> => {
  return database.getDocument(
    config.databaseId,
    config.col.posts.id,
    id
  ) as any;
};

export const fetchLike = async ({
  userId,
  postId,
}: {
  userId: string;
  postId: string;
}) => {
  const likeAttr = config.col.likes.attr;

  const response = await database.listDocuments(
    config.databaseId,
    config.col.likes.id,
    [
      Query.and([
        Query.equal(likeAttr.postId, postId),
        Query.equal(likeAttr.userId, userId),
      ]),
      Query.limit(1),
    ]
  );

  if (response.total === 0) return null;

  return response.documents[0];
};

export const handleLike = async ({
  postId,
  userId,
}: {
  postId: string;
  userId: string;
}): Promise<Like | null> => {
  const likeAttr = config.col.likes.attr;

  const responsePost = (await database.getDocument(
    config.databaseId,
    config.col.posts.id,
    postId
  )) as Post;

  if (!responsePost) throw new Error("Failed to fetch post");

  const responseLike = await database.listDocuments(
    config.databaseId,
    config.col.likes.id,
    [
      Query.and([
        Query.equal(likeAttr.postId, postId),
        Query.equal(likeAttr.userId, userId),
      ]),
      Query.limit(1),
    ]
  );

  if (responseLike.total === 0) {
    await database.updateDocument(
      config.databaseId,
      config.col.posts.id,
      postId,
      {
        ...responsePost,
        likeCount: responsePost.likeCount + 1,
      }
    );

    try {
      return (await database.createDocument(
        config.databaseId,
        config.col.likes.id,
        ID.unique(),
        { userId, postId }
      )) as Like;
    } catch (error) {
      await database.updateDocument(
        config.databaseId,
        config.col.posts.id,
        postId,
        {
          ...responsePost,
          likeCount: responsePost.likeCount - 1,
        }
      );
      throw error;
    }
  } else {
    await database.updateDocument(
      config.databaseId,
      config.col.posts.id,
      postId,
      {
        ...responsePost,
        likeCount: responsePost.likeCount - 1,
      }
    );

    try {
      await database.deleteDocument(
        config.databaseId,
        config.col.likes.id,
        responseLike.documents[0].$id
      );
      return null;
    } catch (error) {
      await database.updateDocument(
        config.databaseId,
        config.col.posts.id,
        postId,
        {
          ...responsePost,
          likeCount: responsePost.likeCount + 1,
        }
      );
      throw error;
    }
  }
};
