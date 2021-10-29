/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: CoreMissionFields
// ====================================================

export interface CoreMissionFields {
  __typename: "Mission";
  id: string;
  title: string;
  slug: string;
  description: string | null;
  points: number;
  createdAt: TheBox.Time;
  updatedAt: TheBox.Time;
  startAt: TheBox.Time;
  endAt: TheBox.Time;
}
