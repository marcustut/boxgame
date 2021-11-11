/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PaginationInput, Powercard } from "./globalTypes";

// ====================================================
// GraphQL query operation: GetHumanities
// ====================================================

export interface GetHumanities_humanities_team_cluster {
  __typename: "Cluster";
  id: string;
  name: string;
  color: string;
}

export interface GetHumanities_humanities_team {
  __typename: "Team";
  id: string;
  name: string | null;
  avatarUrl: string | null;
  points: number;
  powercard: Powercard | null;
  eligiblePowercards: Powercard[];
  cluster: GetHumanities_humanities_team_cluster | null;
}

export interface GetHumanities_humanities {
  __typename: "Humanity";
  id: string;
  gatherLink: string;
  batch: number;
  photo1: string | null;
  photo2: string | null;
  photo3: string | null;
  createdAt: TheBox.Time;
  updatedAt: TheBox.Time;
  submittedAt: TheBox.Time | null;
  team: GetHumanities_humanities_team;
}

export interface GetHumanities {
  humanities: GetHumanities_humanities[];
}

export interface GetHumanitiesVariables {
  page: PaginationInput;
}
