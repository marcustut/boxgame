import React, { useEffect, useState } from 'react'
import { useEffectOnce } from 'react-use'

import { Spinner } from '@/components/Elements'
import { Layout, RegistrationForm } from '@/features/register'
import { useRiddle } from '@/hooks/stores'

// TODO: Solve SSR error (extra attributes style at Spinner comopnent)
export const Register: React.FC = () => {
  const { timeUsed, completed } = useRiddle()
  const [mounted, setMounted] = useState(false)

  useEffectOnce(() => setMounted(true))

  useEffect(() => {
    if (!timeUsed && !completed) window.location.href = '/register/riddle'
  }, [timeUsed, completed])

  return (
    <Layout
      helmetProps={{ title: 'Register' }}
      style={{
        paddingTop: '4rem',
        paddingBottom: '4rem',
        paddingLeft: '1rem',
        paddingRight: '1rem'
      }}
    >
      {!mounted ? <Spinner className='h-8 w-8 text-secondary' /> : <RegistrationForm />}
    </Layout>
  )
}
