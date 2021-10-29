import { Icon } from '@iconify/react'
import Dayjs from 'dayjs'
import RelativeTime from 'dayjs/plugin/relativeTime'
import { useSnackbar } from 'notistack'
import React from 'react'

import { Button, Spinner } from '@/components/Elements'
import { useAcceptInvitation, useRejectInvitation } from '@/features/team'
import { GetInvitationsWithUserId_invitations } from '@/graphql/types/GetInvitationsWithUserId'

Dayjs.extend(RelativeTime)

type InvitationListProps = {
  invitations: GetInvitationsWithUserId_invitations[] | undefined
}

export const InvitationList: React.FC<InvitationListProps> = ({ invitations }) => {
  const { enqueueSnackbar } = useSnackbar()
  const { acceptInvitation } = useAcceptInvitation()
  const { rejectInvitation } = useRejectInvitation()

  if (!invitations) return <Spinner className='text-secondary' />

  return (
    <>
      {invitations.length > 0 ? (
        invitations.map(({ id, from, team, createdAt }) => (
          <div key={id} className='bg-dark-200 px-3 py-2 rounded-lg w-full flex items-center'>
            <img
              src={
                team.avatarUrl ? team.avatarUrl : `https://ui-avatars.com/api/?name=${encodeURIComponent(team.name!)}`
              }
              alt={`${team.name}'s avatar'`}
              className='w-10 h-10 rounded-lg'
            />
            <div className='flex flex-col ml-3'>
              <span className='font-medium'>{team.name}</span>
              <span className='text-xs text-true-gray-400'>
                invited by @{from?.username} ({Dayjs(createdAt).fromNow(true)})
              </span>
            </div>
            <div className='ml-auto flex items-center'>
              <Button
                className='px-3 py-3'
                onClick={async () => {
                  const { data, errors } = await acceptInvitation(id)
                  if (errors || !data || !data.acceptInvitation) {
                    enqueueSnackbar('Unable to accept invitation', { variant: 'error' })
                    console.error(errors)
                    return
                  }

                  enqueueSnackbar('Accepted the invitation', { variant: 'success' })
                }}
              >
                <Icon icon='mdi:check-bold' />
              </Button>
              <Button
                className='ml-2 px-3 py-3'
                color='secondary'
                onClick={async () => {
                  const { data, errors } = await rejectInvitation(id)
                  if (errors || !data || !data.rejectInvitation) {
                    enqueueSnackbar('Unable to reject invitation', { variant: 'error' })
                    console.error(errors)
                    return
                  }

                  enqueueSnackbar('Rejected the invitation', { variant: 'success' })
                }}
              >
                <Icon icon='mdi:cancel' />
              </Button>
            </div>
          </div>
        ))
      ) : (
        <span className='text-true-gray-500 flex items-center font-medium'>
          <Icon icon='uil:envelope-exclamation' className='w-5 h-5 mr-1.5' />
          no team invites
        </span>
      )}
    </>
  )
}
