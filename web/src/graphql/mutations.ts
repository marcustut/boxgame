import { gql } from '@apollo/client'

import {
  CORE_COMMENT_FIELDS,
  CORE_POST_FIELDS,
  CORE_PROFILE_FIELDS,
  CORE_TEAM_FIELDS,
  CORE_USER_FIELDS
} from './fragments'

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

export const ACCEPT_INVITATION = gql`
  mutation AcceptInvitation($invitation_id: ID!) {
    acceptInvitation(invitation_id: $invitation_id)
  }
`

export const REJECT_INVITATION = gql`
  mutation RejectInvitation($invitation_id: ID!) {
    rejectInvitation(invitation_id: $invitation_id)
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

export const UPDATE_TEAM = gql`
  ${CORE_TEAM_FIELDS}
  mutation UpdateTeam($team_id: ID!, $param: UpdateTeamInput!) {
    updateTeam(team_id: $team_id, param: $param) {
      ...CoreTeamFields
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

export const UPSERT_ESCAPE = gql`
  mutation UpsertEscape($param: UpsertEscapeInput!) {
    upsertEscape(param: $param) {
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

export const UPSERT_SPEED = gql`
  mutation UpsertSpeed($param: UpsertSpeedInput!) {
    upsertSpeed(param: $param) {
      id
      completedAt
      answer
      createdAt
      updatedAt
    }
  }
`

export const UPSERT_HUMANITY = gql`
  mutation UpsertHumanity($param: UpsertHumanityInput!) {
    upsertHumanity(param: $param) {
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

export const UPSERT_DISCOVERY = gql`
  mutation UpsertDiscovery($param: UpsertDiscoveryInput!) {
    upsertDiscovery(param: $param) {
      id
      videoUrl
      submittedAt
      createdAt
      updatedAt
    }
  }
`

export const CREATE_BATTLEGROUND_ROOM = gql`
  mutation CreateBattlegroundRoom($param: NewBattlegroundRoom!) {
    createBattlegroundRoom(param: $param) {
      code
      teamIds
      createdAt
      updatedAt
      status
    }
  }
`

export const UPDATE_BATTLEGROUND_ROOM = gql`
  mutation UpdateBattlegroundRoom($code: String!, $param: UpdateBattlegroundRoomInput!) {
    updateBattlegroundRoom(code: $code, param: $param) {
      code
      teamIds
      createdAt
      updatedAt
      status
    }
  }
`
