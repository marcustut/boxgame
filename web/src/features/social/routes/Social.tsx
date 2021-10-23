import React, { useEffect } from 'react'

import { AppLayout, Spinner } from '@/components/Elements'
import { useAuth } from '@/lib/auth'
import { LoadingPage } from '@/components/Misc'
import { NewPostForm, SocialPosts, useFetchPosts } from '@/features/social'

export const Social: React.FC = () => {
  const { user } = useAuth()
  const { posts, fetchPosts } = useFetchPosts(user)

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  if (!user) return <LoadingPage />

  return (
    <AppLayout>
      <NewPostForm user={user} refetchPosts={fetchPosts} />
      {posts.value ? (
        <SocialPosts user={user} posts={posts.value} fetchPosts={fetchPosts} />
      ) : (
        <Spinner className='mt-4 mx-auto text-secondary' />
      )}
    </AppLayout>
  )
}
