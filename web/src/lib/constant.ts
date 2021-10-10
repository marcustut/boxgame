import type { SelectData } from '@/components/Elements'
import type { Gender, Role, Satellite } from '@/graphql'

export const genders = [
  { id: 1, name: 'Male', value: 'MALE' },
  { id: 2, name: 'Female', value: 'FEMALE' }
] as SelectData<Gender>[]

export const roles = [
  { id: 1, name: 'Player', value: 'PLAYER' },
  // { id: 2, name: 'Team Leader', value: 'TEAMLEADER' },
  // { id: 3, name: 'Cluster Leader', value: 'CLUSTERLEADER' },
  { id: 4, name: 'Crew', value: 'CREW' }
] as SelectData<Role>[]

export const satellites = [
  { id: 1, name: 'FGA Puchong', value: 'FGAPUCHONG' },
  { id: 2, name: 'FGA Setapak', value: 'FGASETAPAK' },
  { id: 3, name: 'FGA Rawang', value: 'FGARAWANG' },
  { id: 4, name: 'FGA PJ', value: 'FGAPJ' },
  { id: 5, name: 'FGA USJ', value: 'FGAUSJ' }
] as SelectData<Satellite>[]

export const states = [
  { id: 1, name: 'W.P. Kuala Lumpur', value: 'W.P. Kuala Lumpur' },
  { id: 2, name: 'W.P. Putrajaya', value: 'W.P. Putrajaya' },
  { id: 3, name: 'W.P. Labuan', value: 'W.P. Labuan' },
  { id: 4, name: 'Selangor', value: 'Selangor' },
  { id: 5, name: 'Terengganu', value: 'Terengganu' },
  { id: 6, name: 'Negeri Sembilan', value: 'Negeri Sembilan' },
  { id: 7, name: 'Perak', value: 'Perak' },
  { id: 8, name: 'Perlis', value: 'Perlis' },
  { id: 9, name: 'Penang', value: 'Penang' },
  { id: 10, name: 'Pahang', value: 'Pahang' },
  { id: 11, name: 'Malacca', value: 'Malacca' },
  { id: 12, name: 'Kelantan', value: 'Kelantan' },
  { id: 13, name: 'Kedah', value: 'Kedah' },
  { id: 14, name: 'Johor', value: 'Johor' },
  { id: 15, name: 'Sabah', value: 'Sabah' },
  { id: 16, name: 'Sarawak', value: 'Sarawak' }
] as SelectData[]

export const bulbColors = ['#ffb5c1', '#67e0c6', '#7de1ff', '#ee96ff']
