/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetMission
// ====================================================

export interface GetMission_mission {
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

export interface GetMission {
  mission: GetMission_mission | null;
}

export interface GetMissionVariables {
  mission_id: string;
}
