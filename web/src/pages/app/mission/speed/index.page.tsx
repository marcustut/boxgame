import React from 'react'

import { CheckAuth } from '@/components/Misc'
import { Speed } from '@/features/speed'

const SpeedPage: React.FC = () => (
  <CheckAuth>
    <Speed />
  </CheckAuth>
)

export default SpeedPage
