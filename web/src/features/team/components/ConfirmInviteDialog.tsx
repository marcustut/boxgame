import { Dialog, Transition } from '@headlessui/react'
import { Form, Formik } from 'formik'
import { useSnackbar } from 'notistack'
import React, { Fragment } from 'react'

import { Button } from '@/components/Elements'
import { useCreateInvitation } from '@/features/team'
import { GetUser_user } from '@/graphql/types/GetUser'

type ConfirmInviteDialogProps = {
  open: boolean
  onClose: () => void
  user: GetUser_user
  to: GetUser_user
  teamId: string
}

export const ConfirmInviteDialog: React.FC<ConfirmInviteDialogProps> = ({ open, onClose, user, to, teamId }) => {
  const { enqueueSnackbar } = useSnackbar()
  const { createInvitation } = useCreateInvitation()

  return (
    <Transition show={open} as={Fragment}>
      <Dialog onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <Dialog.Overlay className='fixed inset-0 backdrop-filter backdrop-blur-sm backdrop-brightness-90' />
        </Transition.Child>
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0 scale-95'
          enterTo='opacity-100 scale-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100 scale-100'
          leaveTo='opacity-0 scale-95'
        >
          <div className='flex flex-col justify-center items-center fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 <sm:w-4/5 w-96 px-6 py-4 bg-dark-400/90 rounded-lg shadow-2xl'>
            <div className='text-sm text-center whitespace-pre-line'>
              Are you sure you want to invite {'\n'}
              <span className='text-md font-bold'>{to.profile?.nameEng}</span> to the team?
            </div>
            <Formik
              initialValues={{ confirm: false }}
              onSubmit={async () => {
                const { data, errors } = await createInvitation({ from: user.id, to: to.id, teamId })
                if (errors || !data) {
                  enqueueSnackbar(`Unable to send invite now`, { variant: 'error' })
                  console.error(errors)
                  return
                }

                onClose()
                enqueueSnackbar(`${to.profile?.nameEng} is invited to the team`, { variant: 'success' })
              }}
            >
              {({ isSubmitting }) => (
                <Form className='flex items-center mt-4 w-full'>
                  <Button
                    type='submit'
                    loading={isSubmitting}
                    disabled={isSubmitting}
                    size='small'
                    className='w-full'
                    onClick={() => {}}
                  >
                    Yes
                  </Button>
                  <Button
                    type='button'
                    disabled={isSubmitting}
                    size='small'
                    color='secondary'
                    className='ml-2 w-full'
                    onClick={onClose}
                  >
                    No
                  </Button>
                </Form>
              )}
            </Formik>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  )
}
