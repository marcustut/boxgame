import { Form, Formik } from 'formik'
import { useSnackbar } from 'notistack'
import React from 'react'
import * as Yup from 'yup'

import { Button, InputField } from '@/components/Elements'
import { useAuth } from '@/lib/auth'

const recoverySchema = Yup.object({
  recoveryEmail: Yup.string().email('Must be a valid email').required('Email must not be empty')
})

type RecoveryFormProps = {
  goBackOnClick: () => void
}

export const RecoveryForm: React.FC<RecoveryFormProps> = ({ goBackOnClick }) => {
  const { enqueueSnackbar } = useSnackbar()
  const { resetPassword } = useAuth()

  return (
    <Formik
      initialValues={{ recoveryEmail: '' }}
      validationSchema={recoverySchema}
      validateOnBlur={false}
      onSubmit={async ({ recoveryEmail }) => {
        const { data, error } = await resetPassword(recoveryEmail)
        if (error || !data) {
          enqueueSnackbar('Incorrect email 邮件输入错误 ', {
            variant: 'error',
            autoHideDuration: 1000
          })
          return
        }

        enqueueSnackbar('Recovery email is sent 邮件已发送', { variant: 'success', autoHideDuration: 1000 })
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <div className='form-in -mt-8 w-full absolute z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
            <img src='/TheBoxColoredLogo.png' alt='TheBoxColoredLogo' className='w-40' />
            <h2 className='font-bold text-2xl mb-4'>密码恢复</h2>
            <div className='box <sm:w-full w-96'>
              <InputField
                name='recoveryEmail'
                placeholder='Enter email here...'
                label='Email 邮件 '
                type='email'
                inputClassName='bg-dark-400 text-true-gray-50 text-sm py-3 focus:ring-primary-ring focus:border-transparent border-transparent'
              />

              <button
                type='button'
                data-blobity-magnetic='false'
                className='text-sm self-end mt-4 text-true-gray-400'
                onClick={goBackOnClick}
              >
                Go back
              </button>

              <Button
                type='submit'
                loading={isSubmitting}
                disabled={isSubmitting}
                color='secondary'
                className='w-full text-sm mt-8'
              >
                Send Recovery Email 发送邮件
              </Button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  )
}
