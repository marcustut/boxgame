/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UpdateTeamInput, Powercard } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateTeam
// ====================================================

export interface UpdateTeam_updateTeam_cluster {
  __typename: "Cluster";
  id: string;
  name: string;
  color: string;
}

export interface UpdateTeam_updateTeam {
  __typename: "Team";
  id: string;
  name: string | null;
  avatarUrl: string | null;
  points: number;
  powercard: Powercard | null;
  eligiblePowercards: Powercard[];
  cluster: UpdateTeam_updateTeam_cluster | null;
}

export interface UpdateTeam {
  updateTeam: UpdateTeam_updateTeam | null;
}

export interface UpdateTeamVariables {
  team_id: string;
  param: UpdateTeamInput;
}
