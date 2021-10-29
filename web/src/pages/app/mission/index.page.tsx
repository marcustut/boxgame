import React from 'react'

import { CheckAuth } from '@/components/Misc'
import { Mission } from '@/features/mission'

export const MissionPage: React.FC = () => (
  <CheckAuth>
    <Mission />
  </CheckAuth>
)

export default MissionPage
