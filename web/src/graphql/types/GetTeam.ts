/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { Role, Gender } from "./globalTypes";

// ====================================================
// GraphQL query operation: GetTeam
// ====================================================

export interface GetTeam_team_cluster {
  __typename: "Cluster";
  id: string;
  name: string;
  color: string;
}

export interface GetTeam_team_members_profile {
  __typename: "Profile";
  nameEng: string;
  avatarUrl: string | null;
  gender: Gender;
}

export interface GetTeam_team_members {
  __typename: "User";
  id: string;
  username: string;
  email: string;
  createdAt: TheBox.Time;
  updatedAt: TheBox.Time;
  roles: Role[];
  profile: GetTeam_team_members_profile | null;
}

export interface GetTeam_team {
  __typename: "Team";
  id: string;
  name: string | null;
  avatarUrl: string | null;
  points: number;
  cluster: GetTeam_team_cluster | null;
  members: GetTeam_team_members[];
}

export interface GetTeam {
  team: GetTeam_team | null;
}

export interface GetTeamVariables {
  team_id: string;
}
