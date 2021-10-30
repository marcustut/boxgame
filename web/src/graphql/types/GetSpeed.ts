/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetSpeed
// ====================================================

export interface GetSpeed_speed {
  __typename: "Speed";
  id: string;
  completedAt: TheBox.Time | null;
  answer: string | null;
  createdAt: TheBox.Time;
  updatedAt: TheBox.Time;
}

export interface GetSpeed {
  speed: GetSpeed_speed | null;
}

export interface GetSpeedVariables {
  team_id: string;
}
