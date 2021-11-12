/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { BattlegroundSelection, Powercard, BattlegroundEffect } from "./globalTypes";

// ====================================================
// GraphQL query operation: GetBattlegroundRound
// ====================================================

export interface GetBattlegroundRound_battlegroundRound_attacker {
  __typename: "User";
  id: string;
}

export interface GetBattlegroundRound_battlegroundRound_defender {
  __typename: "User";
  id: string;
}

export interface GetBattlegroundRound_battlegroundRound {
  __typename: "BattlegroundRound";
  code: string;
  round: number;
  attacker: GetBattlegroundRound_battlegroundRound_attacker | null;
  defender: GetBattlegroundRound_battlegroundRound_defender | null;
  attackerSelection: BattlegroundSelection | null;
  defenderSelection: BattlegroundSelection | null;
  attackerPowercard: Powercard | null;
  defenderPowercard: Powercard | null;
  effect: BattlegroundEffect | null;
  createdAt: TheBox.Time;
  updatedAt: TheBox.Time;
}

export interface GetBattlegroundRound {
  battlegroundRound: GetBattlegroundRound_battlegroundRound;
}

export interface GetBattlegroundRoundVariables {
  code: string;
  round: number;
}
