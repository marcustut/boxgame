/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { Gender } from "./globalTypes";

// ====================================================
// GraphQL query operation: GetPost
// ====================================================

export interface GetPost_post_user_profile {
  __typename: "Profile";
  avatarUrl: string | null;
  nameEng: string;
  gender: Gender;
}

export interface GetPost_post_user {
  __typename: "User";
  id: string;
  username: string;
  profile: GetPost_post_user_profile | null;
}

export interface GetPost_post {
  __typename: "Post";
  id: string;
  content: string;
  images: string[];
  createdAt: TheBox.Time;
  updatedAt: TheBox.Time;
  user: GetPost_post_user;
  likes: number;
  liked: boolean;
}

export interface GetPost {
  post: GetPost_post | null;
}

export interface GetPostVariables {
  post_id: string;
  user_id: string;
}
