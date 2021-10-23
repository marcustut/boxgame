export enum Role {
  PLAYER = 'PLAYER',
  TEAMLEADER = 'TEAMLEADER',
  CLUSTERLEADER = 'CLUSTERLEADER',
  CREW = 'CREW'
}

export enum PastoralStatus {
  PASTOR = 'PASTOR',
  SCGL = 'SCGL',
  CGL = 'CGL',
  PCGL = 'PCGL',
  ACGL = 'ACGL',
  OM = 'OM',
  NB = 'NB',
  NF = 'NF'
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE'
}

export enum Satellite {
  FGASETAPAK = 'FGASETAPAK',
  FGARAWANG = 'FGARAWANG',
  FGAPUCHONG = 'FGAPUCHONG',
  FGAPJ = 'FGAPJ',
  FGAUSJ = 'FGAUSJ'
}

export type Address = {
  __typename: 'Address'
  id: string
  city: string
  line1: string
  line2: string | null
  state: string
  country: string
  postalCode: string
}

export type Profile = {
  __typename: 'Profile'
  id: string
  status: PastoralStatus | null
  gender: Gender
  satellite: Satellite | null
  nameEng: string
  nameChi: string | null
  contact: string
  dob: string
  tngReceiptUrl: string | null
  avatarUrl: string | null
  createdAt: string
  updatedAt: string
  address: Address | null
  invitedBy: string | null
}

export type Cluster = {
  __typename: 'Cluster'
  id: string
  name: string
  color: string
  teams: Team[]
}

export type Mission = {
  __typename: 'Mission'
  id: string
  title: string
  description: string | null
  points: number
  createdAt: string
  updatedAt: string
  completedBy: Team[]
}

export type Team = {
  __typename: 'Team'
  id: string
  name: string | null
  color: string
  points: number
  cluster: Cluster | null
  completed: Mission[]
  members: User[]
}

export type User = {
  __typename: 'User'
  id: string
  username: string
  email: string
  createdAt: string
  updatedAt: string
  profile: Profile | null
  team: Team | null
  roles: Role[]
}

export type Post = {
  __typename: 'Post'
  id: string
  content: string
  images: string[]
  createdAt: string
  updatedAt: string
  user: User
  likes: number
  comments: Comment[]
}

export type Comment = {
  __typename: 'Comment'
  id: string
  content: string
  createdAt: string
  updatedAt: string
  user: User
  post: Post
  likes: number
}
