/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetEscape
// ====================================================

export interface GetEscape_escape_team {
  __typename: "Team";
  id: string;
  name: string | null;
  avatarUrl: string | null;
}

export interface GetEscape_escape {
  __typename: "Escape";
  id: string;
  missionOne: boolean;
  missionTwo: boolean;
  missionThree: number;
  team: GetEscape_escape_team;
}

export interface GetEscape {
  escape: GetEscape_escape | null;
}

export interface GetEscapeVariables {
  team_id: string;
}
