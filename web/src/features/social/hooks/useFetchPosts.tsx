import { useAsyncFn } from 'react-use'
import { useQuery } from '@apollo/client'

import { GET_POSTS_WITH_COMMENTS } from '@/graphql'
import { GetPostsWithComments, GetPostsWithCommentsVariables } from '@/graphql/types/GetPostsWithComments'
import { UserWithAuth } from '@/lib/auth'

export const useFetchPosts = (user: UserWithAuth | undefined) => {
  const { refetch: _fetchPosts } = useQuery<GetPostsWithComments, GetPostsWithCommentsVariables>(
    GET_POSTS_WITH_COMMENTS,
    { skip: true }
  )

  // Fetch posts function
  const [posts, fetchPosts] = useAsyncFn(async () => {
    if (!user) return
    const { data, loading, error } = await _fetchPosts({
      postsPage: { first: 5 },
      commentsPage: { first: 5 },
      user_id: user.user.id
    })
    return { data, loading, error }
  }, [user])

  return { posts, fetchPosts }
}
