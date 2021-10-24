/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { Role, PastoralStatus, Gender, Satellite } from "./globalTypes";

// ====================================================
// GraphQL query operation: GetUser
// ====================================================

export interface GetUser_user_profile_address {
  __typename: "Address";
  id: string;
  city: string;
  line1: string;
  line2: string | null;
  state: string;
  country: string;
  postalCode: string;
}

export interface GetUser_user_profile {
  __typename: "Profile";
  id: string;
  status: PastoralStatus | null;
  gender: Gender;
  satellite: Satellite | null;
  nameEng: string;
  nameChi: string | null;
  contact: string;
  dob: TheBox.Time;
  tngReceiptUrl: string | null;
  avatarUrl: string | null;
  createdAt: TheBox.Time;
  updatedAt: TheBox.Time;
  address: GetUser_user_profile_address | null;
  invitedBy: string | null;
}

export interface GetUser_user_team_cluster {
  __typename: "Cluster";
  id: string;
  name: string;
  color: string;
}

export interface GetUser_user_team {
  __typename: "Team";
  id: string;
  name: string | null;
  color: string;
  points: number;
  cluster: GetUser_user_team_cluster | null;
}

export interface GetUser_user {
  __typename: "User";
  id: string;
  username: string;
  email: string;
  createdAt: TheBox.Time;
  updatedAt: TheBox.Time;
  roles: Role[];
  profile: GetUser_user_profile | null;
  team: GetUser_user_team | null;
}

export interface GetUser {
  user: GetUser_user | null;
}

export interface GetUserVariables {
  user_id: string;
}
