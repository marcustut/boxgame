import React, { useEffect, useMemo, useState } from 'react'
import { useEffectOnce } from 'react-use'
import { useQuery } from '@apollo/client'

import { useRiddle } from '@/hooks/stores/useRiddle'
import { Layout, Lightbulb } from '@/features/register'
import { GET_REGISTERED_USER_COUNT, GetUserCount } from '@/graphql'
import { Button, Spinner } from '@/components/Elements'
import { supabase } from '@/lib/supabase'
import { definitions } from '@/types/supabase'
import { getRandomInts } from '@/utils'
import { bulbColors } from '@/lib/constant'

export const Riddle: React.FC = () => {
  const { timeUsed, completed } = useRiddle()
  const { loading, error, data, refetch } = useQuery<GetUserCount>(GET_REGISTERED_USER_COUNT)
  const [mounted, setMounted] = useState<boolean>(false)
  const [open, setOpen] = useState<boolean>(false)

  const wireLengths = useMemo(() => getRandomInts({ min: 200, max: 400 }, 4), [])
  const randomBulbColors = useMemo(() => bulbColors.sort(() => 0.5 - Math.random()), [])

  useEffectOnce(() => {
    setMounted(true)
    const userSubscription = supabase
      .from<definitions['User']>('User')
      .on('INSERT', () => refetch())
      .subscribe()
    return () => {
      supabase.removeSubscription(userSubscription)
    }
  })

  useEffect(() => {
    if (timeUsed && completed) window.location.href = '/register'
  }, [timeUsed, completed])

  if (!mounted)
    return (
      <Layout>
        <Spinner className='w-8 h-8 text-secondary' />
      </Layout>
    )

  return (
    <Layout applyRootStyle={false} helmetProps={{ title: 'Riddle' }}>
      <div className='h-[100vh] flex flex-col font-mono'>
        <div className='flex justify-center'>
          {Array.from(Array(4).keys()).map((v, i) => (
            <Lightbulb
              key={v}
              button
              animate
              wire
              wireLength={`${wireLengths[i]}px`}
              glow={open}
              bulbColor={randomBulbColors[i]}
              glowColor={randomBulbColors[i]}
              onClick={() => setOpen(!open)}
              style={{ marginLeft: i !== 0 ? '35px' : '' }}
            />
          ))}
        </div>
        <div className='flex flex-col mt-auto px-4 pb-4'>
          <Button className='mb-2' color='secondary'>
            Start
          </Button>
          {!loading && !error && data && data.userCount && (
            <div className='font-bold text-2xl text-secondary'>
              {data.userCount}
              <span className='text-sm text-true-gray-500'> seats remaining</span>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
