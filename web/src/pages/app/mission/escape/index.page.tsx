import React from 'react'

import { CheckAuth, LockPage } from '@/components/Misc'
import { Escape } from '@/features/escape'

const EscapePage: React.FC = () => (
  <CheckAuth>
    <LockPage>
      <Escape />
    </LockPage>
  </CheckAuth>
)

export default EscapePage
