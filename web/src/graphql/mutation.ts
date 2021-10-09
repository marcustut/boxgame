import { gql } from '@apollo/client'

export const CREATE_NEW_USER = gql`
  mutation CreateNewUser($param: NewUser!) {
    createUser(param: $param) {
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
      }
      roles
    }
  }
`
