import { Transition, Dialog } from '@headlessui/react'
import { Icon } from '@iconify/react'
import { Formik, Form } from 'formik'
import { useSnackbar } from 'notistack'
import React, { Fragment } from 'react'
import * as Yup from 'yup'

import { Button, InputField } from '@/components/Elements'
import { sleep } from '@/utils/sleep'

const missionOneSchema = Yup.object({
  answer: Yup.string()
    .required('Answer cannot be empty')
    .matches(/^[0-9]+$/, 'Must be only digits')
})

type MissionOneDialogProps = {
  open: boolean
  onClose: () => void
}

export const MissionOneDialog: React.FC<MissionOneDialogProps> = ({ open, onClose }) => {
  const { enqueueSnackbar } = useSnackbar()

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
              initialValues={{ answer: '' }}
              validationSchema={missionOneSchema}
              validateOnBlur={false}
              onSubmit={async ({ answer }) => {
                enqueueSnackbar('Successfully submitted', { variant: 'success' })
                await sleep(500)
                onClose()
              }}
            >
              {({ isSubmitting, values }) => (
                <Form className='w-full'>
                  <div className='flex justify-center items-center mb-4 font-bold w-full'>
                    Mission 1
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
                      name='answer'
                      placeholder='Enter your answer here...'
                      inputClassName='bg-dark-300 text-true-gray-50 text-sm py-3 focus:ring-primary-ring focus:border-transparent border-transparent'
                    />
                  </div>

                  <Button
                    type='submit'
                    loading={isSubmitting}
                    disabled={values.answer === '' || isSubmitting}
                    className='w-full mt-4 py-1.5 font-medium text-sm rounded-[4px]'
                  >
                    Submit
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
