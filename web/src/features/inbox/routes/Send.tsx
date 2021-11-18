import { Icon } from '@iconify/react'
import { Form, Formik } from 'formik'
import { useSnackbar } from 'notistack'
import React, { useCallback, useEffect, useState } from 'react'
import Dropzone from 'react-dropzone'
import * as Yup from 'yup'

import { AppLayout, Button, InputField, Select, Spinner } from '@/components/Elements'
import { bulkUploadFilesToSupabase } from '@/features/humanity'
import { useAuth } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { definitions } from '@/types/supabase'

export const UploadedFileWrapper: React.FC<{ filename: string; onClose?: () => void }> = ({
  children,
  filename,
  onClose
}) => {
  return (
    <div className='flex flex-col items-center relative'>
      {onClose && (
        <button data-blobity-magnetic={false} type='button' className='absolute -top-2 -right-2' onClick={onClose}>
          <Icon icon='mdi:close-thick' className='w-6 h-6 p-1 rounded-full bg-secondary text-dark-100' />
        </button>
      )}
      {children}
      <p className='text-sm text-true-gray-300 mt-2'>{filename}</p>
    </div>
  )
}

type UserFetch = { id: string; username: string; profile: { nameEng: string } }

type FormSchema = { receiver: UserFetch | undefined; title: string; text: string; attachment: File[] }

const MAX_FILE_SIZE = 48000000

const formSchema = Yup.object({
  receiver: Yup.object({
    id: Yup.string(),
    username: Yup.string(),
    profile: Yup.object({
      nameEng: Yup.string()
    })
  }).required(),
  title: Yup.string().required('Every mail must have a title').notOneOf(['']),
  text: Yup.string().required('Type something before you send the mail').notOneOf(['']),
  attachment: Yup.array()
})

