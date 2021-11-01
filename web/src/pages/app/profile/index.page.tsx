import React from 'react'
import { useEffectOnce } from 'react-use'

import { LoadingPage } from '@/components/Misc'

const ProfileIndex: React.FC = () => {
  useEffectOnce(() => {
    if (window) window.location.href = `${window.location.pathname}/me`
  })

  return <LoadingPage />
}

export default ProfileIndex
