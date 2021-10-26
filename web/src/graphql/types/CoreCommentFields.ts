/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { Gender } from "./globalTypes";

// ====================================================
// GraphQL fragment: CoreCommentFields
// ====================================================

export interface CoreCommentFields_user_profile {
  __typename: "Profile";
  avatarUrl: string | null;
  nameEng: string;
  gender: Gender;
}

export interface CoreCommentFields_user {
  __typename: "User";
  id: string;
  username: string;
  profile: CoreCommentFields_user_profile | null;
}

export interface CoreCommentFields {
  __typename: "Comment";
  id: string;
  content: string;
  createdAt: TheBox.Time;
  updatedAt: TheBox.Time;
  likes: number;
  user: CoreCommentFields_user;
}
