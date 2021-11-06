/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetHumanity
// ====================================================

export interface GetHumanity_humanity {
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

export interface GetHumanity {
  humanity: GetHumanity_humanity | null;
}

export interface GetHumanityVariables {
  team_id: string;
}
