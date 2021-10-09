import React, { useEffect, useState } from 'react'
import { Dialog } from '@headlessui/react'
import { Icon } from '@iconify/react'

import { Layout } from '@/features/register'
import { Button, Spinner } from '@/components/Elements'
import { useUser, UserState } from '@/hooks/stores'
import { Rating } from '@mui/material'
import { useEffectOnce } from 'react-use'

export const Result: React.FC = () => {
  const [mounted, setMounted] = useState<boolean>(false)
  const [dialogOpen, setDialogOpen] = useState<boolean>(false)
  const { state, user, setRating } = useUser()

  useEffectOnce(() => setMounted(true))

  useEffect(() => {
    if (state !== UserState.REGISTERED) window.location.href = '/'
  }, [state, user])

  if (!mounted)
    return (
      <Layout>
        <Spinner className='h-8 w-8 text-secondary' />
      </Layout>
    )

  return (
    <>
      <Layout style={{ padding: '2rem' }}>
        {user && (
          <div className='pt-4 pb-6 px-6 flex flex-col font-mono justify-center items-center bg-dark-300 rounded-lg'>
            <Icon icon='heroicons-solid:check-circle' className='w-42 h-42 text-primary' />
            <h2 className='text-3xl font-bold'>Congratulations!</h2>
            <p className='text-sm text-center mt-1 text-true-gray-400'>
              You have successfully registered for <b>TheBox</b>
            </p>

            <p className='text-xs text-center mt-4 text-true-gray-400'>Rate your experience with us</p>
            <Rating
              name='registration-rating'
              size='medium'
              className='mb-2'
              onChange={(_, value) => value && setRating({ registration: value })}
            />

            <Button className='mt-4 text-xs px-3 py-2' onClick={() => setDialogOpen(true)} size='small'>
              Check your submitted information
            </Button>
          </div>
        )}
      </Layout>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <Dialog.Overlay className='inset-0 transition ease-in-out duration-200 fixed backdrop-filter backdrop-blur-sm backdrop-brightness-75' />

        <div className='font-mono bg-dark-300 flex-col rounded-lg text-word-active-light p-8 transform transition top-[50%] ease-in-out left-[50%] shadow-2xl w-96 translate-x-[-50%] translate-y-[-50%] duration-200 fixed items-center ronded-2xl dark: flex dark:bg-dark-shade2 dark:text-word-active-dark'>
          {user && (
            <>
              <div className='font-bold text-xl'>Account Information</div>
              <div className='mt-2 flex flex-col self-start text-true-gray-400'>
                <p>Username: {user.username}</p>
                <p>Email: {user.email}</p>
                <p>Contact: {user.profile?.contact}</p>
                <p>Role: {user.roles}</p>
              </div>
            </>
          )}

          <Button className='mt-4 text-xs' size='small' onClick={() => setDialogOpen(false)}>
            Close
          </Button>
        </div>
      </Dialog>
    </>
  )
}
