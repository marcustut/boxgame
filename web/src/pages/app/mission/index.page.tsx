import React from 'react'

import { CheckAuth, LockPage } from '@/components/Misc'
import { Mission } from '@/features/mission'

export const MissionPage: React.FC = () => (
  <CheckAuth>
    <LockPage>
      <Mission />
    </LockPage>
  </CheckAuth>
)

export default MissionPage
