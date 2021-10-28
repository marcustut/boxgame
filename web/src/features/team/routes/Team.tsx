import React from 'react'

import { AppLayout } from '@/components/Elements'
import { LoadingPage } from '@/components/Misc'
import { useAuth } from '@/lib/auth'

const invitations = [{ id: 0, from: 'marcustut', team: 'hahahaha', accepted: false }]

export const Team: React.FC = () => {
  const { user } = useAuth()

  if (!user) return <LoadingPage />

  return (
    <AppLayout>
      <h2 className='text-2xl font-bold'>Team Invitations</h2>
      <div>
        {invitations.map(invitation => (
          <div key={invitation.id}></div>
        ))}
      </div>
    </AppLayout>
  )
}
