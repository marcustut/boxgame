import React, { useEffect } from 'react'

import { AppLayout, Spinner } from '@/components/Elements'
import { useAuth } from '@/lib/auth'
import { LoadingPage } from '@/components/Misc'
import { NewPostForm, SocialPosts, useFetchPosts } from '@/features/social'

export const Social: React.FC = () => {
  const { user } = useAuth()
  const { posts, fetchPosts } = useFetchPosts(user)

  useEffect(() => {
    ;(async () => {
      const res = await fetchPosts()
      if (res && res.error) {
        console.error(res.error)
        alert('error fetching posts from server')
      }
    })()
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
