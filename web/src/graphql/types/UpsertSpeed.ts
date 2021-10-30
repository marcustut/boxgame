/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UpsertSpeedInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: UpsertSpeed
// ====================================================

export interface UpsertSpeed_upsertSpeed {
  __typename: "Speed";
  id: string;
  completedAt: TheBox.Time | null;
  answer: string | null;
  createdAt: TheBox.Time;
  updatedAt: TheBox.Time;
}

export interface UpsertSpeed {
  upsertSpeed: UpsertSpeed_upsertSpeed | null;
}

export interface UpsertSpeedVariables {
  param: UpsertSpeedInput;
}
