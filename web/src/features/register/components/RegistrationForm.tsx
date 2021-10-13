import React from 'react'
import * as Yup from 'yup'
import { useSnackbar } from 'notistack'
import { Formik, Form } from 'formik'
import { Divider } from '@mui/material'
import { useMutation } from '@apollo/client'
import { DatePicker } from '@mui/lab'
// import { Icon } from '@iconify/react'
import { Switch } from '@headlessui/react'

import { Select, InputField, Button } from '@/components/Elements'
import { satellites, states, genders, roles } from '@/lib/constant'
import { supabase } from '@/lib/supabase'
import {
  CREATE_NEW_USER,
  Gender,
  Role,
  Satellite,
  NewUser,
  PastoralStatus,
  CreateNewUser,
  CreateNewUserVariables
} from '@/graphql'
import { useUser, UserState } from '@/hooks/stores'

type FormValues = NewUser & {
  extra: {
    password: string
    tngReceipt?: File | null
    firstTimer: boolean
    invitedBy?: string | null
    dob: Date | null
  }
}

const validationSchema = Yup.object({
  extra: Yup.object({
    password: Yup.string()
      .min(8, 'Password must have at least 8 characters')
      .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, 'Must have at least one letter and one number')
      .required('Required'),
    tngReceipt: Yup.mixed().optional(),
    firstTimer: Yup.bool().required(),
    invitedBy: Yup.string().optional(),
    dob: Yup.date().required('Required').nullable()
  }).required(),
  profile: Yup.object({
    status: Yup.mixed<PastoralStatus>().oneOf(Object.values(PastoralStatus)).optional(),
    gender: Yup.mixed<Gender>().oneOf(Object.values(Gender)).required('Required'),
    satellite: Yup.mixed<Satellite>()
      .oneOf([...Object.values(Satellite), null])
      .optional(),
    nameEng: Yup.string().max(50, 'Name must not exceed 50 characters').required('Required'),
    nameChi: Yup.string().max(50, 'Name must not exceed 50 characters').optional(),
    contact: Yup.string()
      .matches(/^(\+?6?01)[0|1|2|3|4|6|7|8|9]-*[0-9]{7,8}$/, 'Invalid malaysian phone number')
      .required('Required'),
    tngReceiptUrl: Yup.string().url().optional(),
    avatarUrl: Yup.string().url().optional(),
    address: Yup.object({
      city: Yup.string().required('Required'),
      line1: Yup.string().required('Required'),
      line2: Yup.string().optional(),
      state: Yup.string()
        .oneOf(states.map(s => s.value))
        .required('Required'),
      country: Yup.string().required('Required'),
      postalCode: Yup.string().required('Required')
    }).optional()
  }).required(),
  username: Yup.string().max(50, 'Username cannot exceed 50 characters').required('Required'),
  email: Yup.string().email().required('Required'),
  roles: Yup.array().min(1, 'You must have at least one role').required('Required')
})

