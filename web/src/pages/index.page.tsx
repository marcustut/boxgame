import React, { useState } from 'react'
import { useEffectOnce } from 'react-use'

import { Button } from '@/components/Elements'
import { LoadingPage } from '@/components/Misc'
import { useAuth } from '@/lib/auth'
import { sleep } from '@/utils/sleep'

const LandingPage: React.FC = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState<boolean>(true)

  useEffectOnce(() => {
    ;(async () => {
      await sleep(500)
      setLoading(false)
    })()
  })

  return (
    <>
      {loading ? (
        <LoadingPage />
      ) : (
        <div className='h-[100vh] flex flex-col justify-center items-center'>
          <img src='/TheBoxColoredLogo.png' alt='TheBoxColoredLogo' className='w-40' />
          <span className='text-true-gray-400 text-sm font-medium mb-4'>
            {user ? 'You are logged in' : 'You are not logged in'}
          </span>
          <Button
            size='small'
            className='px-3 py-2 text-xs'
            onClick={() => {
              if (user) window.location.href = '/app'
              else window.location.href = '/login'
            }}
          >
            Go to {user ? 'App' : 'Login'}
          </Button>
        </div>
      )}
    </>
  )
}

export default LandingPage
