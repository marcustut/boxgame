import React from 'react'

import { CheckAuth } from '@/components/Misc'
import { Mystery } from '@/features/escape'

export const MysteryPage: React.FC = () => (
  <CheckAuth>
    <Mystery />
  </CheckAuth>
)

export default MysteryPage
