/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UpsertEscapeInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: UpsertEscape
// ====================================================

export interface UpsertEscape_upsertEscape_team {
  __typename: "Team";
  id: string;
  name: string | null;
  avatarUrl: string | null;
}

export interface UpsertEscape_upsertEscape {
  __typename: "Escape";
  id: string;
  missionOne: boolean;
  missionTwo: boolean;
  missionThree: number;
  team: UpsertEscape_upsertEscape_team;
}

export interface UpsertEscape {
  upsertEscape: UpsertEscape_upsertEscape | null;
}

export interface UpsertEscapeVariables {
  param: UpsertEscapeInput;
}
