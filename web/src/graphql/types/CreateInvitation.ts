/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { NewInvitation, Role } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: CreateInvitation
// ====================================================

export interface CreateInvitation_createInvitation_from {
  __typename: "User";
  id: string;
  username: string;
  email: string;
  createdAt: TheBox.Time;
  updatedAt: TheBox.Time;
  roles: Role[];
}

export interface CreateInvitation_createInvitation_user {
  __typename: "User";
  id: string;
  username: string;
  email: string;
  createdAt: TheBox.Time;
  updatedAt: TheBox.Time;
  roles: Role[];
}

export interface CreateInvitation_createInvitation_team {
  __typename: "Team";
  id: string;
  name: string | null;
  avatarUrl: string | null;
}

export interface CreateInvitation_createInvitation {
  __typename: "Invitation";
  id: string;
  from: CreateInvitation_createInvitation_from | null;
  user: CreateInvitation_createInvitation_user;
  team: CreateInvitation_createInvitation_team;
  createdAt: TheBox.Time;
  updatedAt: TheBox.Time;
}

export interface CreateInvitation {
  createInvitation: CreateInvitation_createInvitation | null;
}

export interface CreateInvitationVariables {
  param: NewInvitation;
}
