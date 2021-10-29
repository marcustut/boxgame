/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: CoreTeamFields
// ====================================================

export interface CoreTeamFields_cluster {
  __typename: "Cluster";
  id: string;
  name: string;
  color: string;
}

export interface CoreTeamFields {
  __typename: "Team";
  id: string;
  name: string | null;
  avatarUrl: string | null;
  points: number;
  cluster: CoreTeamFields_cluster | null;
}
