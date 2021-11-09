/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetDiscovery
// ====================================================

export interface GetDiscovery_discovery {
  __typename: "Discovery";
  id: string;
  videoUrl: string | null;
  submittedAt: TheBox.Time | null;
  createdAt: TheBox.Time;
  updatedAt: TheBox.Time;
}

export interface GetDiscovery {
  discovery: GetDiscovery_discovery | null;
}

export interface GetDiscoveryVariables {
  team_id: string;
}
