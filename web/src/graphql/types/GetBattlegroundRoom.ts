/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { RoomStatus } from "./globalTypes";

// ====================================================
// GraphQL query operation: GetBattlegroundRoom
// ====================================================

export interface GetBattlegroundRoom_battlegroundRoom {
  __typename: "BattlegroundRoom";
  code: string;
  teamIds: string[];
  status: RoomStatus;
  createdAt: TheBox.Time;
  updatedAt: TheBox.Time;
}

export interface GetBattlegroundRoom {
  battlegroundRoom: GetBattlegroundRoom_battlegroundRoom;
}

export interface GetBattlegroundRoomVariables {
  code: string;
}
