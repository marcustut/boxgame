import React, { useEffect, useState } from 'react'
import { Formik, Form, Field } from 'formik'
import { Typography, Divider } from '@mui/material'
import { DatePicker } from '@mui/lab'
import { Icon } from '@iconify/react'
import { Switch } from '@headlessui/react'

import { Layout } from '@/features/register'
import { useRiddle } from '@/hooks/stores/useRiddle'
import { Button, Input, Select, Spinner } from '@/components/Elements'
import type { definitions } from '@/types/supabase'
import type { SelectData } from '@/components/Elements'
import { useEffectOnce } from 'react-use'
// import { useMutation } from '@apollo/client'
// import { CREATE_NEW_USER, NewUser } from '@/graphql/mutation'

const genders = [
  { id: 1, name: 'Male', value: 'MALE' },
  { id: 2, name: 'Female', value: 'FEMALE' }
] as SelectData<definitions['Profile']['gender']>[]

const roles = [
  { id: 1, name: 'Player', value: 'PLAYER' },
  { id: 2, name: 'Team Leader', value: 'TEAMLEADER' },
  { id: 3, name: 'Cluster Leader', value: 'CLUSTERLEADER' },
  { id: 4, name: 'Crew', value: 'CREW' }
] as SelectData<definitions['UserRole']['role']>[]

const states = [
  { id: 1, name: 'W.P. Kuala Lumpur', value: 'W.P. Kuala Lumpur' },
  { id: 2, name: 'W.P. Putrajaya', value: 'W.P. Putrajaya' },
  { id: 3, name: 'W.P. Labuan', value: 'W.P. Labuan' },
  { id: 4, name: 'Selangor', value: 'Selangor' },
  { id: 5, name: 'Terengganu', value: 'Terengganu' },
  { id: 6, name: 'Negeri Sembilan', value: 'Negeri Sembilan' },
  { id: 7, name: 'Perak', value: 'Perak' },
  { id: 8, name: 'Perlis', value: 'Perlis' },
  { id: 9, name: 'Penang', value: 'Penang' },
  { id: 10, name: 'Pahang', value: 'Pahang' },
  { id: 11, name: 'Malacca', value: 'Malacca' },
  { id: 12, name: 'Kelantan', value: 'Kelantan' },
  { id: 13, name: 'Kedah', value: 'Kedah' },
  { id: 14, name: 'Johor', value: 'Johor' },
  { id: 15, name: 'Sabah', value: 'Sabah' },
  { id: 16, name: 'Sarawak', value: 'Sarawak' }
] as SelectData[]

const satellites = [
  { id: 1, name: 'FGA Puchong', value: 'FGAPUCHONG' },
  { id: 2, name: 'FGA Setapak', value: 'FGASETAPAK' },
  { id: 3, name: 'FGA Rawang', value: 'FGARAWANG' },
  { id: 4, name: 'FGA PJ', value: 'FGAPJ' },
  { id: 5, name: 'FGA USJ', value: 'FGAUSJ' }
] as SelectData[]

