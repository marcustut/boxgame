import React from 'react'

import { CheckAuth } from '@/components/Misc'
import { Team } from '@/features/team'

const TeamPage: React.FC = () => (
  <CheckAuth>
    <Team />
  </CheckAuth>
)

export default TeamPage
