/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PaginationInput, RoomStatus } from "./globalTypes";

// ====================================================
// GraphQL query operation: GetBattlegroundRooms
// ====================================================

export interface GetBattlegroundRooms_battlegroundRooms {
  __typename: "BattlegroundRoom";
  code: string;
  teamIds: string[];
  status: RoomStatus;
  createdAt: TheBox.Time;
  updatedAt: TheBox.Time;
}

export interface GetBattlegroundRooms {
  battlegroundRooms: GetBattlegroundRooms_battlegroundRooms[];
}

export interface GetBattlegroundRoomsVariables {
  page: PaginationInput;
}
