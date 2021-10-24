import { ApolloError } from '@apollo/client'
import { Icon } from '@iconify/react'
import Dayjs from 'dayjs'
import RelativeTime from 'dayjs/plugin/relativeTime'
import React from 'react'

import { Avatar } from '@/components/Elements'
import { ActionButton, CommentForm } from '@/features/social'
import { PaginationInput } from '@/graphql'
import { GetPostsWithComments, GetPostsWithComments_posts } from '@/graphql/types/GetPostsWithComments'
import { UserWithAuth } from '@/lib/auth'
import { WindiUtilities } from '@/types/windi'
import { constructClassName } from '@/utils'

Dayjs.extend(RelativeTime)

type PostProps = {
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
  likePost: ({
    postId,
    userId,
    postsPage,
    commentsPage
  }: {
    postId: string
    userId: string
    postsPage: PaginationInput
    commentsPage: PaginationInput
  }) => void
  unlikePost: ({
    postId,
    userId,
    postsPage,
    commentsPage
  }: {
    postId: string
    userId: string
    postsPage: PaginationInput
    commentsPage: PaginationInput
  }) => void
  className?: string
  utilities?: WindiUtilities
}

export const Post: React.FC<PostProps> = ({
  user,
  post,
  fetchPosts,
  likePost,
  unlikePost,
  className = '',
  utilities
}) => {
  const defaultUtilities: WindiUtilities = {
    p: 'pt-4 px-4',
    bg: 'bg-dark-300',
    flex: 'flex flex-col',
    align: 'items-center',
    border: 'rounded-md',
    justify: 'justify-center'
  }
  return (
    <div className={constructClassName(utilities, defaultUtilities, className)}>
      <div className='flex items-center w-full'>
        <Avatar
          src={post.user.profile!.avatarUrl}
          name={post.user.profile!.nameEng}
          gender={post.user.profile!.gender}
          utilities={{ w: 'w-12', h: 'h-12', border: 'rounded-full' }}
        />
        <div className='flex flex-col ml-2'>
          <span className='font-medium'>{post.user.profile!.nameEng}</span>
          <span className='text-xs text-true-gray-400'>{Dayjs(post.createdAt).fromNow(true)}</span>
        </div>
        {/* TODO: Make this into a menu */}
        <Icon icon='eva:more-horizontal-fill' className='w-5 h-5 ml-auto mr-1 text-true-gray-400' />
      </div>
      <p className='mt-4 text-sm self-start'>{post.content}</p>

      <div className='flex items-center mt-4 mb-2 w-full text-sm text-true-gray-400'>
        <div className='flex items-center'>
          <Icon icon='fluent:like-16-filled' className='mr-1 text-secondary-ring' />
          {post.likes}
        </div>
      </div>

      <div className='flex flex-col text-sm w-full'>
        <div className='w-full h-[1px] bg-dark-100 my-1' />
        <div className='flex justify-between items-center w-full text-true-gray-400'>
          <ActionButton
            variant='like'
            highlighted={post.liked}
            onClick={() => {
              const params = {
                postId: post.id,
                userId: user.user.id,
                commentsPage: { first: 5 },
                postsPage: { first: 5 }
              }
              if (!post.liked) likePost(params)
              else unlikePost(params)
            }}
          />
          <ActionButton variant='comment' />
        </div>
        <div className='w-full h-[1px] bg-dark-100 my-1' />
      </div>

      {post.comments.map(comment => (
        <div key={comment.id} className={`flex w-full text-sm mt-4`}>
          <Avatar
            src={comment.user.profile!.avatarUrl}
            name={comment.user.profile!.nameEng}
            gender={comment.user.profile!.gender}
            utilities={{ w: 'w-10', h: 'h-10', border: 'rounded-full' }}
          />
          <div className='flex flex-col ml-2'>
            <div className='px-3 py-2 bg-dark-100 rounded-md'>
              <span className='text-xs font-medium text-true-gray-300'>{comment.user.profile!.nameEng}</span>
              <p className='text-true-gray-100'>{comment.content}</p>
            </div>
            <div className='flex items-center mt-1 text-xs font-medium text-true-gray-500'>
              <button className='focus:outline-none focus:text-primary hover:underline focus:underline'>Like</button>
              <span className='ml-1'> · {Dayjs(comment.createdAt).fromNow(true)}</span>
            </div>
          </div>
        </div>
      ))}

      <CommentForm user={user} post={post} fetchPosts={fetchPosts} utilities={{ m: 'my-4' }} />
    </div>
  )
}