export const RegistrationForm: React.FC = () => {
  const [createNewUser] = useMutation<CreateNewUser, CreateNewUserVariables>(CREATE_NEW_USER)
  const { enqueueSnackbar } = useSnackbar()
  const { setState, setUser } = useUser()

  return (
    <div className='p-4 bg-dark-200 rounded-xl sm:w-[400px] font-mono'>
      <h2 className='text-2xl text-center font-bold'>Registration Form</h2>
      <Divider sx={{ marginY: '1rem' }} />
      <Formik<FormValues>
        initialValues={{
          extra: {
            password: '',
            tngReceipt: null,
            firstTimer: false,
            invitedBy: '',
            dob: null
          },
          username: '',
          email: '',
          roles: [null] as unknown as Role[],
          profile: {
            nameEng: '',
            nameChi: '',
            dob: '',
            gender: null as unknown as Gender,
            contact: '',
            satellite: null as unknown as Satellite,
            address: {
              city: '',
              line1: '',
              line2: '',
              state: states[0].value,
              country: 'Malaysia',
              postalCode: ''
            }
          }
        }}
        validationSchema={validationSchema}
        validateOnBlur={false}
        onSubmit={async values => {
          if (!values.extra.dob) {
            enqueueSnackbar('Date of birth must be specified', { variant: 'error' })
            return
          }
          const { user, error } = await supabase.auth.signUp({
            email: values.email,
            password: values.extra.password
          })
          if (error || !user) {
            console.error(error)
            enqueueSnackbar('An error occured, try again later', { variant: 'error' })
            return
          }
          try {
            const { data, errors } = await createNewUser({
              variables: {
                param: {
                  id: user.id,
                  email: values.email,
                  username: values.username,
                  roles: values.roles,
                  profile: {
                    contact: values.profile.contact,
                    dob: values.extra.dob.toISOString(),
                    gender: values.profile.gender,
                    nameEng: values.profile.nameEng,
                    nameChi: values.profile.nameChi,
                    satellite: values.profile.satellite,
                    address: values.profile.address
                  }
                }
              }
            })
            if (errors || !data) {
              console.error(errors)
              enqueueSnackbar('An error occured, try again later', { variant: 'error' })
              return
            }
            enqueueSnackbar('You have successfully created an account!', { variant: 'success' })
            setState(UserState.REGISTERED)
            setUser(data.createUser)
            window.location.href = '/register/result'
          } catch (err) {
            console.error(err)
            enqueueSnackbar('An error occured, try again later', { variant: 'error' })
          }
        }}
      >
        {({ isSubmitting, values, setValues, errors }) => {
          const satellitePicker = (
            <Select
              value={values.profile.satellite}
              onChange={value => setValues({ ...values, profile: { ...values.profile, satellite: value } })}
              data={satellites}
            />
          )
          const address = (
            <>
              {values.profile.address && (
                <>
                  <label className='mt-4 mb-1 font-bold text-sm'>Shipping address</label>
                  <div>
                    <InputField
                      name='profile.address.country'
                      placeholder='Country'
                      value='Malaysia'
                      disabled
                      inputClassName='rounded-b-none border border-dark-300 text-true-gray-500'
                    />
                    <InputField
                      name='profile.address.line1'
                      placeholder='Address Line 1'
                      inputClassName='rounded-none border-b border-l border-r border-dark-300'
                    />
                    <InputField
                      name='profile.address.line2'
                      placeholder='Address Line 2'
                      inputClassName='rounded-none border-b border-l border-r border-dark-300'
                    />
                    <div className='flex'>
                      <InputField
                        name='profile.address.city'
                        placeholder='City'
                        inputClassName='rounded-none border-b border-l border-dark-300'
                      />
                      <InputField
                        name='profile.address.postalCode'
                        placeholder='Postal Code'
                        inputClassName='rounded-none border-b border-l border-r border-dark-300'
                      />
                    </div>
                    <Select
                      value={values.profile.address.state}
                      onChange={value =>
                        setValues({
                          ...values,
                          profile: { ...values.profile, address: { ...values.profile.address!, state: value } }
                        })
                      }
                      data={states}
                      className='rounded-t-none border-b border-l border-r border-dark-300'
                    />
                  </div>
                </>
              )}
            </>
          )
          return (
            <Form className='flex flex-col'>
              <label htmlFor='profile.nameEng' className='mb-1 font-bold text-sm'>
                Full Name
              </label>
              <div className='flex flex-row'>
                <InputField name='profile.nameEng' placeholder='English' className='mr-2' />
                <InputField name='profile.nameChi' placeholder='Chinese' />
              </div>

              <label htmlFor='username' className='mt-4 mb-1 font-bold text-sm'>
                Username
              </label>
              <InputField name='username' placeholder='Enter text here...' />

              <label htmlFor='extra.password' className='mt-4 mb-1 font-bold text-sm'>
                Password
              </label>
              <InputField
                name='extra.password'
                placeholder='Enter text here...'
                type='password'
                inputClassName='focus:ring-primary-ring focus:border-transparent border-transparent'
              />

              <label htmlFor='email' className='mt-4 mb-1 font-bold text-sm'>
                Email
              </label>
              <InputField name='email' placeholder='Enter email here...' />

              <label htmlFor='profile.gender' className='mt-4 mb-1 font-bold text-sm'>
                Gender
              </label>
              <Select<Gender>
                value={values.profile.gender}
                onChange={value => value && setValues({ ...values, profile: { ...values.profile, gender: value } })}
                data={genders}
              />

              <label htmlFor='profile.contact' className='mt-4 mb-1 font-bold text-sm'>
                Phone number
              </label>
              <InputField name='profile.contact' placeholder='Enter phone number here...' />

              <label htmlFor='extra.dob' className='mt-4 mb-1 font-bold text-sm'>
                Date of birth
              </label>
              <DatePicker
                label='Date of birth'
                value={values.extra.dob}
                onChange={value => {
                  setValues({ ...values, extra: { ...values.extra, dob: value } })
                }}
                renderInput={({ inputRef, inputProps, InputProps }) => (
                  <div className='flex items-center'>
                    <InputField
                      ref={inputRef}
                      name='extra.dob'
                      {...inputProps}
                      className='w-full'
                      inputClassName='focus:ring-primary-ring focus:border-transparent border-transparent'
                    />
                    {InputProps?.endAdornment}
                  </div>
                )}
              />

              {/* <label htmlFor='extra.tngReceipt' className='mt-4 mb-1 font-bold text-sm'>
                Payment receipt
              </label>
              {!values.extra.tngReceipt ? (
                <label className='flex flex-col justify-center items-center h-[170px] px-6 py-4 w-full bg-dark-100 rounded-lg cursor-pointer border border-dashed border-true-gray-400 hover:border-primary-hover transition duration-200 ease-in-out'>
                  <Icon icon='ion:receipt-sharp' className='w-10 h-10 text-true-gray-400' />
                  <p className='text-true-gray-400 font-medium mt-1'>Upload Touch and Go Receipt</p>
                  <p className='text-true-gray-500 font-medium text-sm text-center mt-1'>
                    Transfer only RM20 to +60163066883 and upload the screenshot here
                  </p>
                  <input
                    type='file'
                    name='tngReceipt'
                    accept='image/png, image/jpeg'
                    className='hidden'
                    onChange={event =>
                      setValues({ ...values, extra: { ...values.extra, tngReceipt: event.currentTarget.files![0] } })
                    }
                  />
                </label>
              ) : (
                <img src={URL.createObjectURL(values.extra.tngReceipt)} alt={values.extra.tngReceipt.name} />
              )} */}

              {values.roles.length !== 0 && (
                <>
                  <label className='mt-4 mb-1 font-bold text-sm'>Signing up as</label>
                  <Select<Role>
                    value={values.roles[0]}
                    onChange={value => setValues({ ...values, roles: [value] })}
                    data={roles}
                  />
                </>
              )}

              {values.roles.find(r => r === 'PLAYER') ? (
                <>
                  <Switch.Group>
                    <div className='flex items-center mt-4'>
                      <Switch.Label className='mr-2 text-sm font-medium whitespace-nowrap'>First Timer</Switch.Label>
                      <Switch
                        checked={values.extra.firstTimer}
                        onChange={value => setValues({ ...values, extra: { ...values.extra, firstTimer: value } })}
                        className={`${values.extra.firstTimer ? 'bg-primary' : 'bg-dark-100'}
          relative inline-flex flex-shrink-0 h-5 w-8 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
                      >
                        <span
                          aria-hidden='true'
                          className={`${values.extra.firstTimer ? 'translate-x-3' : 'translate-x-0'}
            pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-lg transform ring-0 transition ease-in-out duration-200`}
                        />
                      </Switch>
                      {values.extra.firstTimer ? (
                        <InputField
                          name='extra.invitedBy'
                          placeholder='Invited by'
                          className='ml-4'
                          disabled={!values.extra.firstTimer}
                        />
                      ) : (
                        <div className='flex flex-col w-full ml-4'>{satellitePicker}</div>
                      )}
                    </div>
                  </Switch.Group>
                  {address}
                </>
              ) : values.roles.find(r => r !== 'PLAYER') ? (
                <>
                  <label className='mt-4 mb-1 font-bold text-sm'>Satellite</label>
                  {satellitePicker}
                  {address}
                </>
              ) : (
                address
              )}

              <Button
                loading={isSubmitting}
                color='secondary'
                type='submit'
                className='mt-4 py-2 rounded-md text-sm font-bold'
              >
                Submit
              </Button>
            </Form>
          )
        }}
      </Formik>
    </div>
  )
}
