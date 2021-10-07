import { gql } from '@apollo/client'

export type Gender = 'MALE' | 'FEMALE'
export type Role = 'PLAYER' | 'TEAMLEADER' | 'CLUSTERLEADER' | 'CREW'
export type PastoralStatus = 'PASTOR' | 'SCGL' | 'CGL' | 'PCGL' | 'ACGL' | 'OM' | 'NB' | 'NF'

export type NewAddress = {
  city: string
  line1: string
  line2?: string
  state: string
  country: string
  postalCode: string
}

export type NewProfile = {
  status: PastoralStatus
  gender: Gender
  name: string
  contact: string
  dob: string
  tngReceiptUrl?: string
  avatarUrl?: string
  address: NewAddress
}

export type NewUser = {
  id?: string
  username: string
  email: string
  profile: NewProfile
  roles: Role[]
  teamId?: string
}

export const CREATE_NEW_USER = gql`
  mutation CreateNewUser($param: NewUser!) {
    newUser(param: $param) {
      id
      username
      email
      createdAt
      updatedAt
      profile {
        id
        status
        gender
        name
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
