/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UpdateUserInput, Role, PastoralStatus, Gender, Satellite } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateUser
// ====================================================

export interface UpdateUser_updateUser_profile_address {
  __typename: "Address";
  id: string;
  city: string;
  line1: string;
  line2: string | null;
  state: string;
  country: string;
  postalCode: string;
}

export interface UpdateUser_updateUser_profile {
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
  address: UpdateUser_updateUser_profile_address | null;
  invitedBy: string | null;
}

export interface UpdateUser_updateUser_team_cluster {
  __typename: "Cluster";
  id: string;
  name: string;
  color: string;
}

export interface UpdateUser_updateUser_team {
  __typename: "Team";
  id: string;
  name: string | null;
  avatarUrl: string | null;
  points: number;
  cluster: UpdateUser_updateUser_team_cluster | null;
}

export interface UpdateUser_updateUser {
  __typename: "User";
  id: string;
  username: string;
  email: string;
  createdAt: TheBox.Time;
  updatedAt: TheBox.Time;
  roles: Role[];
  profile: UpdateUser_updateUser_profile | null;
  team: UpdateUser_updateUser_team | null;
}

export interface UpdateUser {
  updateUser: UpdateUser_updateUser | null;
}

export interface UpdateUserVariables {
  user_id: string;
  param: UpdateUserInput;
}
