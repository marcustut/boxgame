import React from 'react'

import { CheckAuth } from '@/components/Misc'
import { Recovery } from '@/features/profile'

const RecoveryPage: React.FC = () => (
  <CheckAuth>
    <Recovery />
  </CheckAuth>
)

export default RecoveryPage
