/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PaginationInput } from "./globalTypes";

// ====================================================
// GraphQL query operation: GetSpeeds
// ====================================================

export interface GetSpeeds_speeds_team_cluster {
  __typename: "Cluster";
  id: string;
  name: string;
  color: string;
}

export interface GetSpeeds_speeds_team {
  __typename: "Team";
  id: string;
  name: string | null;
  avatarUrl: string | null;
  points: number;
  cluster: GetSpeeds_speeds_team_cluster | null;
}

export interface GetSpeeds_speeds {
  __typename: "Speed";
  id: string;
  completedAt: TheBox.Time | null;
  answer: string | null;
  createdAt: TheBox.Time;
  updatedAt: TheBox.Time;
  team: GetSpeeds_speeds_team;
}

export interface GetSpeeds {
  speeds: GetSpeeds_speeds[];
}

export interface GetSpeedsVariables {
  page: PaginationInput;
}
