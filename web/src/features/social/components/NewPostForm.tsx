import { ApolloError } from '@apollo/client'
import { Transition, Dialog } from '@headlessui/react'
import { Icon } from '@iconify/react'
import { Formik, Form } from 'formik'
import { useSnackbar } from 'notistack'
import React, { Fragment, useState } from 'react'

import { Avatar, InputField, Button } from '@/components/Elements'
import { useCreatePost } from '@/features/social'
import { GetPostsWithComments } from '@/graphql/types/GetPostsWithComments'
import { UserWithAuth } from '@/lib/auth'

type NewPostFormProps = {
  user: UserWithAuth
  refetchPosts: () => Promise<
    | {
        data: GetPostsWithComments
        loading: boolean
        error: ApolloError | undefined
      }
    | undefined
  >
  className?: string
}

export const NewPostForm: React.FC<NewPostFormProps> = ({ user, refetchPosts, className = '' }) => {
  const { enqueueSnackbar } = useSnackbar()
  const [dialogOpen, setDialogOpen] = useState<boolean>(false)
  const { createPost } = useCreatePost(refetchPosts)

  return (
    <Formik
      initialValues={{ content: '' }}
      onSubmit={async values => {
        const { data, errors } = await createPost({
          userId: user.user.id,
          content: values.content,
          images: [],
          postsPage: { first: 5 },
          commentsPage: { first: 5 }
        })
        if (errors || !data) {
          console.error(errors)
          enqueueSnackbar('Unable to create your post now, try again later', { variant: 'error' })
          return
        }

        enqueueSnackbar('Your post is successfully created', { variant: 'success' })
        setDialogOpen(false)
      }}
    >
      {({ isSubmitting, values, submitForm }) => (
        <Form className={`w-full bg-dark-300 rounded-md p-4 ${className}`}>
          {user.user.profile ? (
            <div className='flex items-center'>
              <Avatar
                src={user.user.profile.avatarUrl}
                name={user.user.profile.nameEng}
                gender={user.user.profile.gender}
                utilities={{ w: 'w-12', h: 'h-12', border: 'rounded-full', bg: 'bg-dark-50' }}
              />
              <button
                type='button'
                className='w-full ml-4 px-4 py-2 bg-dark-100 rounded-full font-normal text-left text-true-gray-400 focus:outline-none focus:bg-dark-50'
                onClick={() => setDialogOpen(true)}
              >
                What's on your mind?
              </button>
              {/* <InputField name='content' className='ml-4' /> */}
            </div>
          ) : (
            'Unable to fetch your profile'
          )}

          <Transition show={dialogOpen} as={Fragment}>
            <Dialog onClose={() => setDialogOpen(false)}>
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
                <div className='px-4 py-4 flex flex-col justify-center items-center fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 <sm:w-4/5 bg-dark-400/90 rounded-lg shadow-2xl'>
                  <div className='flex justify-center items-center mb-4 font-bold w-full'>
                    Create Post
                    <button
                      type='button'
                      className='p-1 bg-dark-200 rounded-full absolute right-4 focus:outline-none'
                      onClick={() => setDialogOpen(false)}
                    >
                      <Icon icon='mdi:close' />
                    </button>
                  </div>
                  <InputField
                    name='content'
                    className='w-full font-medium text-sm'
                    inputClassName='bg-dark-300 focus:outline-none focus:ring-2 focus:ring-primary-ring border-0'
                    placeholder="What's on your mind?"
                    textarea
                    rows={5}
                  />

                  <Button
                    type='submit'
                    loading={isSubmitting}
                    disabled={values.content === '' || isSubmitting}
                    onClick={submitForm}
                    className='w-full mt-4 py-1.5 font-medium text-sm rounded-[4px]'
                  >
                    Post
                  </Button>
                </div>
              </Transition.Child>
            </Dialog>
          </Transition>
        </Form>
      )}
    </Formik>
  )
}
