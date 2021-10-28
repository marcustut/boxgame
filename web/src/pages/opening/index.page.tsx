import React from 'react'

import { CheckAuth } from '@/components/Misc'
import { Opening } from '@/features/opening'

const OpeningPage: React.FC = () => {
  return (
    <CheckAuth>
      <Opening />
    </CheckAuth>
  )
}

export default OpeningPage
