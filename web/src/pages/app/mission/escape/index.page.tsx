import React from 'react'

import { CheckAuth } from '@/components/Misc'
import { Escape } from '@/features/escape'

const EscapePage: React.FC = () => (
  <CheckAuth>
    <Escape />
  </CheckAuth>
)

export default EscapePage
