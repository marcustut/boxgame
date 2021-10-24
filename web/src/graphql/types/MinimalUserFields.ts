/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { Gender } from './globalTypes'

// ====================================================
// GraphQL fragment: MinimalUserFields
// ====================================================

export interface MinimalUserFields_profile {
  __typename: 'Profile'
  avatarUrl: string | null
  nameEng: string
  gender: Gender
}

export interface MinimalUserFields {
  __typename: 'User'
  id: string
  username: string
  profile: MinimalUserFields_profile | null
}