export const Send: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar()
  const { user } = useAuth()
  const [users, setUsers] = useState<UserFetch[]>()

  useEffect(() => {
    supabase
      .from<UserFetch>('User')
      .select(
        `
        id,
        username,
        profile:Profile (
          nameEng
        )
        `
      )
      .then(({ data, error }) => {
        if (error || !data) {
          console.error(error)
          return
        }
        setUsers(data)
      })
  }, [])

  const handleSubmit = useCallback(
    async ({ receiver, title, text, attachment }: FormSchema) => {
      if (!user) {
        enqueueSnackbar('Unable to load your user, refresh and try again', { variant: 'error' })
        return
      }
      if (!receiver) {
        enqueueSnackbar('Recevier must be specified', { variant: 'error' })
        return
      }
      let uploadedAttachment: string[] = []
      if (attachment.length !== 0) {
        const res = await bulkUploadFilesToSupabase(attachment, 'mails', `${receiver.id}`, {
          cacheControl: '3600',
          upsert: true
        })
        if (res.error || !res.publicURLs) {
          enqueueSnackbar(`Error uploading attachments\n${JSON.stringify(res.error, null, 2)}`, { variant: 'error' })
          return
        }
        uploadedAttachment = res.publicURLs
      }
      const { error } = await supabase.from<definitions['Mail']>('Mail').insert({
        title,
        text,
        attachment: uploadedAttachment,
        sender: user.user.username,
        receiver: receiver.username,
        updated_at: new Date().toISOString()
      })
      if (error) {
        enqueueSnackbar(`Error sending mail\n${JSON.stringify(error, null, 2)}`, { variant: 'error' })
        console.error(error)
        return
      }

      enqueueSnackbar('Your mail is sucessfully sent! Redirecting you back to inbox...', { variant: 'success' })
      setTimeout(() => (window.location.href = '/app/inbox'), 2000)
    },
    [enqueueSnackbar, user]
  )

  return (
    <AppLayout>
      <div className='my-6'>
        <div className='flex items-center mb-4'>
          <h2 className='text-2xl font-bold'>Send a mail</h2>
          <Icon icon='mdi:email-fast-outline' className='ml-2 w-8 h-8' />
        </div>
        <Formik<FormSchema>
          initialValues={{ receiver: undefined, title: '', text: '', attachment: [] }}
          validationSchema={formSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, setValues, values }) => (
            <Form className='p-4 bg-dark-300/50 rounded-sm flex flex-col'>
              <label className='text-sm text-true-gray-300'>Who do you want to send to?</label>
              {user && users ? (
                <Select
                  className='mt-2'
                  placeholder='Select a receiver'
                  value={values.receiver}
                  onChange={value => setValues({ ...values, receiver: value })}
                  data={
                    users
                      .map(u => ({ id: u.id, name: u.profile.nameEng, value: u }))
                      .sort((a, b) => (a.name > b.name ? 1 : a.name < b.name ? -1 : 0))
                    // .filter(u => u.id !== user.user.id)
                  }
                />
              ) : (
                <Spinner />
              )}
              <label className='text-sm text-true-gray-300 mt-4'>Mail title</label>
              <InputField className='mt-2' placeholder='Enter the mail title here' name='title' />
              <label className='text-sm text-true-gray-300 mt-4'>Mail content</label>
              <InputField className='mt-2' placeholder='Enter the content here' name='text' textarea rows={5} />
              <label className='text-sm text-true-gray-300 mt-4'>
                Have an attachment? Drop it below!{' '}
                <span className='text-xs text-true-gray-400'>(make sure your file is named in English)</span>
              </label>
              <Dropzone
                onDrop={acceptedFiles => {
                  if (acceptedFiles.length === 0) return

                  for (let i = 0; i < acceptedFiles.length; i++) {
                    if (acceptedFiles[i].size > MAX_FILE_SIZE) {
                      enqueueSnackbar('Only accept files up to 48mb', { variant: 'warning' })
                      return
                    }
                  }

                  setValues({ ...values, attachment: Array.from(new Set(acceptedFiles)) })
                }}
                onDropRejected={fileRejections => {
                  fileRejections
                    .map(rejection => rejection.errors.map(error => error.message))
                    .forEach(messages => messages.forEach(message => enqueueSnackbar(message, { variant: 'error' })))
                }}
              >
                {({ getRootProps, getInputProps }) => (
                  <div className=''>
                    <div
                      {...getRootProps()}
                      className={`mt-2 flex flex-col justify-center items-center border border-true-gray-500 border-dashed px-8 ${
                        true ? 'py-8' : 'py-16'
                      } text-true-gray-500`}
                    >
                      {values.attachment.length === 0 ? (
                        <>
                          <input {...getInputProps()} />
                          <Icon icon='ph:upload-simple-duotone' className='w-16 h-16' />
                          <p className=''>Drag 'n' drop your files here, or click to select files</p>
                        </>
                      ) : (
                        <>
                          <div className='grid grid-cols-3 gap-4'>
                            {values.attachment.map(file => {
                              const fileExtension = file.name.split('.').pop()
                              const onClose = () =>
                                setValues({
                                  ...values,
                                  attachment: values.attachment.filter(f => f.name !== file.name)
                                })
                              if (fileExtension && ['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension))
                                return (
                                  <UploadedFileWrapper key={file.name} filename={file.name} onClose={onClose}>
                                    <img
                                      className='object-cover w-56 h-full'
                                      src={URL.createObjectURL(file)}
                                      alt={file.name}
                                    />
                                  </UploadedFileWrapper>
                                )
                              else if (fileExtension && ['mp4', 'mpeg'].includes(fileExtension))
                                return (
                                  <UploadedFileWrapper key={file.name} filename={file.name} onClose={onClose}>
                                    <video controls>
                                      <source src={URL.createObjectURL(file)} type='video/mp4' />
                                    </video>
                                  </UploadedFileWrapper>
                                )
                              return (
                                <UploadedFileWrapper key={file.name} filename={file.name} onClose={onClose}>
                                  <div className='h-full flex justify-center items-center'>
                                    <Icon icon='mdi:file' className='w-12 h-12 text-true-gray-400' />
                                  </div>
                                </UploadedFileWrapper>
                              )
                            })}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </Dropzone>
              <Button type='submit' loading={isSubmitting} disabled={isSubmitting} className='mt-4'>
                Send
                <Icon icon='mdi:email-fast-outline' className='ml-1 w-5 h-5' />
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </AppLayout>
  )
}
