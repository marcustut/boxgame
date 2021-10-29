/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PaginationInput } from "./globalTypes";

// ====================================================
// GraphQL query operation: GetMissionsWithCompletedBy
// ====================================================

export interface GetMissionsWithCompletedBy_missions_completedBy_cluster {
  __typename: "Cluster";
  id: string;
  name: string;
  color: string;
}

export interface GetMissionsWithCompletedBy_missions_completedBy {
  __typename: "Team";
  id: string;
  name: string | null;
  avatarUrl: string | null;
  points: number;
  cluster: GetMissionsWithCompletedBy_missions_completedBy_cluster | null;
}

export interface GetMissionsWithCompletedBy_missions {
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
  completedBy: GetMissionsWithCompletedBy_missions_completedBy[];
}

export interface GetMissionsWithCompletedBy {
  missions: GetMissionsWithCompletedBy_missions[];
}

export interface GetMissionsWithCompletedByVariables {
  page: PaginationInput;
}
