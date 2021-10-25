import { Form, Formik } from 'formik'
import { useSnackbar } from 'notistack'
import React from 'react'
import * as Yup from 'yup'

import { Button, InputField } from '@/components/Elements'
import { SmokeBackground } from '@/features/login'
import { useAuth } from '@/lib/auth'

import '@/features/login/styles/styles.css'

const loginSchema = Yup.object({
  email: Yup.string().email().required(),
  password: Yup.string().required()
})

export const Login = () => {
  const { user, signIn } = useAuth()
  const { enqueueSnackbar } = useSnackbar()

  // redirect user if is logged in
  if (user) window.location.href = '/app'

  return (
<<<<<<< Updated upstream
    <SmokeBackground>
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={loginSchema}
        validateOnBlur={false}
        onSubmit={async ({ email, password }) => {
          const { data, error } = await signIn({ email, password }, { redirectTo: '/app' })
          if (error || !data) {
            enqueueSnackbar('Incorrect email or password 邮件或密码错误', { variant: 'error', autoHideDuration: 1000 })
            return
          }

          enqueueSnackbar('Redirecting you to the app...', { variant: 'success', autoHideDuration: 1000 })
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
=======
    <form onSubmit={submitHandler}>
      <div className='form-in'>
        <h1>Log In</h1>
        <div className='box'>
          <div className='user'>
            <div className='field'>
              <FaUser />
              <input className='border-0' type='text' autoComplete='off' placeholder=' ' />
              <label htmlFor='email' className='label'>
                Username/Email
              </label>
            </div>
            <div className='field'>
              <FaUnlock />
              <input type='password' autoComplete='off' placeholder=' ' />
              <label htmlFor='password' className='label'>
                Password
              </label>
>>>>>>> Stashed changes
            </div>
          </Form>
        )}
      </Formik>
    </SmokeBackground>
  )
}
