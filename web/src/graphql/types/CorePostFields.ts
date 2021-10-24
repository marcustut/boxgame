/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { Gender } from './globalTypes'

// ====================================================
// GraphQL fragment: CorePostFields
// ====================================================

export interface CorePostFields_user_profile {
  __typename: 'Profile'
  avatarUrl: string | null
  nameEng: string
  gender: Gender
}

export interface CorePostFields_user {
  __typename: 'User'
  id: string
  username: string
  profile: CorePostFields_user_profile | null
}

export interface CorePostFields {
  __typename: 'Post'
  id: string
  content: string
  images: string[]
  createdAt: TheBox.Time
  updatedAt: TheBox.Time
  user: CorePostFields_user
  likes: number
}
