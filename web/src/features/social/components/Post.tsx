import { useMutation } from '@apollo/client'
import { Icon } from '@iconify/react'
import Dayjs from 'dayjs'
import RelativeTime from 'dayjs/plugin/relativeTime'
import React, { useRef } from 'react'

import { Avatar, Spinner } from '@/components/Elements'
import { ActionButton, CommentForm } from '@/features/social'
import { LIKE_POST, UNLIKE_POST } from '@/graphql'
import { GetPostsWithComments_posts } from '@/graphql/types/GetPostsWithComments'
import { LikePost, LikePostVariables } from '@/graphql/types/LikePost'
import { UnlikePost, UnlikePostVariables } from '@/graphql/types/UnlikePost'
import { UserWithAuth } from '@/lib/auth'
import { WindiUtilities } from '@/types/windi'
import { constructClassName } from '@/utils'

Dayjs.extend(RelativeTime)

type PostProps = {
  user: UserWithAuth
  post: GetPostsWithComments_posts
  commentsCount: number
  showMoreComments: () => void
  className?: string
  utilities?: WindiUtilities
}

export const Post: React.FC<PostProps> = ({
  user,
  post,
  commentsCount,
  showMoreComments,
  className = '',
  utilities
}) => {
  const [likePost] = useMutation<LikePost, LikePostVariables>(LIKE_POST)
  const [unlikePost] = useMutation<UnlikePost, UnlikePostVariables>(UNLIKE_POST)

  const inputRef = useRef<HTMLInputElement>(null)
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
      <p className='mt-4 text-sm self-start whitespace-pre-wrap'>{post.content}</p>

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
              if (!post.liked) {
                likePost({
                  variables: { param: { postId: post.id, userId: user.user.id } },
                  update: (cache, { data }) => {
                    if (!data) throw new Error('LikePost failed to execute')
                    cache.modify({
                      fields: {
                        posts(existingPostRefs = [], { readField }) {}
                      }
                    })
                  }
                })
              } else {
                unlikePost({
                  variables: { param: { postId: post.id, userId: user.user.id } },
                  update: (cache, { data }) => {
                    if (!data) throw new Error('UnlikePost failed to execute')
                    cache.modify({
                      fields: {
                        posts(existingPostRefs = [], { readField }) {}
                      }
                    })
                  }
                })
              }
            }}
          />
          <ActionButton
            variant='comment'
            onClick={() => {
              if (!inputRef) return
              inputRef.current?.focus()
            }}
          />
        </div>
        <div className='w-full h-[1px] bg-dark-100 my-1' />
      </div>

      {post.comments ? (
        post.comments.length > 0 ? (
          post.comments.map(comment => (
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
                  <button
                    data-blobity-magnetic='false'
                    className='focus:outline-none focus:text-primary hover:underline focus:underline'
                  >
                    Like
                  </button>
                  <span className='ml-1'> · {Dayjs(comment.createdAt).fromNow(true)}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className='text-true-gray-500 text-sm mt-2 flex items-center'>
            <Icon icon='ph:tray' className='mr-1' /> no comments
          </div>
        )
      ) : (
        <Spinner className='mx-auto mt-4 text-secondary' />
      )}
      {post.comments && post.comments.length >= commentsCount && (
        <button
          data-blobity-magnetic='false'
          className='mt-2 ml-12 self-start text-true-gray-500 text-xs font-medium hover:underline'
          onClick={() => showMoreComments()}
        >
          Show More
        </button>
      )}

      <CommentForm inputRef={inputRef} user={user} post={post} utilities={{ m: 'my-4' }} />
    </div>
  )
}
