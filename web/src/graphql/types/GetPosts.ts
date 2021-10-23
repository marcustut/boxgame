/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PaginationInput, Gender } from "./globalTypes";

// ====================================================
// GraphQL query operation: GetPosts
// ====================================================

export interface GetPosts_posts_user_profile {
  __typename: "Profile";
  avatarUrl: string | null;
  nameEng: string;
  gender: Gender;
}

export interface GetPosts_posts_user {
  __typename: "User";
  id: string;
  username: string;
  profile: GetPosts_posts_user_profile | null;
}

export interface GetPosts_posts {
  __typename: "Post";
  id: string;
  content: string;
  images: string[];
  createdAt: TheBox.Time;
  updatedAt: TheBox.Time;
  user: GetPosts_posts_user;
  likes: number;
  liked: boolean;
}

export interface GetPosts {
  posts: GetPosts_posts[];
}

export interface GetPostsVariables {
  postsPage: PaginationInput;
  user_id: string;
}
