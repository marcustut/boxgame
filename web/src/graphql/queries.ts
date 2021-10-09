import { gql } from '@apollo/client'

export const GET_REGISTERED_USER_COUNT = gql`
  query GetUserCount {
    userCount
  }
`
