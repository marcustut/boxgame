import { useMutation } from '@apollo/client'
import { Icon } from '@iconify/react'
import { useSnackbar } from 'notistack'
import React, { useRef, useState } from 'react'

import { AppLayout, Avatar } from '@/components/Elements'
import { LoadingPage } from '@/components/Misc'
import { Gender, UPDATE_USER } from '@/graphql'
import { UpdateUser, UpdateUserVariables } from '@/graphql/types/UpdateUser'
import { useAuth } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

export const Me: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar()
  const { user, refetch } = useAuth()
  const [uploading, setUploading] = useState<boolean>(false)
  const uploadRef = useRef<HTMLInputElement>(null)
  const [updateUser] = useMutation<UpdateUser, UpdateUserVariables>(UPDATE_USER)

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

          <input
            type='file'
            ref={uploadRef}
            accept='image/png, image/jpeg'
            className='hidden'
            onChange={async event => {
              if (event.target.files && event.target.files.length !== 0) {
                setUploading(true)
                const { error: uploadErr } = await supabase.storage
                  .from('users')
                  .upload(`${user.user.id}/${event.target.files[0].name}`, event.target.files[0], {
                    cacheControl: '3600',
                    upsert: true
                  })
                if (uploadErr) {
                  console.error(uploadErr)
                  enqueueSnackbar('Unable to upload your avatar', { variant: 'error' })
                  return
                }
                const { publicURL, error: getURLErr } = supabase.storage
                  .from('users')
                  .getPublicUrl(`${user.user.id}/${event.target.files[0].name}`)
                if (getURLErr) {
                  console.error(getURLErr)
                  enqueueSnackbar('Unable to fetch your avatar', { variant: 'error' })
                  return
                }
                const { data, errors } = await updateUser({
                  variables: { user_id: user.user.id, param: { profile: { avatarUrl: publicURL } } }
                })
                if (errors || !data) {
                  console.error(errors)
                  enqueueSnackbar('Unable to update your avatar', { variant: 'error' })
                  return
                }
                event.target.value = ''
                setUploading(false)
                refetch()
              }
            }}
          />

          <Avatar
            src={user.user.profile.avatarUrl}
            name={user.user.profile.nameEng}
            gender={user.user.profile.gender}
            upload
            uploadRender={onClick => {
              return (
                <button
                  data-blobity-tooltip='Upload your avatar'
                  data-blobity-magnetic='false'
                  className='bg-dark-200 rounded-full p-1.5 absolute right-0 bottom-0 shadow-sm hover:bg-dark-100 focus:outline-none transition duration-200 ease-in-out focus:ring-2 focus:ring-primary-ring'
                  onClick={onClick}
                >
                  {uploading ? (
                    <Icon icon='eos-icons:loading' className='text-secondary' />
                  ) : (
                    <Icon icon='mdi:camera' className='text-true-gray-400' />
                  )}
                </button>
              )
            }}
            uploadOnClick={() => uploadRef && uploadRef.current?.click()}
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
