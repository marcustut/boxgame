import React from 'react'

import { GetUser_user_team } from '@/graphql/types/GetUser'

type TeamDetailProps = {
  team: GetUser_user_team
}

export const TeamDetail: React.FC<TeamDetailProps> = ({ team }) => {
  return <span className='font-medium text-true-gray-500'>coming soon!</span>
}
