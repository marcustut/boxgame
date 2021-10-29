/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PaginationInput } from "./globalTypes";

// ====================================================
// GraphQL query operation: GetMissions
// ====================================================

export interface GetMissions_missions {
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

export interface GetMissions {
  missions: GetMissions_missions[];
}

export interface GetMissionsVariables {
  page: PaginationInput;
}
