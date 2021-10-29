import { Icon } from '@iconify/react'
import Dayjs from 'dayjs'
import RelativeTime from 'dayjs/plugin/relativeTime'
import { useSnackbar } from 'notistack'
import React from 'react'
import { useEffectOnce } from 'react-use'

import { AppLayout, Spinner } from '@/components/Elements'
import { LoadingPage } from '@/components/Misc'
import { useFetchMissions } from '@/features/mission'
import { useAuth } from '@/lib/auth'

const imageBG: Record<string, string> = {
  '绝地逃离 Mystery Escape': 'https://www.ginx.tv/uploads2/Various/The_Outlast_Trials/The_Outlast_Trials.jpg',
  '极速对决 Time Hunter':
    'https://vfqzgsbgmlvglbygosna.supabase.in/storage/v1/object/public/assets/TimeHunterWallpaper.jpg'
}

Dayjs.extend(RelativeTime)

export const Mission: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar()
  const { user } = useAuth()
  const { missions, fetchMissions } = useFetchMissions({ first: 5 })

  useEffectOnce(() => {
    fetchMissions().then(() => console.log('fetched 5 missions'))
  })

  if (!user) return <LoadingPage />

  return (
    <AppLayout>
      {import.meta.env.DEV && (
        <p className='text-true-gray-500'>all missions are available because in DEV enviroment</p>
      )}
      <div className='mb-8'>
        <h1 className='text-xl font-bold'>Welcome to the Mission Board!</h1>
      </div>
      {missions && missions.data ? (
        <>
          {missions.data.missions.map((mission, index) => {
            const isOngoing = Dayjs(mission.startAt).isBefore(Dayjs()) && Dayjs(Dayjs()).isBefore(mission.endAt)
            const message = Dayjs(mission.endAt).isBefore(Dayjs())
              ? `Closed ${Dayjs(mission.startAt).fromNow()}`
              : `Opening ${Dayjs(mission.startAt).fromNow()}`
            return (
              <button
                key={mission.id}
                data-blobity-magnetic='false'
                data-blobity-tooltip={!isOngoing ? message : undefined}
                className={`relative w-full flex items-center px-4 py-3 ${
                  index !== 0 ? 'mt-6' : ''
                } rounded-lg border border-dark-100 bg-dark-300 focus:ring-2 ${
                  isOngoing ? 'focus:ring-primary-ring' : 'focus:ring-secondary-ring'
                } transition ease-in-out duration-200`}
                style={{
                  background: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${imageBG[mission.title]})`,
                  backgroundPosition: 'center',
                  backgroundSize: 'cover',
                  backgroundRepeat: 'no-repeat'
                }}
                onClick={() =>
                  isOngoing
                    ? (window.location.href = `${window.location.pathname}/${mission.slug}`)
                    : enqueueSnackbar(message, { variant: 'error' })
                }
              >
                <div
                  className={`absolute -top-2 right-4 rounded-full ${
                    isOngoing ? 'bg-primary' : 'bg-secondary'
                  } px-2 py-1 text-xs font-medium`}
                >
                  {isOngoing ? 'Available' : 'Closed'}
                </div>
                <div className='flex flex-col items-start'>
                  <span className='text-true-gray-100 font-bold'>{mission.title}</span>
                  <span className='text-true-gray-400 text-sm font-medium'>{mission.description}</span>
                </div>
                <Icon icon='ic:outline-chevron-right' className='w-6 h-6 ml-auto text-true-gray-50 -mr-2' />
              </button>
            )
          })}
        </>
      ) : (
        <Spinner className='text-secondary mx-auto mt-4' />
      )}
    </AppLayout>
  )
}
