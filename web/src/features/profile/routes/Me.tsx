import { useMutation } from '@apollo/client'
import { Icon } from '@iconify/react'
import { useSnackbar } from 'notistack'
import React, { useRef, useState } from 'react'
import { useEffectOnce } from 'react-use'

import { AppLayout, Avatar, Button, Input } from '@/components/Elements'
import { LoadingPage } from '@/components/Misc'
import { Gender, UPDATE_USER } from '@/graphql'
import { UpdateUser, UpdateUserVariables } from '@/graphql/types/UpdateUser'
import { useAuth, UserWithAuth } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

export const Me: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar()
  const { user, refetch, updateUserCache } = useAuth()
  const [profile, setProfile] = useState<Partial<UserWithAuth['user']['profile']>>({})
  const [loading, setLoading] = useState<boolean>(false)
  const [uploading, setUploading] = useState<boolean>(false)
  const [editing, setEditing] = useState<{ bio: boolean; nameEng: boolean; nameChi: boolean }>({
    bio: false,
    nameEng: false,
    nameChi: false
  })
  const uploadRef = useRef<HTMLInputElement>(null)
  const [updateUser] = useMutation<UpdateUser, UpdateUserVariables>(UPDATE_USER)

  useEffectOnce(() => refetch())

  if (!user) return <LoadingPage />

  return (
    <AppLayout>
      {user.user.profile ? (
        <div className='flex flex-col justify-center items-center'>
          {/* <div className='-z-1 w-full h-48 rounded-md flex justify-center items-center bg-dark-300 text-true-gray-500'>
            3D Model here...
          </div> */}

          {editing.nameEng ? (
            <div className='flex items-center my-2'>
              <Input
                className='text-white focus:ring-primary focus:outline-none focus:border-0'
                defaultValue={user.user.profile.nameEng || undefined}
                placeholder='Enter your name here...'
                onChange={event => setProfile({ ...profile, nameEng: event.target.value })}
              />
              <Button
                size='small'
                color='secondary'
                loading={loading}
                className='ml-2 text-white text-xs'
                onClick={async () => {
                  if (!profile || !profile.nameEng) {
                    enqueueSnackbar('Name cannot be blank', { variant: 'error' })
                    return
                  }
                  setLoading(true)
                  const { data, errors } = await updateUser({
                    variables: { user_id: user.user.id, param: { profile: { nameEng: profile.nameEng } } }
                  })
                  if (errors || !data) {
                    console.error(errors)
                    enqueueSnackbar('Unable to update name now', { variant: 'error' })
                    return
                  }
                  user.user.profile &&
                    updateUserCache({ ...user.user, profile: { ...user.user.profile, nameEng: profile.nameEng } })
                  setEditing({ ...editing, nameEng: false })
                  setLoading(false)
                }}
              >
                Confirm
              </Button>
            </div>
          ) : (
            <h2 className='flex items-center mt-4 text-2xl font-bold'>
              <span className='mr-2'>{user.user.profile.nameEng}</span>
              <button
                data-blobity-magnetic='false'
                data-blobity-tooltip='Click me to edit your name'
                onClick={() => setEditing({ ...editing, nameEng: true })}
              >
                <Icon icon='ic:round-mode-edit' />
              </button>
            </h2>
          )}
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
                user.user.profile &&
                  updateUserCache({
                    ...user.user,
                    profile: { ...user.user.profile, avatarUrl: publicURL }
                  })
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

          <div className='relative w-3/5 <sm:w-full text-center bg-dark-300 text-true-gray-500 w-full p-4 my-4 rounded-md'>
            {!editing.bio && (
              <button
                data-blobity-magnetic='false'
                data-blobity-tooltip='Click me to edit your bio'
                className='absolute -top-3 right-4 flex px-2 py-0.5 rounded-md items-center font-medium bg-dark-100 text-true-gray-400 focus:ring-primary focus:ring-2 transition duration-200 ease-in-out'
                onClick={() => setEditing({ ...editing, bio: true })}
              >
                <Icon icon='mdi:file-document-edit-outline' className='mr-1' />
                Edit
              </button>
            )}
            {editing.bio ? (
              <div className='flex flex-col justify-center items-center'>
                <Input
                  textarea
                  rows={5}
                  className='text-white focus:ring-primary focus:outline-none focus:border-0'
                  defaultValue={user.user.profile.bio || undefined}
                  placeholder='Enter your bio here...'
                  onChange={event => setProfile({ ...profile, bio: event.target.value })}
                />
                <Button
                  size='small'
                  color='secondary'
                  loading={loading}
                  className='mt-4 text-white text-xs'
                  onClick={async () => {
                    if (!profile || !profile.bio) {
                      enqueueSnackbar('Bio cannot be blank', { variant: 'error' })
                      return
                    }
                    setLoading(true)
                    const { data, errors } = await updateUser({
                      variables: { user_id: user.user.id, param: { profile: { bio: profile.bio } } }
                    })
                    if (errors || !data) {
                      console.error(errors)
                      enqueueSnackbar('Unable to update bio now', { variant: 'error' })
                      return
                    }
                    user.user.profile &&
                      updateUserCache({ ...user.user, profile: { ...user.user.profile, bio: profile.bio } })
                    setEditing({ ...editing, bio: false })
                    setLoading(false)
                  }}
                >
                  Confirm
                </Button>
              </div>
            ) : (
              <span>{user.user.profile.bio ? user.user.profile.bio : 'no bio yet...'}</span>
            )}
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
