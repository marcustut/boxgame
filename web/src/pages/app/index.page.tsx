import React from 'react'

import { CheckAuth } from '@/components/Misc'
import { Dashboard } from '@/features/dashboard'

const AppPage: React.FC = () => (
  <CheckAuth>
    <Dashboard />
  </CheckAuth>
)

export default AppPage
