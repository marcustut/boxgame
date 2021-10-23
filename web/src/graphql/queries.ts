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

export const GET_POST = gql`
  query GetPost($post_id: ID!, $user_id: ID!) {
    post(post_id: $post_id) {
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
    }
  }
`

export const GET_POST_WITH_COMMENTS = gql`
  query GetPostWithComments($post_id: ID!, $user_id: ID!, $commentsPage: PaginationInput!) {
    post(post_id: $post_id) {
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
  }
`

export const GET_POSTS = gql`
  query GetPosts($postsPage: PaginationInput!, $user_id: ID!) {
    posts(page: $postsPage) {
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
    }
  }
`

export const GET_POSTS_WITH_COMMENTS = gql`
  query GetPostsWithComments($postsPage: PaginationInput!, $commentsPage: PaginationInput!, $user_id: ID!) {
    posts(page: $postsPage) {
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
  }
`
