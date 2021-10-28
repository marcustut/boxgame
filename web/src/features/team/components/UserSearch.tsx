import React, { useState } from 'react'

import { Avatar, Spinner } from '@/components/Elements'
import { ConfirmInviteDialog } from '@/features/team'
import { GetUser_user } from '@/graphql/types/GetUser'
import { GetUsers_users } from '@/graphql/types/GetUsers'
import { useAuth } from '@/lib/auth'

type UserSearchProps = {
  users: GetUsers_users[]
  searchText: string
}

export const UserSearch: React.FC<UserSearchProps> = ({ users, searchText }) => {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false)
  const [selectedUser, setSelectedUser] = useState<GetUser_user>()
  const { user } = useAuth()

  if (!user || !user.user.team) return <Spinner className='text-secondary' />

  return (
    <>
      <div className='py-4 rounded-lg flex flex-col'>
        {users
          .filter(
            u =>
              // u.username !== user.user.username &&
              u.username.toLowerCase().includes(searchText) ||
              u.profile?.nameEng.toLowerCase().includes(searchText) ||
              u.email.toLowerCase().includes(searchText)
          )
          .map((user, index) => (
            <button
              key={user.id}
              data-blobity-magnetic='false'
              className={`w-full bg-dark-200 hover:bg-dark-100 text-true-gray-100 px-3 py-2 rounded-lg flex items-center ${
                index !== 0 ? 'mt-2' : ''
              }`}
              onClick={() => {
                setDialogOpen(true)
                setSelectedUser(user)
              }}
            >
              {user.profile ? (
                <>
                  <Avatar
                    src={user.profile?.avatarUrl}
                    name={user.profile?.nameEng}
                    gender={user.profile?.gender}
                    utilities={{ w: 'w-8', h: 'h-8', p: 'p-0.5', m: 'mr-2' }}
                  />
                  <div className='flex flex-col items-start'>
                    <span>{user.profile.nameEng}</span>
                    <span className='text-xs text-true-gray-400'>@{user.username}</span>
                  </div>
                </>
              ) : (
                <Spinner className='text-secondary' />
              )}
            </button>
          ))}
      </div>

      {selectedUser && (
        <ConfirmInviteDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          user={user.user}
          to={selectedUser}
          teamId={user.user.team.id}
        />
      )}
    </>
  )
}
