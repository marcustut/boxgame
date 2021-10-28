import { gql } from '@apollo/client'

import { CORE_COMMENT_FIELDS, CORE_POST_FIELDS, CORE_PROFILE_FIELDS, CORE_USER_FIELDS } from './fragments'

export const CREATE_NEW_USER = gql`
  ${CORE_USER_FIELDS}
  ${CORE_PROFILE_FIELDS}
  mutation CreateNewUser($param: NewUser!) {
    createUser(param: $param) {
      ...CoreUserFields
      profile {
        ...CoreProfileFields
      }
    }
  }
`

export const CREATE_POST = gql`
  ${CORE_POST_FIELDS}
  ${CORE_COMMENT_FIELDS}
  mutation CreatePost($param: NewPost!, $user_id: ID!, $commentsPage: PaginationInput!) {
    createPost(param: $param) {
      ...CorePostFields
      liked(user_id: $user_id)
      comments(page: $commentsPage) {
        ...CoreCommentFields
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
  ${CORE_COMMENT_FIELDS}
  mutation CreateComment($param: NewComment!) {
    createComment(param: $param) {
      ...CoreCommentFields
    }
  }
`

export const CREATE_INVITATION = gql`
  ${CORE_USER_FIELDS}
  mutation CreateInvitation($param: NewInvitation!) {
    createInvitation(param: $param) {
      id
      from {
        ...CoreUserFields
      }
      user {
        ...CoreUserFields
      }
      team {
        id
        name
        avatarUrl
      }
      createdAt
      updatedAt
    }
  }
`

export const CREATE_TEAM = gql`
  mutation CreateTeam($param: NewTeam!) {
    createTeam(param: $param) {
      id
      name
      avatarUrl
      points
    }
  }
`

export const UPDATE_USER = gql`
  ${CORE_USER_FIELDS}
  ${CORE_PROFILE_FIELDS}
  mutation UpdateUser($user_id: ID!, $param: UpdateUserInput!) {
    updateUser(user_id: $user_id, param: $param) {
      ...CoreUserFields
      profile {
        ...CoreProfileFields
      }
      team {
        id
        name
        avatarUrl
        points
        cluster {
          id
          name
          color
        }
      }
    }
  }
`
