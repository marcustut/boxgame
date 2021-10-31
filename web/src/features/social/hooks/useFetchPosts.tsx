import { useQuery } from '@apollo/client'
import { useAsyncFn } from 'react-use'

import { GET_POSTS_WITH_COMMENTS } from '@/graphql'
import { GetPostsWithComments, GetPostsWithCommentsVariables } from '@/graphql/types/GetPostsWithComments'
import { useSocialPagination } from '@/hooks/stores'
import { UserWithAuth } from '@/lib/auth'

export const useFetchPosts = (user: UserWithAuth | undefined) => {
  const { postsPage, commentsPage } = useSocialPagination()
  const { refetch: _fetchPosts, fetchMore: fetchMorePosts } = useQuery<
    GetPostsWithComments,
    GetPostsWithCommentsVariables
  >(GET_POSTS_WITH_COMMENTS, { skip: true })

  // Fetch posts function
  const [posts, fetchPosts] = useAsyncFn(async () => {
    if (!user) return
    const { data, loading, error } = await _fetchPosts({
      postsPage: postsPage,
      commentsPage: commentsPage,
      user_id: user.user.id
    })
    return { data, loading, error }
  }, [user, postsPage, commentsPage])

  return { posts, fetchPosts, fetchMorePosts }
}