export const Register: React.FC = () => {
  const { timeUsed, completed } = useRiddle()
  const [mounted, setMounted] = useState(false)

  // const [createNewUser] = useMutation<{ createUser: string }, { param: NewUser }>(CREATE_NEW_USER)

  useEffectOnce(() => setMounted(true))

  useEffect(() => {
    if (!timeUsed && !completed) window.location.href = '/riddle'
  }, [timeUsed, completed])

  return (
    <Layout
      helmetProps={{ title: 'Register' }}
      style={{ paddingTop: '4rem', paddingBottom: '4rem', paddingLeft: '1rem', paddingRight: '1rem' }}
    >
      {!mounted ? (
        <Spinner className='h-8 w-8 text-secondary' />
      ) : (
        <div className='p-4 bg-dark-200 rounded-xl sm:w-[400px]'>
          <Typography variant='h6' fontWeight='bold'>
            Registration Form
          </Typography>
          <Divider sx={{ marginY: '0.5rem' }} />
          <Formik
            initialValues={{
              nameEng: '',
              nameChi: '',
              username: '',
              email: '',
              dob: null as Date | null,
              gender: 'MALE' as definitions['Profile']['gender'],
              phoneNumber: '',
              role: 'PLAYER' as definitions['UserRole']['role'],
              tngReceipt: null as File | null,
              firstTimer: false as boolean,
              invitedBy: '',
              satellite: satellites[0].value,
              address: {
                city: '',
                line1: '',
                state: states[0].value,
                country: 'Malaysia',
                postalCode: ''
              } as Omit<definitions['Address'], 'id'> | null
            }}
            onSubmit={values => {
              console.log(values)
            }}
          >
            {({ isSubmitting, values, setValues }) => {
              const satellitePicker = (
                <Select
                  value={values.satellite}
                  onChange={value => setValues({ ...values, satellite: value })}
                  data={satellites}
                />
              )
              const address = (
                <>
                  {values.address && (
                    <>
                      <label className='mt-2 mb-1 font-medium text-sm'>Shipping address</label>
                      <div>
                        <Field
                          as={Input}
                          name='address.country'
                          placeholder='Country'
                          value='Malaysia'
                          disabled
                          className='rounded-b-none border border-dark-300 text-true-gray-500'
                        />
                        <Field
                          as={Input}
                          name='address.line1'
                          placeholder='Address Line 1'
                          className='rounded-none border-b border-l border-r border-dark-300'
                        />
                        <Field
                          as={Input}
                          name='address.line2'
                          placeholder='Address Line 2'
                          className='rounded-none border-b border-l border-r border-dark-300'
                        />
                        <div className='flex'>
                          <Field
                            as={Input}
                            name='address.city'
                            placeholder='City'
                            className='rounded-none border-b border-l border-dark-300'
                          />
                          <Field
                            as={Input}
                            name='address.postalCode'
                            placeholder='Postal Code'
                            className='rounded-none border-b border-l border-r border-dark-300'
                          />
                        </div>
                        <Select
                          value={values.address.state}
                          onChange={value => setValues({ ...values, address: { ...values.address!, state: value } })}
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
                  <label htmlFor='name' className='mb-1 font-medium text-sm'>
                    Full Name
                  </label>
                  <div className='flex flex-row'>
                    <Field as={Input} name='nameEng' placeholder='English' className='mr-2' />
                    <Field as={Input} name='nameChi' placeholder='Chinese' />
                  </div>

                  <label htmlFor='name' className='mt-2 mb-1 font-medium text-sm'>
                    Username
                  </label>
                  <Field as={Input} name='username' placeholder='Enter text here...' />

                  <label htmlFor='email' className='mt-2 mb-1 font-medium text-sm'>
                    Email
                  </label>
                  <Field as={Input} name='email' placeholder='Enter email here...' />

                  <label htmlFor='gender' className='mt-2 mb-1 font-medium text-sm'>
                    Gender
                  </label>
                  <Select<definitions['Profile']['gender']>
                    value={values.gender}
                    onChange={value => setValues({ ...values, gender: value })}
                    data={genders}
                  />

                  <label htmlFor='phoneNumber' className='mt-2 mb-1 font-medium text-sm'>
                    Phone number
                  </label>
                  <Field as={Input} name='phoneNumber' placeholder='Enter phone number here...' />

                  <label htmlFor='dob' className='mt-2 mb-1 font-medium text-sm'>
                    Date of birth
                  </label>
                  <DatePicker
                    label='Date of birth'
                    value={values.dob}
                    onChange={value => {
                      setValues({ ...values, dob: value })
                    }}
                    renderInput={({ inputRef, inputProps, InputProps }) => (
                      <div className='flex items-center'>
                        <Field
                          ref={inputRef}
                          as={Input}
                          name='dob'
                          {...inputProps}
                          className='focus:ring-primary-ring focus:border-transparent border-transparent'
                        />
                        {InputProps?.endAdornment}
                      </div>
                    )}
                  />

                  <label htmlFor='tngReceipt' className='mt-4 mb-1 font-medium text-sm'>
                    Payment receipt
                  </label>
                  {!values.tngReceipt ? (
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
                        onChange={event => setValues({ ...values, tngReceipt: event.currentTarget.files![0] })}
                      />
                    </label>
                  ) : (
                    <img src={URL.createObjectURL(values.tngReceipt)} alt={values.tngReceipt.name} />
                  )}

                  <label htmlFor='tngReceipt' className='mt-4 mb-1 font-medium text-sm'>
                    Signing up as
                  </label>
                  <Select<definitions['UserRole']['role']>
                    value={values.role}
                    onChange={value => setValues({ ...values, role: value })}
                    data={roles}
                  />

                  {values.role === 'PLAYER' ? (
                    <>
                      <Switch.Group>
                        <div className='flex items-center mt-4'>
                          <Switch.Label className='mr-2 text-sm font-medium whitespace-nowrap'>
                            First Timer
                          </Switch.Label>
                          <Switch
                            checked={values.firstTimer}
                            onChange={value => setValues({ ...values, firstTimer: value })}
                            className={`${values.firstTimer ? 'bg-primary' : 'bg-dark-100'}
          relative inline-flex flex-shrink-0 h-5 w-8 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
                          >
                            <span
                              aria-hidden='true'
                              className={`${values.firstTimer ? 'translate-x-3' : 'translate-x-0'}
            pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-lg transform ring-0 transition ease-in-out duration-200`}
                            />
                          </Switch>
                          {values.firstTimer ? (
                            <Field
                              as={Input}
                              name='invitedBy'
                              placeholder='Invited by'
                              className='ml-4'
                              disabled={!values.firstTimer}
                            />
                          ) : (
                            <div className='flex flex-col w-full ml-4'>{satellitePicker}</div>
                          )}
                        </div>
                      </Switch.Group>
                      {address}
                    </>
                  ) : (
                    <>
                      <label className='mt-2 mb-1 font-medium text-sm'>Satellite</label>
                      {satellitePicker}
                      {address}
                    </>
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
      )}
    </Layout>
  )
}
