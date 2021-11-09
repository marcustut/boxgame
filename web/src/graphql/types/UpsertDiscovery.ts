/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UpsertDiscoveryInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: UpsertDiscovery
// ====================================================

export interface UpsertDiscovery_upsertDiscovery {
  __typename: "Discovery";
  id: string;
  videoUrl: string | null;
  submittedAt: TheBox.Time | null;
  createdAt: TheBox.Time;
  updatedAt: TheBox.Time;
}

export interface UpsertDiscovery {
  upsertDiscovery: UpsertDiscovery_upsertDiscovery | null;
}

export interface UpsertDiscoveryVariables {
  param: UpsertDiscoveryInput;
}
