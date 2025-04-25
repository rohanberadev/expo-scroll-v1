export const QUERY_KEY = {
  userProfiles: "userProfiles",
  posts: "posts",
  follows: "follows",
  comments: "comments",
} as const;

export const POST_QUERY_TAG = {
  latest: "latest",
  user: "user",
  detail: "detail",
  trending: "trending",
  like: "like",
} as const;

export const FOLLOWS_QUERY_TAG = {
  following: "following",
  follower: "follower",
  isFollowing: "isFollowing",
} as const;

export const COMMENT_QUERY_TAG = {
  isCommented: "isCommented",
} as const;
