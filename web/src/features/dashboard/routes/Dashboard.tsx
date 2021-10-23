import React from 'react'
import { useEffectOnce } from 'react-use'

import { LoadingPage } from '@/components/Misc'
import { useAuth } from '@/lib/auth'
import { AppLayout } from '@/components/Elements'
import { supabase } from '@/lib/supabase'

export const Dashboard: React.FC = () => {
  const { user } = useAuth()

  // redirect to login if not authenticated
  useEffectOnce(() => {
    if (!supabase.auth.session()) window.location.href = '/login'
  })

  // show loading when fetching user
  if (!user) return <LoadingPage />

  return (
    <>
      <AppLayout>
        <h3 className='font-bold text-2xl'>Latest Social Activity</h3>
        <div>...</div>
        {/* <pre>{JSON.stringify(user, null, 2)}</pre> */}
      </AppLayout>
    </>
  )
}
