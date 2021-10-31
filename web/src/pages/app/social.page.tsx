import React from 'react'

import { CheckAuth, LoadingPage } from '@/components/Misc'
import { Social } from '@/features/social'
import { useAuth } from '@/lib/auth'

const SocialPage: React.FC = () => {
  const { user } = useAuth()

  if (!user) return <LoadingPage />

  return (
    <CheckAuth>
      <Social user={user} />
    </CheckAuth>
  )
}

export default SocialPage
