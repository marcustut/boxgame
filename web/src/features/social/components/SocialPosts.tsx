import React from 'react'
import { ApolloError } from '@apollo/client'
import { Icon } from '@iconify/react'

import { Spinner } from '@/components/Elements'
import { Post, useLikePost, useUnlikePost } from '@/features/social'
import { GetPostsWithComments } from '@/graphql/types/GetPostsWithComments'
import { UserWithAuth } from '@/lib/auth'

type SocialPostsProps = {
  user: UserWithAuth
  posts: {
    data: GetPostsWithComments
    loading: boolean
    error: ApolloError | undefined
  }
  fetchPosts: () => Promise<
    | {
        data: GetPostsWithComments
        loading: boolean
        error: ApolloError | undefined
      }
    | undefined
  >
}

export const SocialPosts: React.FC<SocialPostsProps> = ({ user, posts, fetchPosts }) => {
  const { likePost } = useLikePost(fetchPosts)
  const { unlikePost } = useUnlikePost(fetchPosts)

  return (
    <>
      {!posts.loading && !posts.error ? (
        posts.data.posts.length !== 0 ? (
          <div className='mt-4'>
            {posts.data.posts.map((post, index) => (
              <Post
                key={post.id}
                user={user}
                post={post}
                likePost={likePost}
                unlikePost={unlikePost}
                fetchPosts={fetchPosts}
                utilities={{ m: index !== 0 ? 'mt-4' : '' }}
              />
            ))}
          </div>
        ) : (
          <div className='flex flex-col justify-center items-center mt-8 text-true-gray-500'>
            <Icon icon='mdi:tray-remove' className='w-10 h-10' />
            <p className=''>no posts yet</p>
          </div>
        )
      ) : (
        <Spinner className='mt-8 mx-auto text-secondary' />
      )}
    </>
  )
}
