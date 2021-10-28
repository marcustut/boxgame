import { Form, Formik } from 'formik'
import { useSnackbar } from 'notistack'
import React from 'react'
import * as Yup from 'yup'

import { AppLayout, Button, InputField } from '@/components/Elements'
import { supabase } from '@/lib/supabase'
import { sleep } from '@/utils/sleep'

const recoverySchema = Yup.object({
  newPassword: Yup.string().required('New password must not be empty'),
  confirmNewPassword: Yup.string()
    .required('New password must not be empty')
    .oneOf([Yup.ref('newPassword')], 'Password must match with the above')
})

export const Recovery: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar()

  return (
    <AppLayout>
      <Formik
        initialValues={{ newPassword: '', confirmNewPassword: '' }}
        validationSchema={recoverySchema}
        validateOnBlur={false}
        onSubmit={async ({ newPassword }) => {
          const session = supabase.auth.session()
          if (!session) {
            enqueueSnackbar('An error occured', { variant: 'error' })
            return
          }
          const { data, error } = await supabase.auth.api.updateUser(session.access_token, {
            password: newPassword
          })
          if (error || !data) {
            enqueueSnackbar('An error occured', { variant: 'error' })
            return
          }

          enqueueSnackbar('Your password is successfully reset, redirecting to app...', { variant: 'success' })
          await sleep(2000)

          window.location.href = '/app'
        }}
      >
        {({ isSubmitting }) => (
          <Form className='<sm:w-full w-96 mx-auto h-[80vh] flex flex-col justify-center'>
            <h2 className='text-2xl font-bold mb-2'>Reset Password</h2>
            <div className='bg-dark-300 p-4 rounded-lg'>
              <InputField
                name='newPassword'
                placeholder='Enter new password here...'
                label='New Password 新密码'
                type='password'
                inputClassName='bg-dark-200 text-true-gray-50 text-sm py-3 focus:ring-primary-ring focus:border-transparent border-transparent'
              />
              <InputField
                name='confirmNewPassword'
                placeholder='Enter password again...'
                label='Confirm Password 确认密码'
                type='password'
                className='mt-2'
                inputClassName='bg-dark-200 text-true-gray-50 text-sm py-3 focus:ring-primary-ring focus:border-transparent border-transparent'
              />
              <Button
                loading={isSubmitting}
                disabled={isSubmitting}
                className='w-full text-sm mt-4'
                size='small'
                color='secondary'
              >
                Set New Password 更新密码
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </AppLayout>
  )
}
