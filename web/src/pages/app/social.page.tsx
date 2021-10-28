import React from 'react'

import { CheckAuth } from '@/components/Misc'
import { Social } from '@/features/social'

const SocialPage: React.FC = () => (
  <CheckAuth>
    <Social />
  </CheckAuth>
)

export default SocialPage
