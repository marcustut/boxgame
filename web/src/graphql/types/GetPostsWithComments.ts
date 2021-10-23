/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PaginationInput, Gender } from "./globalTypes";

// ====================================================
// GraphQL query operation: GetPostsWithComments
// ====================================================

export interface GetPostsWithComments_posts_user_profile {
  __typename: "Profile";
  avatarUrl: string | null;
  nameEng: string;
  gender: Gender;
}

export interface GetPostsWithComments_posts_user {
  __typename: "User";
  id: string;
  username: string;
  profile: GetPostsWithComments_posts_user_profile | null;
}

export interface GetPostsWithComments_posts_comments_user_profile {
  __typename: "Profile";
  avatarUrl: string | null;
  nameEng: string;
  gender: Gender;
}

export interface GetPostsWithComments_posts_comments_user {
  __typename: "User";
  id: string;
  username: string;
  profile: GetPostsWithComments_posts_comments_user_profile | null;
}

export interface GetPostsWithComments_posts_comments {
  __typename: "Comment";
  id: string;
  content: string;
  createdAt: TheBox.Time;
  updatedAt: TheBox.Time;
  likes: number;
  user: GetPostsWithComments_posts_comments_user;
}

export interface GetPostsWithComments_posts {
  __typename: "Post";
  id: string;
  content: string;
  images: string[];
  createdAt: TheBox.Time;
  updatedAt: TheBox.Time;
  user: GetPostsWithComments_posts_user;
  likes: number;
  liked: boolean;
  comments: GetPostsWithComments_posts_comments[];
}

export interface GetPostsWithComments {
  posts: GetPostsWithComments_posts[];
}

export interface GetPostsWithCommentsVariables {
  postsPage: PaginationInput;
  commentsPage: PaginationInput;
  user_id: string;
}
