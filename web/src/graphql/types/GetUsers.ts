/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PaginationInput, Role, PastoralStatus, Gender, Satellite } from "./globalTypes";

// ====================================================
// GraphQL query operation: GetUsers
// ====================================================

export interface GetUsers_users_profile_address {
  __typename: "Address";
  id: string;
  city: string;
  line1: string;
  line2: string | null;
  state: string;
  country: string;
  postalCode: string;
}

export interface GetUsers_users_profile {
  __typename: "Profile";
  id: string;
  status: PastoralStatus | null;
  gender: Gender;
  satellite: Satellite | null;
  nameEng: string;
  nameChi: string | null;
  contact: string;
  dob: TheBox.Time;
  bio: string | null;
  tngReceiptUrl: string | null;
  avatarUrl: string | null;
  createdAt: TheBox.Time;
  updatedAt: TheBox.Time;
  address: GetUsers_users_profile_address | null;
  invitedBy: string | null;
}

export interface GetUsers_users_team_cluster {
  __typename: "Cluster";
  id: string;
  name: string;
  color: string;
}

export interface GetUsers_users_team {
  __typename: "Team";
  id: string;
  name: string | null;
  avatarUrl: string | null;
  points: number;
  cluster: GetUsers_users_team_cluster | null;
}

export interface GetUsers_users {
  __typename: "User";
  id: string;
  username: string;
  email: string;
  createdAt: TheBox.Time;
  updatedAt: TheBox.Time;
  roles: Role[];
  profile: GetUsers_users_profile | null;
  team: GetUsers_users_team | null;
}

export interface GetUsers {
  users: GetUsers_users[];
}

export interface GetUsersVariables {
  page: PaginationInput;
}
