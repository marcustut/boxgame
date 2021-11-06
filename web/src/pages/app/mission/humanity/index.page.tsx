import React from 'react'

import { CheckAuth, LockPage } from '@/components/Misc'
import { Humanity } from '@/features/humanity'

const HumanityPage: React.FC = () => (
  <CheckAuth>
    <Humanity />
  </CheckAuth>
)

export default HumanityPage
