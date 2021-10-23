import React, { useState } from 'react'
import { Icon } from '@iconify/react'
import { ApolloError } from '@apollo/client'
import { useSnackbar } from 'notistack'

import { UserWithAuth } from '@/lib/auth'
import { WindiUtilities } from '@/types/windi'
import { Avatar, Input } from '@/components/Elements'
import { constructClassName } from '@/utils'
import { GetPostsWithComments, GetPostsWithComments_posts } from '@/graphql/types/GetPostsWithComments'
import { useCreateComment } from '@/features/social'

type CommentFormProps = {
  user: UserWithAuth
  post: GetPostsWithComments_posts
  fetchPosts: () => Promise<
    | {
        data: GetPostsWithComments
        loading: boolean
        error: ApolloError | undefined
      }
    | undefined
  >
  className?: string
  utilities?: WindiUtilities
}

export const CommentForm: React.FC<CommentFormProps> = ({ user, post, fetchPosts, className = '', utilities }) => {
  const { enqueueSnackbar } = useSnackbar()
  const [comment, setComment] = useState<string>('')
  const { createComment } = useCreateComment(fetchPosts)

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
            postId: post.id,
            userId: user.user.id,
            content: comment,
            postsPage: { first: 5 },
            commentsPage: { first: 5 }
          })
          if (errors || !data) {
            console.error(errors)
            enqueueSnackbar('Unable to create your comment now, try again later', { variant: 'error' })
            return
          }
        }}
      >
        <Icon icon='carbon:send-alt-filled' />
      </button>
    </div>
  )
}
