/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PaginationInput, Powercard } from "./globalTypes";

// ====================================================
// GraphQL query operation: GetTeamsWithoutMembers
// ====================================================

export interface GetTeamsWithoutMembers_teams_cluster {
  __typename: "Cluster";
  id: string;
  name: string;
  color: string;
}

export interface GetTeamsWithoutMembers_teams {
  __typename: "Team";
  id: string;
  name: string | null;
  avatarUrl: string | null;
  points: number;
  powercard: Powercard | null;
  eligiblePowercards: Powercard[];
  cluster: GetTeamsWithoutMembers_teams_cluster | null;
}

export interface GetTeamsWithoutMembers {
  teams: GetTeamsWithoutMembers_teams[];
}

export interface GetTeamsWithoutMembersVariables {
  page: PaginationInput;
}
