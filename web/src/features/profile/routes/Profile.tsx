import React from 'react'
import { Icon } from '@iconify/react'

import { AppLayout } from '@/components/Elements'
import { LoadingPage } from '@/components/Misc'
import { useAuth } from '@/lib/auth'
import { Gender } from '@/graphql'

export const Profile: React.FC = () => {
  const { user } = useAuth()

  if (!user) return <LoadingPage />

  return (
    <AppLayout>
      {user.user.profile ? (
        <div className='flex flex-col justify-center items-center'>
          <div className='w-full h-48 rounded-md flex justify-center items-center bg-dark-300 text-true-gray-500'>
            3D Model here...
          </div>

          <h2 className='mt-4 text-2xl font-bold'>{user.user.profile.nameEng}</h2>
          <div className='text-true-gray-500 font-medium text-sm flex items-center'>
            {user.user.profile.nameChi} @{user.user.username}{' '}
            <Icon
              icon={user.user.profile.gender === Gender.MALE ? 'mdi:gender-male' : 'mdi:gender-female'}
              className='ml-1'
            />
          </div>

          <div className='relative'>
            <img
              src={
                user.user.profile.avatarUrl
                  ? user.user.profile.avatarUrl
                  : `https://avatars.dicebear.com/api/${user.user.profile.gender.toLowerCase()}/${
                      user.user.profile.nameEng
                    }.svg?mood[]=happy`
              }
              alt={`${user.user.profile.nameEng}'s avatar`}
              className='w-24 h-24 mt-4 p-2 rounded-full border-2 border-true-gray-500 bg-dark-200'
            />
            <button
              className='bg-dark-200 rounded-full p-1.5 absolute right-0 bottom-0 shadow-sm focus:outline-none transition duration-200 ease-in-out focus:ring-2 focus:ring-primary-ring'
              onClick={() => alert('Upload image')}
            >
              <Icon icon='mdi:camera' className='text-true-gray-400' />
            </button>
          </div>

          <div className='mt-4 flex'>
            {user.user.roles.map((role, index) => (
              <div
                key={role}
                className={`bg-dark-300 text-true-gray-400 px-3 py-1 rounded-full ${index !== 0 ? 'ml-2' : ''}`}
              >
                {role.toLowerCase()}
              </div>
            ))}
          </div>

          <p className='mt-2 text-true-gray-500 text-sm'>
            {user.user.team ? `a member of ${user.user.team.name}` : "haven't join a team yet"}
          </p>

          <div className='bg-dark-300 text-true-gray-500 w-full p-4 my-4 rounded-md'>Bio here...</div>
        </div>
      ) : (
        <p>Unable to fetch your profile</p>
      )}
      {/* <pre>{JSON.stringify(user?.user, null, 2)}</pre> */}
    </AppLayout>
  )
}
