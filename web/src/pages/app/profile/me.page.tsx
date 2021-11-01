import React from 'react'

import { CheckAuth } from '@/components/Misc'
import { Me } from '@/features/profile'

const ProfilePage: React.FC = () => (
  <CheckAuth>
    <Me />
  </CheckAuth>
)

export default ProfilePage
