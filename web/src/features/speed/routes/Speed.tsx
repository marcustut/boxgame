import React, { useState } from 'react'
import { useEffectOnce } from 'react-use'

import { LoadingPage } from '@/components/Misc'
import { MissionLayout } from '@/features/mission'
import { useAuth } from '@/lib/auth'

export const Speed: React.FC = () => {
  const [mounted, setMounted] = useState<boolean>(false)
  const { user } = useAuth()

  useEffectOnce(() => setMounted(true))

  if (!user || !mounted) return <LoadingPage />

  return <MissionLayout isHall>Speed</MissionLayout>
}
