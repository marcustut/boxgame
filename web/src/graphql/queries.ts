import { gql } from '@apollo/client'

import {
  CORE_COMMENT_FIELDS,
  CORE_MISSION_FIELDS,
  CORE_POST_FIELDS,
  CORE_PROFILE_FIELDS,
  CORE_USER_FIELDS
} from './fragments'

export const GET_REGISTERED_USER_COUNT = gql`
  query GetUserCount {
    userCount
  }
`

export const GET_USER = gql`
  ${CORE_USER_FIELDS}
  ${CORE_PROFILE_FIELDS}
  query GetUser($user_id: ID!) {
    user(user_id: $user_id) {
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

export const GET_USERS = gql`
  ${CORE_USER_FIELDS}
  ${CORE_PROFILE_FIELDS}
  query GetUsers($page: PaginationInput!) {
    users(page: $page) {
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

export const GET_POST = gql`
  ${CORE_POST_FIELDS}
  query GetPost($post_id: ID!, $user_id: ID!) {
    post(post_id: $post_id) {
      ...CorePostFields
      liked(user_id: $user_id)
    }
  }
`

export const GET_POST_WITH_COMMENTS = gql`
  ${CORE_POST_FIELDS}
  ${CORE_COMMENT_FIELDS}
  query GetPostWithComments($post_id: ID!, $user_id: ID!, $commentsPage: PaginationInput!) {
    post(post_id: $post_id) {
      ...CorePostFields
      liked(user_id: $user_id)
      comments(page: $commentsPage) {
        ...CoreCommentFields
      }
    }
  }
`

export const GET_POSTS = gql`
  ${CORE_POST_FIELDS}
  query GetPosts($postsPage: PaginationInput!, $user_id: ID!) {
    posts(page: $postsPage) {
      ...CorePostFields
      liked(user_id: $user_id)
    }
  }
`

export const GET_POSTS_WITH_COMMENTS = gql`
  ${CORE_POST_FIELDS}
  ${CORE_COMMENT_FIELDS}
  query GetPostsWithComments($postsPage: PaginationInput!, $commentsPage: PaginationInput!, $user_id: ID!) {
    posts(page: $postsPage) {
      ...CorePostFields
      liked(user_id: $user_id)
      comments(page: $commentsPage) {
        ...CoreCommentFields
      }
    }
  }
`

export const GET_MISSIONS = gql`
  ${CORE_MISSION_FIELDS}
  query GetMissions($page: PaginationInput!) {
    missions(page: $page) {
      ...CoreMissionFields
    }
  }
`

export const GET_MISSIONS_WITH_COMPLETED_BY = gql`
  ${CORE_MISSION_FIELDS}
  query GetMissionsWithCompletedBy($page: PaginationInput!) {
    missions(page: $page) {
      ...CoreMissionFields
      completedBy {
        id
        name
        avatarUrl
        points
      }
    }
  }
`

export const GET_INVITATIONS_WITH_USER_ID = gql`
  ${CORE_USER_FIELDS}
  query GetInvitationsWithUserId($user_id: ID!, $page: PaginationInput!) {
    invitations(user_id: $user_id, page: $page) {
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
