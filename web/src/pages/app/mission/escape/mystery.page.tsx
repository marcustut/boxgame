import React from 'react'

import { CheckAuth, LockPage } from '@/components/Misc'
import { Mystery } from '@/features/escape'

export const MysteryPage: React.FC = () => (
  <CheckAuth>
    <LockPage>
      <Mystery />
    </LockPage>
  </CheckAuth>
)

export default MysteryPage
