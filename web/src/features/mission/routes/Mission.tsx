import { Icon } from '@iconify/react'
import React from 'react'
import { useEffectOnce } from 'react-use'

import { AppLayout, Spinner } from '@/components/Elements'
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
      <div className='mb-8'>
        <h1 className='text-xl font-bold'>Welcome to the Mission Board!</h1>
      </div>
      {missions && missions.data ? (
        <>
          {missions.data.missions.map(mission => (
            <button
              key={mission.id}
              data-blobity-magnetic='false'
              className='relative w-full flex items-center px-4 py-3 rounded-lg border border-dark-100 bg-dark-300 focus:ring-2 focus:ring-secondary-ring transition ease-in-out duration-200'
              style={{
                background: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(https://www.ginx.tv/uploads2/Various/The_Outlast_Trials/The_Outlast_Trials.jpg)`,
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat'
              }}
            >
              <div className='absolute -top-2 right-4 rounded-full bg-primary px-2 py-1 text-xs font-medium'>
                Available
              </div>
              <div className='flex flex-col items-start'>
                <span className='text-true-gray-100 font-bold'>{mission.title}</span>
                <span className='text-true-gray-400 text-sm font-medium'>{mission.description}</span>
              </div>
              <Icon icon='ic:outline-chevron-right' className='w-6 h-6 ml-auto text-true-gray-50 -mr-2' />
            </button>
          ))}
        </>
      ) : (
        <Spinner className='text-secondary' />
      )}
    </AppLayout>
  )
}
