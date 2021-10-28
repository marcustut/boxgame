import { Icon } from '@iconify/react'
import React from 'react'

import { Spinner } from '@/components/Elements'
import { GetInvitationsWithUserId_invitations } from '@/graphql/types/GetInvitationsWithUserId'

type InvitationListProps = {
  invitations: GetInvitationsWithUserId_invitations[] | undefined
}

export const InvitationList: React.FC<InvitationListProps> = ({ invitations }) => {
  if (!invitations) return <Spinner className='text-secondary' />

  return (
    <>
      {invitations.length > 0 ? (
        invitations.map(({ id }) => <div key={id}>{}</div>)
      ) : (
        <span className='text-true-gray-500 flex items-center font-medium'>
          <Icon icon='uil:envelope-exclamation' className='w-5 h-5 mr-1.5' />
          no team invites
        </span>
      )}
    </>
  )
}
