import { Icon } from '@iconify/react'
import React, { Fragment, useState } from 'react'
import { Waypoint } from 'react-waypoint'

import { AppLayout, Spinner } from '@/components/Elements'
import { NewPostForm, Post } from '@/features/social'
import { GET_POSTS_WITH_COMMENTS, useQueryWithTypes } from '@/graphql'
import {
  GetPostsWithComments,
  GetPostsWithCommentsVariables,
  GetPostsWithComments_posts
} from '@/graphql/types/GetPostsWithComments'
import { UserWithAuth } from '@/lib/auth'

type SocialProps = {
  user: UserWithAuth
}

export const Social: React.FC<SocialProps> = ({ user }) => {
  const [postsLimit, setPostsLimit] = useState<number>(5)
  const [commentsLimit, setCommentsLimit] = useState<number>(5)
  const { data, fetchMore, networkStatus } = useQueryWithTypes<GetPostsWithComments, GetPostsWithCommentsVariables>(
    GET_POSTS_WITH_COMMENTS,
    {
      variables: {
        user_id: user.user.id,
        postsPage: { offset: 0, limit: postsLimit },
        commentsPage: { offset: 0, limit: commentsLimit }
      },
      notifyOnNetworkStatusChange: true
    }
  )

  const renderPosts = (posts: GetPostsWithComments_posts[]) =>
    posts.map((post, index) => (
      <Fragment key={post.id}>
        {index === posts.length - 1 && (
          <Waypoint
            onEnter={() => {
              const currentLength = posts.length
              fetchMore({
                variables: {
                  postsPage: { offset: currentLength, limit: 5 }
                },
                updateQuery: (pv, { fetchMoreResult }) => {
                  if (!fetchMoreResult) return pv
                  return { posts: [...pv.posts, ...fetchMoreResult.posts] }
                }
              }).then(fetchMoreResult => {
                setPostsLimit(posts.length + fetchMoreResult.data.posts.length)
              })
            }}
          />
        )}
        <Post
          user={user}
          post={post}
          commentsCount={commentsLimit}
          showMoreComments={() => setCommentsLimit(commentsLimit * 2)}
          utilities={{ m: index !== 0 ? 'mt-4' : '' }}
        />
      </Fragment>
    ))

  return (
    <AppLayout>
      <NewPostForm user={user} className='mb-4' />
      {!data ? (
        <Spinner className='mt-4 text-secondary mx-auto' />
      ) : (
        <>
          {data.posts.length > 0 ? (
            renderPosts(
              [...data.posts].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
            )
          ) : (
            <div className='flex flex-col justify-center items-center mt-8 text-true-gray-500'>
              <Icon icon='mdi:tray-remove' className='w-10 h-10' />
              <p className=''>no posts yet</p>
            </div>
          )}
          {networkStatus === 3 && <Spinner className='mt-4 mx-auto text-secondary' />}
        </>
      )}
    </AppLayout>
  )
}
