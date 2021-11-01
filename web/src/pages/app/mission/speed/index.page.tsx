import React from 'react'

import { CheckAuth, LockPage } from '@/components/Misc'
import { Speed } from '@/features/speed'

const SpeedPage: React.FC = () => (
  <CheckAuth>
    <LockPage>
      <Speed />
    </LockPage>
  </CheckAuth>
)

export default SpeedPage
