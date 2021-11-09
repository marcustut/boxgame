import { gql } from '@apollo/client'

import {
  CORE_COMMENT_FIELDS,
  CORE_MISSION_FIELDS,
  CORE_POST_FIELDS,
  CORE_PROFILE_FIELDS,
  CORE_TEAM_FIELDS,
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
  ${CORE_TEAM_FIELDS}
  query GetUser($user_id: ID!) {
    user(user_id: $user_id) {
      ...CoreUserFields
      profile {
        ...CoreProfileFields
      }
      team {
        ...CoreTeamFields
      }
    }
  }
`

export const GET_USERS = gql`
  ${CORE_USER_FIELDS}
  ${CORE_PROFILE_FIELDS}
  ${CORE_TEAM_FIELDS}
  query GetUsers($page: PaginationInput!) {
    users(page: $page) {
      ...CoreUserFields
      profile {
        ...CoreProfileFields
      }
      team {
        ...CoreTeamFields
      }
    }
  }
`

export const GET_TEAM = gql`
  ${CORE_USER_FIELDS}
  ${CORE_TEAM_FIELDS}
  query GetTeam($team_id: ID!) {
    team(team_id: $team_id) {
      ...CoreTeamFields
      members {
        ...CoreUserFields
        profile {
          nameEng
          avatarUrl
          gender
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

export const GET_MISSION = gql`
  ${CORE_MISSION_FIELDS}
  query GetMission($mission_id: ID!) {
    mission(mission_id: $mission_id) {
      ...CoreMissionFields
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
  ${CORE_TEAM_FIELDS}
  query GetMissionsWithCompletedBy($page: PaginationInput!) {
    missions(page: $page) {
      ...CoreMissionFields
      completedBy {
        ...CoreTeamFields
      }
    }
  }
`

export const GET_INVITATIONS_WITH_USER_ID = gql`
  ${CORE_USER_FIELDS}
  ${CORE_TEAM_FIELDS}
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
        ...CoreTeamFields
      }
      createdAt
      updatedAt
    }
  }
`

export const GET_ESCAPE = gql`
  query GetEscape($team_id: ID!) {
    escape(team_id: $team_id) {
      id
      missionOne
      missionTwo
      missionThree
      team {
        id
        name
        avatarUrl
      }
    }
  }
`

export const GET_SPEED = gql`
  query GetSpeed($team_id: ID!) {
    speed(team_id: $team_id) {
      id
      completedAt
      answer
      createdAt
      updatedAt
    }
  }
`

export const GET_SPEEDS = gql`
  ${CORE_TEAM_FIELDS}
  query GetSpeeds($page: PaginationInput!) {
    speeds(page: $page) {
      id
      completedAt
      answer
      createdAt
      updatedAt
      team {
        ...CoreTeamFields
      }
    }
  }
`

export const GET_HUMANITY = gql`
  query GetHumanity($team_id: ID!) {
    humanity(team_id: $team_id) {
      id
      gatherLink
      batch
      photo1
      photo2
      photo3
      createdAt
      updatedAt
      submittedAt
    }
  }
`

export const GET_HUMANITIES = gql`
  ${CORE_TEAM_FIELDS}
  query GetHumanities($page: PaginationInput!) {
    humanities(page: $page) {
      id
      gatherLink
      batch
      photo1
      photo2
      photo3
      createdAt
      updatedAt
      submittedAt
      team {
        ...CoreTeamFields
      }
    }
  }
`
