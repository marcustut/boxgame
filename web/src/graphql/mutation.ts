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

export const CREATE_POST = gql`
  mutation CreatePost($param: NewPost!, $user_id: ID!, $commentsPage: PaginationInput!) {
    createPost(param: $param) {
      id
      content
      images
      createdAt
      updatedAt
      user {
        id
        username
        profile {
          avatarUrl
          nameEng
          gender
        }
      }
      likes
      liked(user_id: $user_id)
      comments(page: $commentsPage) {
        id
        content
        createdAt
        likes
        user {
          id
          username
          profile {
            avatarUrl
            nameEng
            gender
          }
        }
      }
    }
  }
`

export const LIKE_POST = gql`
  mutation LikePost($param: PostLikeInput!) {
    likePost(param: $param)
  }
`

export const UNLIKE_POST = gql`
  mutation UnlikePost($param: PostLikeInput!) {
    unlikePost(param: $param)
  }
`

export const CREATE_COMMENT = gql`
  mutation CreateComment($param: NewComment!) {
    createComment(param: $param) {
      id
      content
      createdAt
      updatedAt
      likes
      user {
        id
        username
        profile {
          avatarUrl
          nameEng
          gender
        }
      }
    }
  }
`
