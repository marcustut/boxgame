/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { NewPost, PaginationInput, Gender } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: CreatePost
// ====================================================

export interface CreatePost_createPost_user_profile {
  __typename: "Profile";
  avatarUrl: string | null;
  nameEng: string;
  gender: Gender;
}

export interface CreatePost_createPost_user {
  __typename: "User";
  id: string;
  username: string;
  profile: CreatePost_createPost_user_profile | null;
}

export interface CreatePost_createPost_comments_user_profile {
  __typename: "Profile";
  avatarUrl: string | null;
  nameEng: string;
  gender: Gender;
}

export interface CreatePost_createPost_comments_user {
  __typename: "User";
  id: string;
  username: string;
  profile: CreatePost_createPost_comments_user_profile | null;
}

export interface CreatePost_createPost_comments {
  __typename: "Comment";
  id: string;
  content: string;
  createdAt: TheBox.Time;
  likes: number;
  user: CreatePost_createPost_comments_user;
}

export interface CreatePost_createPost {
  __typename: "Post";
  id: string;
  content: string;
  images: string[];
  createdAt: TheBox.Time;
  updatedAt: TheBox.Time;
  user: CreatePost_createPost_user;
  likes: number;
  liked: boolean;
  comments: CreatePost_createPost_comments[];
}

export interface CreatePost {
  createPost: CreatePost_createPost | null;
}

export interface CreatePostVariables {
  param: NewPost;
  user_id: string;
  commentsPage: PaginationInput;
}
