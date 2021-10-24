/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PaginationInput, Gender } from './globalTypes'

// ====================================================
// GraphQL query operation: GetPostWithComments
// ====================================================

export interface GetPostWithComments_post_user_profile {
  __typename: 'Profile'
  avatarUrl: string | null
  nameEng: string
  gender: Gender
}

export interface GetPostWithComments_post_user {
  __typename: 'User'
  id: string
  username: string
  profile: GetPostWithComments_post_user_profile | null
}

export interface GetPostWithComments_post_comments_user_profile {
  __typename: 'Profile'
  avatarUrl: string | null
  nameEng: string
  gender: Gender
}

export interface GetPostWithComments_post_comments_user {
  __typename: 'User'
  id: string
  username: string
  profile: GetPostWithComments_post_comments_user_profile | null
}

export interface GetPostWithComments_post_comments {
  __typename: 'Comment'
  id: string
  content: string
  createdAt: TheBox.Time
  updatedAt: TheBox.Time
  likes: number
  user: GetPostWithComments_post_comments_user
}

export interface GetPostWithComments_post {
  __typename: 'Post'
  id: string
  content: string
  images: string[]
  createdAt: TheBox.Time
  updatedAt: TheBox.Time
  user: GetPostWithComments_post_user
  likes: number
  liked: boolean
  comments: GetPostWithComments_post_comments[]
}

export interface GetPostWithComments {
  post: GetPostWithComments_post | null
}

export interface GetPostWithCommentsVariables {
  post_id: string
  user_id: string
  commentsPage: PaginationInput
}
