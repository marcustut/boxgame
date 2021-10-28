import React from 'react'

import { CheckAuth } from '@/components/Misc'
import { Profile } from '@/features/profile'

const ProfilePage: React.FC = () => (
  <CheckAuth>
    <Profile />
  </CheckAuth>
)

export default ProfilePage
