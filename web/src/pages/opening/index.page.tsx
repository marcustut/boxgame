import React from 'react'

import { CheckAuth, LockPage } from '@/components/Misc'
import { Opening } from '@/features/opening'

const OpeningPage: React.FC = () => {
  return (
    <CheckAuth>
      <LockPage>
        <Opening />
      </LockPage>
    </CheckAuth>
  )
}

export default OpeningPage
