/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { Role } from './globalTypes'

// ====================================================
// GraphQL fragment: CoreUserFields
// ====================================================

export interface CoreUserFields {
  __typename: 'User'
  id: string
  username: string
  email: string
  createdAt: TheBox.Time
  updatedAt: TheBox.Time
  roles: Role[]
}
