import { Dialog, Transition } from '@headlessui/react'
import { Icon } from '@iconify/react'
import { Form, Formik } from 'formik'
import { useSnackbar } from 'notistack'
import React, { Fragment } from 'react'
import * as Yup from 'yup'

import { Button, InputField } from '@/components/Elements'
import { useUpdateUser, useCreateTeam } from '@/features/team'
import { UserWithAuth } from '@/lib/auth'
import { sleep } from '@/utils/sleep'

const createTeamSchema = Yup.object({
  name: Yup.string().required('Team name cannot be empty'),
  avatarUrl: Yup.string().url('Must be a valid url to an image').optional()
})

type CreateTeamDialogProps = {
  open: boolean
  onClose: () => void
  user: UserWithAuth
}

export const CreateTeamDialog: React.FC<CreateTeamDialogProps> = ({ open, onClose, user }) => {
  const { enqueueSnackbar } = useSnackbar()
  const { createTeam } = useCreateTeam()
  const { updateUser } = useUpdateUser()

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
            <Formik
              initialValues={{ name: '', avatarUrl: '' }}
              validateOnBlur={false}
              validationSchema={createTeamSchema}
              onSubmit={async ({ name, avatarUrl }) => {
                const { data: team, errors: createTeamErrors } = await createTeam({ name, avatarUrl })
                if (createTeamErrors || !team || !team.createTeam) {
                  enqueueSnackbar('An error occured', { variant: 'error' })
                  console.error(createTeamErrors)
                  return
                }
                const { data: updatedUser, errors: updateUserErrors } = await updateUser(user.user.id, {
                  teamId: team.createTeam.id
                })
                if (updateUserErrors || !updatedUser) {
                  enqueueSnackbar('An error occured', { variant: 'error' })
                  console.error(updateUserErrors)
                  return
                }

                enqueueSnackbar('Successfully created the team', { variant: 'success' })
                await sleep(500)
                onClose()
              }}
            >
              {({ isSubmitting, values }) => (
                <Form className='w-full'>
                  <div className='flex justify-center items-center mb-4 font-bold w-full'>
                    Create Team
                    <button
                      type='button'
                      data-blobity-magnetic='false'
                      className='p-1 bg-dark-200 rounded-full absolute right-4 focus:outline-none'
                      onClick={onClose}
                    >
                      <Icon icon='mdi:close' />
                    </button>
                  </div>
                  <div className='mt-4 rounded-lg'>
                    <InputField
                      name='name'
                      placeholder='Enter team name here...'
                      label='Team name 队伍名字'
                      inputClassName='bg-dark-300 text-true-gray-50 text-sm py-3 focus:ring-primary-ring focus:border-transparent border-transparent'
                    />
                    <InputField
                      name='avatarUrl'
                      placeholder='Enter an image URL...'
                      label='Team avatar 队伍头像'
                      className='mt-4'
                      inputClassName='bg-dark-300 text-true-gray-50 text-sm py-3 focus:ring-primary-ring focus:border-transparent border-transparent'
                    />
                  </div>

                  <Button
                    type='submit'
                    loading={isSubmitting}
                    disabled={values.name === '' || isSubmitting}
                    className='w-full mt-4 py-1.5 font-medium text-sm rounded-[4px]'
                  >
                    Create Team
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
