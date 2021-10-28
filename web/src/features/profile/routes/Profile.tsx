import { Icon } from '@iconify/react'
import React from 'react'

import { AppLayout, Avatar } from '@/components/Elements'
import { LoadingPage } from '@/components/Misc'
import { Gender } from '@/graphql'
import { useAuth } from '@/lib/auth'

export const Profile: React.FC = () => {
  const { user } = useAuth()

  if (!user) return <LoadingPage />

  return (
    <AppLayout>
      {user.user.profile ? (
        <div className='flex flex-col justify-center items-center'>
          {/* <div className='-z-1 w-full h-48 rounded-md flex justify-center items-center bg-dark-300 text-true-gray-500'>
            3D Model here...
          </div> */}

          <h2 className='mt-4 text-2xl font-bold'>{user.user.profile.nameEng}</h2>
          <div className='text-true-gray-500 font-medium text-sm flex items-center'>
            {user.user.profile.nameChi} @{user.user.username}{' '}
            <Icon
              icon={user.user.profile.gender === Gender.MALE ? 'mdi:gender-male' : 'mdi:gender-female'}
              className='ml-1'
            />
          </div>

          <Avatar
            src={user.user.profile.avatarUrl}
            name={user.user.profile.nameEng}
            gender={user.user.profile.gender}
            upload
            uploadOnClick={() => alert('To be continued...')}
            utilities={{ m: 'mt-4' }}
          />

          <div className='mt-4 flex'>
            {user.user.roles.map((role, index) => (
              <div
                key={role}
                data-blobity-radius='16'
                className={`bg-dark-300 text-true-gray-400 px-3 py-1 rounded-full ${index !== 0 ? 'ml-2' : ''}`}
              >
                {role.toLowerCase()}
              </div>
            ))}
          </div>

          <p className='mt-2 text-true-gray-500 text-sm'>
            {user.user.team ? `a member of ${user.user.team.name}` : "haven't join a team yet"}
          </p>

          <div className='bg-dark-300 text-true-gray-500 w-full p-4 my-4 rounded-md'>
            <span className=''>Bio here...</span>
          </div>

          <button
            data-blobity-magnetic='false'
            data-blobity-offset-x='10'
            className='mt-4 text-true-gray-500 text-sm'
            onClick={() => (window.location.href = '/app/profile/recovery')}
          >
            Looking to reset password?
          </button>
        </div>
      ) : (
        <p>Unable to fetch your profile</p>
      )}
    </AppLayout>
  )
}
