/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PaginationInput, Role } from "./globalTypes";

// ====================================================
// GraphQL query operation: GetInvitationsWithUserId
// ====================================================

export interface GetInvitationsWithUserId_invitations_from {
  __typename: "User";
  id: string;
  username: string;
  email: string;
  createdAt: TheBox.Time;
  updatedAt: TheBox.Time;
  roles: Role[];
}

export interface GetInvitationsWithUserId_invitations_user {
  __typename: "User";
  id: string;
  username: string;
  email: string;
  createdAt: TheBox.Time;
  updatedAt: TheBox.Time;
  roles: Role[];
}

export interface GetInvitationsWithUserId_invitations_team {
  __typename: "Team";
  id: string;
  name: string | null;
  avatarUrl: string | null;
}

export interface GetInvitationsWithUserId_invitations {
  __typename: "Invitation";
  id: string;
  from: GetInvitationsWithUserId_invitations_from | null;
  user: GetInvitationsWithUserId_invitations_user;
  team: GetInvitationsWithUserId_invitations_team;
  createdAt: TheBox.Time;
  updatedAt: TheBox.Time;
}

export interface GetInvitationsWithUserId {
  invitations: GetInvitationsWithUserId_invitations[];
}

export interface GetInvitationsWithUserIdVariables {
  user_id: string;
  page: PaginationInput;
}
