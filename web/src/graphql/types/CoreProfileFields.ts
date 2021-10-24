/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PastoralStatus, Gender, Satellite } from './globalTypes'

// ====================================================
// GraphQL fragment: CoreProfileFields
// ====================================================

export interface CoreProfileFields_address {
  __typename: 'Address'
  id: string
  city: string
  line1: string
  line2: string | null
  state: string
  country: string
  postalCode: string
}

export interface CoreProfileFields {
  __typename: 'Profile'
  id: string
  status: PastoralStatus | null
  gender: Gender
  satellite: Satellite | null
  nameEng: string
  nameChi: string | null
  contact: string
  dob: TheBox.Time
  tngReceiptUrl: string | null
  avatarUrl: string | null
  createdAt: TheBox.Time
  updatedAt: TheBox.Time
  address: CoreProfileFields_address | null
  invitedBy: string | null
}
