import { gql } from '@apollo/client'

export const GET_REGISTERED_USER_COUNT = gql`
  query GetUserCount {
    userCount
  }
`

export const GET_USER = gql`
  query GetUser($user_id: ID!) {
    user(user_id: $user_id) {
      id
      username
      email
      createdAt
      updatedAt
      profile {
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
      team {
        id
        name
        color
        points
        cluster {
          id
          name
          color
        }
      }
      roles
    }
  }
`
