import { useMutation } from '@apollo/client'
import { Icon } from '@iconify/react'
import { useSnackbar } from 'notistack'
import React, { useState } from 'react'

import { Avatar, Input } from '@/components/Elements'
import { CREATE_COMMENT } from '@/graphql'
import { CreateComment, CreateCommentVariables } from '@/graphql/types/CreateComment'
import { GetPostsWithComments_posts } from '@/graphql/types/GetPostsWithComments'
import { UserWithAuth } from '@/lib/auth'
import { WindiUtilities } from '@/types/windi'
import { constructClassName } from '@/utils'

type CommentFormProps = {
  user: UserWithAuth
  post: GetPostsWithComments_posts
  inputRef?: React.RefObject<HTMLInputElement>
  className?: string
  utilities?: WindiUtilities
}

export const CommentForm: React.FC<CommentFormProps> = ({ user, post, inputRef, className = '', utilities }) => {
  const { enqueueSnackbar } = useSnackbar()
  const [comment, setComment] = useState<string>('')
  const [createComment] = useMutation<CreateComment, CreateCommentVariables>(CREATE_COMMENT)

  const defaultUtilities: WindiUtilities = {
    w: 'w-full',
    flex: 'flex',
    align: 'items-center'
  }

  return (
    <div className={constructClassName(utilities, defaultUtilities, className)}>
      <Avatar
        src={user.user.profile!.avatarUrl}
        name={user.user.profile!.nameEng}
        gender={user.user.profile!.gender}
        utilities={{ w: 'w-10', h: 'h-10', border: 'rounded-full' }}
      />
      <Input
        ref={inputRef}
        name='comment'
        placeholder='Write a comment...'
        className='ml-2'
        onChange={e => setComment(e.target.value)}
      />
      <button
        className='bg-dark-100 p-2 ml-2 rounded-full text-true-gray-400 focus:ring-2 focus:ring-primary-ring focus:outline-none transition duration-200 ease-in-out'
        onClick={async () => {
          if (comment.length === 0) return

          const { data, errors } = await createComment({
            variables: { param: { userId: user.user.id, postId: post.id, content: comment } },
            update: (cache, { data }) => {
              if (!data) throw new Error('CreateComment failed to execute')
              cache.modify({
                fields: {
                  posts(existingPostRefs = [], { readField }) {}
                }
              })
            }
          })
          if (errors || !data) {
            console.error(errors)
            enqueueSnackbar('Unable to create your comment now, try again later', { variant: 'error' })
            return
          }

          // reset the input field
          setComment('')
          if (inputRef && inputRef.current) inputRef.current.value = ''
        }}
      >
        <Icon icon='carbon:send-alt-filled' />
      </button>
    </div>
  )
}
