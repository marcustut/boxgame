import { gql } from '@apollo/client'

export const MINIMAL_USER_FIELDS = gql`
  fragment MinimalUserFields on User {
    id
    username
    profile {
      avatarUrl
      nameEng
      gender
    }
  }
`

export const CORE_USER_FIELDS = gql`
  fragment CoreUserFields on User {
    id
    username
    email
    createdAt
    updatedAt
    roles
  }
`

export const CORE_PROFILE_FIELDS = gql`
  fragment CoreProfileFields on Profile {
    id
    status
    gender
    satellite
    nameEng
    nameChi
    contact
    dob
    tngReceiptUrl
    avatarUrl
    createdAt
    updatedAt
    address {
      id
      city
      line1
      line2
      state
      country
      postalCode
    }
    invitedBy
  }
`

export const CORE_POST_FIELDS = gql`
  ${MINIMAL_USER_FIELDS}
  fragment CorePostFields on Post {
    id
    content
    images
    createdAt
    updatedAt
    user {
      ...MinimalUserFields
    }
    likes
  }
`

export const CORE_COMMENT_FIELDS = gql`
  ${MINIMAL_USER_FIELDS}
  fragment CoreCommentFields on Comment {
    id
    content
    createdAt
    updatedAt
    likes
    user {
      ...MinimalUserFields
    }
  }
`

export const CORE_MISSION_FIELDS = gql`
  fragment CoreMissionFields on Mission {
    id
    title
    description
    points
    createdAt
    updatedAt
    startAt
    endAt
  }
`
