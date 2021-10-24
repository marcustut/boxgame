/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { NewComment, Gender } from './globalTypes'

// ====================================================
// GraphQL mutation operation: CreateComment
// ====================================================

export interface CreateComment_createComment_user_profile {
  __typename: 'Profile'
  avatarUrl: string | null
  nameEng: string
  gender: Gender
}

export interface CreateComment_createComment_user {
  __typename: 'User'
  id: string
  username: string
  profile: CreateComment_createComment_user_profile | null
}

export interface CreateComment_createComment {
  __typename: 'Comment'
  id: string
  content: string
  createdAt: TheBox.Time
  updatedAt: TheBox.Time
  likes: number
  user: CreateComment_createComment_user
}

export interface CreateComment {
  createComment: CreateComment_createComment | null
}

export interface CreateCommentVariables {
  param: NewComment
}
