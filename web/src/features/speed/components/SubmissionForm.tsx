import { Icon } from '@iconify/react'
import { Form, Formik } from 'formik'
import { useSnackbar } from 'notistack'
import React from 'react'
import * as Yup from 'yup'

import { Button, InputField } from '@/components/Elements'
import { sleep } from '@/utils/sleep'

const answerSchema = Yup.object({
  we: Yup.string().required().length(2).oneOf(['we']),
  must: Yup.string().required().length(4).oneOf(['must']),
  think: Yup.string().required().length(5).oneOf(['think']),
  out: Yup.string().required().length(3).oneOf(['out']),
  of: Yup.string().required().length(2).oneOf(['of']),
  the: Yup.string().required().length(3).oneOf(['the']),
  box: Yup.string().required().length(3).oneOf(['box'])
})

type SubmissionFormProps = {
  completed: boolean
  setCompleted: (completed: boolean) => void
}

export const SubmissionForm: React.FC<SubmissionFormProps> = ({ completed, setCompleted }) => {
  const { enqueueSnackbar } = useSnackbar()

  return (
    <>
      <div className='mt-12 flex items-center text-2xl'>
        <h2 className='font-bold'>Answer Submission</h2> <Icon icon='twemoji:bookmark-tabs' className='ml-2' />
      </div>
      <div className='text-true-gray-400 mt-1'>
        After you successfully found the final message, fill in the blanks below with the message and submit! Note that
        the timer will stop after your submission, you only have one chance.
        <div className='text-xs flex items-center'>
          <Icon icon='ph:lightbulb-filament-fill' className='mr-1' />
          Don't leave after submitting, there's still one last task
        </div>
      </div>
      <Formik
        validationSchema={answerSchema}
        validateOnBlur={false}
        initialValues={{ we: '', must: '', think: '', out: '', of: '', the: '', box: '' }}
        onSubmit={async values => {
          if (completed) {
            enqueueSnackbar('You have already completed', { variant: 'info' })
            return
          }
          await sleep(500)
          setCompleted(true)
        }}
      >
        {({ isSubmitting, touched, errors }) => (
          <Form className='mt-4 bg-dark-300 p-4 rounded-lg flex flex-col items-center justify-center'>
            <div className='flex items-center justify-center'>
              <InputField noError maxLength={2} name='we' inputClassName='w-14 text-center' />
              <InputField noError maxLength={4} name='must' inputClassName='w-18 text-center ml-4' />
              <InputField noError maxLength={5} name='think' inputClassName='w-20 text-center ml-4' />
              <InputField noError maxLength={3} name='out' inputClassName='w-16 text-center ml-4' />
              <InputField noError maxLength={2} name='of' inputClassName='w-14 text-center ml-4' />
              <InputField noError maxLength={3} name='the' inputClassName='w-16 text-center ml-4' />
              <InputField noError maxLength={3} name='box' inputClassName='w-16 text-center ml-4' />
            </div>

            <Button
              type='submit'
              loading={isSubmitting}
              disabled={isSubmitting || Object.values(errors).length !== 0 || Object.values(touched).length === 0}
              size='small'
              className='mt-4 text-sm px-4 py-2'
            >
              Submit
            </Button>
          </Form>
        )}
      </Formik>
    </>
  )
}
