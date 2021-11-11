/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UpdateBattlegroundRoomInput, RoomStatus } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateBattlegroundRoom
// ====================================================

export interface UpdateBattlegroundRoom_updateBattlegroundRoom {
  __typename: "BattlegroundRoom";
  code: string;
  teamIds: string[];
  createdAt: TheBox.Time;
  updatedAt: TheBox.Time;
  status: RoomStatus;
}

export interface UpdateBattlegroundRoom {
  updateBattlegroundRoom: UpdateBattlegroundRoom_updateBattlegroundRoom | null;
}

export interface UpdateBattlegroundRoomVariables {
  code: string;
  param: UpdateBattlegroundRoomInput;
}
