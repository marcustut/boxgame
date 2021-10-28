import React from 'react'

import { AppLayout } from '@/components/Elements'
import { LoadingPage } from '@/components/Misc'
import { useAuth } from '@/lib/auth'

export const Dashboard: React.FC = () => {
  const { user } = useAuth()

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
