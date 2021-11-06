/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UpsertHumanityInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: UpsertHumanity
// ====================================================

export interface UpsertHumanity_upsertHumanity {
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
}

export interface UpsertHumanity {
  upsertHumanity: UpsertHumanity_upsertHumanity | null;
}

export interface UpsertHumanityVariables {
  param: UpsertHumanityInput;
}
