/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PaginationInput, Powercard, Role, Gender } from "./globalTypes";

// ====================================================
// GraphQL query operation: GetTeams
// ====================================================

export interface GetTeams_teams_cluster {
  __typename: "Cluster";
  id: string;
  name: string;
  color: string;
}

export interface GetTeams_teams_members_profile {
  __typename: "Profile";
  nameEng: string;
  avatarUrl: string | null;
  gender: Gender;
}

export interface GetTeams_teams_members {
  __typename: "User";
  id: string;
  username: string;
  email: string;
  createdAt: TheBox.Time;
  updatedAt: TheBox.Time;
  roles: Role[];
  profile: GetTeams_teams_members_profile | null;
}

export interface GetTeams_teams {
  __typename: "Team";
  id: string;
  name: string | null;
  avatarUrl: string | null;
  points: number;
  powercard: Powercard | null;
  eligiblePowercards: Powercard[];
  cluster: GetTeams_teams_cluster | null;
  members: GetTeams_teams_members[];
}

export interface GetTeams {
  teams: GetTeams_teams[];
}

export interface GetTeamsVariables {
  page: PaginationInput;
}
