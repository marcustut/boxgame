/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

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

export enum Role {
  CLUSTERLEADER = "CLUSTERLEADER",
  CREW = "CREW",
  PLAYER = "PLAYER",
  TEAMLEADER = "TEAMLEADER",
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
