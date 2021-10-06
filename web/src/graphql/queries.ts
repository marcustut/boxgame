import { gql } from '@apollo/client'

export type RegisteredUserCount = {
  userCount: number
}

export const GET_REGISTERED_USER_COUNT = gql`
  query GetUserCount {
    userCount
  }
`
