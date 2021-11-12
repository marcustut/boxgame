/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export enum BattlegroundEffect {
  ADD_100_PERCENT = "ADD_100_PERCENT",
  ADD_20_PERCENT = "ADD_20_PERCENT",
  ADD_30_PERCENT = "ADD_30_PERCENT",
  ADD_50_PERCENT = "ADD_50_PERCENT",
  ADD_90_PERCENT = "ADD_90_PERCENT",
  GIVE_100 = "GIVE_100",
  GIVE_150 = "GIVE_150",
  GIVE_200 = "GIVE_200",
  GIVE_80 = "GIVE_80",
  STEAL_100 = "STEAL_100",
  STEAL_150 = "STEAL_150",
  STEAL_200 = "STEAL_200",
  STEAL_80 = "STEAL_80",
  SUBTRACT_20_PERCENT = "SUBTRACT_20_PERCENT",
  SUBTRACT_30_PERCENT = "SUBTRACT_30_PERCENT",
  SUBTRACT_50_PERCENT = "SUBTRACT_50_PERCENT",
}

export enum BattlegroundSelection {
  KING = "KING",
  KNIGHT = "KNIGHT",
  WITCH = "WITCH",
}

export enum Gender {
  FEMALE = "FEMALE",
  MALE = "MALE",
}

export enum PastoralStatus {
  ACGL = "ACGL",
  CGL = "CGL",
  NB = "NB",
  NF = "NF",
  OM = "OM",
  PASTOR = "PASTOR",
  PCGL = "PCGL",
  SCGL = "SCGL",
}

export enum Powercard {
  BLOCK = "BLOCK",
  ONEMORECHANCE = "ONEMORECHANCE",
  REVERSE = "REVERSE",
}

export enum Role {
  CLUSTERLEADER = "CLUSTERLEADER",
  CREW = "CREW",
  PLAYER = "PLAYER",
  TEAMLEADER = "TEAMLEADER",
}

export enum RoomStatus {
  ENDED = "ENDED",
  ONGOING = "ONGOING",
  PREPARING = "PREPARING",
}

export enum Satellite {
  FGAPJ = "FGAPJ",
  FGAPUCHONG = "FGAPUCHONG",
  FGARAWANG = "FGARAWANG",
  FGASETAPAK = "FGASETAPAK",
  FGAUSJ = "FGAUSJ",
}

export interface NewAddress {
  city: string;
  line1: string;
  line2?: string | null;
  state: string;
  country: string;
  postalCode: string;
}

export interface NewBattlegroundRoom {
  teamIds: string[];
}

export interface NewComment {
  content: string;
  postId: string;
  userId: string;
}

export interface NewInvitation {
  from: string;
  to: string;
  teamId: string;
}

export interface NewPost {
  content: string;
  images: string[];
  userId: string;
}

export interface NewProfile {
  status?: PastoralStatus | null;
  gender: Gender;
  satellite?: Satellite | null;
  nameEng: string;
  nameChi?: string | null;
  contact: string;
  dob: TheBox.Time;
  tngReceiptUrl?: string | null;
  avatarUrl?: string | null;
  address?: NewAddress | null;
  invitedBy?: string | null;
}

export interface NewTeam {
  name: string;
  avatarUrl?: string | null;
  clusterId?: string | null;
}

export interface NewUser {
  id?: string | null;
  username: string;
  email: string;
  profile: NewProfile;
  roles: Role[];
  teamId?: string | null;
}

export interface PaginationInput {
  offset: number;
  limit: number;
}

export interface PostLikeInput {
  postId: string;
  userId: string;
}

export interface UpdateBattlegroundRoomInput {
  teamIds?: string[] | null;
  status?: RoomStatus | null;
}

export interface UpdateProfileInput {
  avatarUrl?: string | null;
  nameEng?: string | null;
  nameChi?: string | null;
  bio?: string | null;
}

export interface UpdateTeamInput {
  name?: string | null;
  avatarUrl?: string | null;
  points?: number | null;
  powercard?: Powercard | null;
}

export interface UpdateUserInput {
  teamId?: string | null;
  profile?: UpdateProfileInput | null;
}

export interface UpsertDiscoveryInput {
  teamId: string;
  missionId: string;
  videoUrl?: string | null;
  submittedAt?: TheBox.Time | null;
}

export interface UpsertEscapeInput {
  teamId: string;
  missionOne?: boolean | null;
  missionTwo?: boolean | null;
  missionThree?: number | null;
}

export interface UpsertHumanityInput {
  teamId: string;
  missionId: string;
  batch: number;
  gatherLink: string;
  photo1?: string | null;
  photo2?: string | null;
  photo3?: string | null;
  submittedAt?: TheBox.Time | null;
}

export interface UpsertSpeedInput {
  teamId: string;
  missionId: string;
  completedAt?: TheBox.Time | null;
  answer?: string | null;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
