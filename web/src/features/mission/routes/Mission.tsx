import React from 'react'
import { useEffectOnce } from 'react-use'

import { AppLayout } from '@/components/Elements'
import { LoadingPage } from '@/components/Misc'
import { useFetchMissions } from '@/features/mission'
import { useAuth } from '@/lib/auth'

export const Mission: React.FC = () => {
  const { user } = useAuth()
  const { missions, fetchMissions } = useFetchMissions({ first: 5 })

  useEffectOnce(() => {
    fetchMissions().then(() => console.log('fetched missions'))
  })

  if (!user) return <LoadingPage />

  return (
    <AppLayout>
      <h1 className='text-xl font-bold'>Welcome to the Mission Board!</h1>
      {missions && missions.data && <pre>{JSON.stringify(missions.data.missions, null, 2)}</pre>}
    </AppLayout>
  )
}
