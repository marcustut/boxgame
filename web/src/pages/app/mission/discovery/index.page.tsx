import React from 'react'

import { CheckAuth } from '@/components/Misc'
import { Discovery } from '@/features/discovery'

const DiscoveryPage: React.FC = () => (
  <CheckAuth>
    <Discovery />
  </CheckAuth>
)

export default DiscoveryPage
