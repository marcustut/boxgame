/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { NewBattlegroundRoom, RoomStatus } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: CreateBattlegroundRoom
// ====================================================

export interface CreateBattlegroundRoom_createBattlegroundRoom {
  __typename: "BattlegroundRoom";
  code: string;
  teamIds: string[];
  createdAt: TheBox.Time;
  updatedAt: TheBox.Time;
  status: RoomStatus;
}

export interface CreateBattlegroundRoom {
  createBattlegroundRoom: CreateBattlegroundRoom_createBattlegroundRoom | null;
}

export interface CreateBattlegroundRoomVariables {
  param: NewBattlegroundRoom;
}
