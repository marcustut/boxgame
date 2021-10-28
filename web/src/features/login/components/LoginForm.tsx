import { Formik, Form } from 'formik'
import { useSnackbar } from 'notistack'
import React from 'react'
import * as Yup from 'yup'

import { InputField, Button } from '@/components/Elements'
import { useAuth } from '@/lib/auth'

const loginSchema = Yup.object({
  email: Yup.string().email('Must be a valid email').required('Email must not be empty'),
  password: Yup.string().required('Password must not be empty')
})

type LoginFormProps = {
  forgotPasswordOnClick: () => void
}

export const LoginForm: React.FC<LoginFormProps> = ({ forgotPasswordOnClick }) => {
  const { enqueueSnackbar } = useSnackbar()
  const { signIn } = useAuth()

  return (
    <Formik
      initialValues={{ email: '', password: '' }}
      validationSchema={loginSchema}
      validateOnBlur={false}
      onSubmit={async ({ email, password }) => {
        const { data, error } = await signIn({ email, password }, { redirectTo: '/app' })
        if (error || !data) {
          enqueueSnackbar('Incorrect email or password 邮件或密码输入错误 ', {
            variant: 'error',
            autoHideDuration: 1000
          })
          return
        }

        enqueueSnackbar('Redirecting you to the app... 正在登入', { variant: 'success', autoHideDuration: 1000 })
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <div className='form-in -mt-8 w-full absolute z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
            <img src='/TheBoxColoredLogo.png' alt='TheBoxColoredLogo' className='w-40' />
            <h2 className='font-bold text-2xl mb-4'>游戏登入</h2>
            <div className='box <sm:w-full w-96'>
              <InputField
                name='email'
                placeholder='Enter email here...'
                label='Email 邮件'
                inputClassName='bg-dark-400 text-true-gray-50 text-sm py-3 focus:ring-primary-ring focus:border-transparent border-transparent'
              />
              <InputField
                name='password'
                type='password'
                placeholder='Enter password here...'
                label='Password 密码'
                className='mt-4'
                inputClassName='bg-dark-400 text-true-gray-50 text-sm py-3 focus:ring-primary-ring focus:border-transparent border-transparent'
              />

              <button
                type='button'
                data-blobity-magnetic='false'
                className='text-sm self-end mt-4 text-true-gray-400'
                onClick={forgotPasswordOnClick}
              >
                Forgot password?
              </button>

              <Button
                type='submit'
                loading={isSubmitting}
                disabled={isSubmitting}
                color='secondary'
                className='w-full text-sm mt-8'
              >
                Login 登入
              </Button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  )
}
