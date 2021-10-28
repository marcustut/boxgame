import React from 'react'

import { CheckAuth, LockPage } from '@/components/Misc'
import { Social } from '@/features/social'

const SocialPage: React.FC = () => (
  <CheckAuth>
    <LockPage>
      <Social />
    </LockPage>
  </CheckAuth>
)

export default SocialPage
