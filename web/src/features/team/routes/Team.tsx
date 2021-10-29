import { Icon } from '@iconify/react'
import React, { Fragment, useEffect, useState } from 'react'
import { useThrottle } from 'react-use'

import { AppLayout, Input, Spinner } from '@/components/Elements'
import { LoadingPage } from '@/components/Misc'
import { CreateTeamDialog, InvitationList, TeamDetail, UserSearch } from '@/features/team'
import { useFetchInvitations, useFetchUsers } from '@/features/team/hooks'
import { useAuth } from '@/lib/auth'

export const Team: React.FC = () => {
  const [createTeamDialog, setCreateTeamDialog] = useState<boolean>(false)
  const [_searchText, setSearchText] = useState<string>('')
  const searchText = useThrottle(_searchText, 500)
  const { user } = useAuth()
  const { invitations, fetchInvitations } = useFetchInvitations()
  const { users, fetchUsers } = useFetchUsers()

  useEffect(() => {
    if (!user) return
    fetchInvitations(user.user.id, { first: 5 }).then(() => console.log('fetched invitations'))
    fetchUsers({ first: 400 }).then(() => console.log('fetched 400 users'))
  }, [fetchInvitations, fetchUsers, user])

  if (!user) return <LoadingPage />

  return (
    <AppLayout>
      <h2 className='text-2xl font-bold mb-2'>{user.user.team ? user.user.team.name : 'Team Invitations'}</h2>
      <div className='bg-dark-300 min-h-24 p-4 rounded-lg flex flex-col justify-center items-center'>
        {user.user.team ? (
          <TeamDetail teamId={user.user.team.id} />
        ) : (
          <InvitationList invitations={invitations?.data.invitations} />
        )}
      </div>

      <div className='mt-4'>
        {!user.user.team ? (
          <button
            data-blobity-magnetic='false'
            className='relative w-full flex items-center px-4 py-3 rounded-lg bg-dark-300 focus:ring-2 focus:ring-secondary-ring transition ease-in-out duration-200'
            onClick={() => setCreateTeamDialog(true)}
          >
            <span className='text-true-gray-300 font-medium flex items-center'>
              Create a Team
              <Icon icon='ic:sharp-add' className='ml-1 -mt-0.5' />
            </span>
            <Icon icon='ic:outline-chevron-right' className='w-6 h-6 ml-auto text-true-gray-50 -mr-2' />
          </button>
        ) : (
          <>
            <div className='px-4 py-2 w-full flex items-center bg-dark-300 rounded-lg text-true-gray-500 focus-within:text-true-gray-100'>
              <Icon icon='bx:bx-search-alt' className='w-6 h-6' />
              <Input
                className='w-full bg-dark-300 text-true-gray-100 hover:ring-0 border-0 focus:outline-none focus:ring-0'
                type='text'
                onChange={e => setSearchText(e.target.value)}
                placeholder='Invite new teammates...'
              />
            </div>
            {searchText &&
              (users ? (
                <UserSearch users={users.data.users} searchText={searchText} />
              ) : (
                <Spinner className='mx-auto mt-4 text-secondary' />
              ))}
          </>
        )}
      </div>

      <CreateTeamDialog open={createTeamDialog} onClose={() => setCreateTeamDialog(false)} user={user} />
    </AppLayout>
  )
}
