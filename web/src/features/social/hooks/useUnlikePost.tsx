import { useCallback } from 'react'
import { ApolloError, useMutation } from '@apollo/client'

import { GET_POSTS_WITH_COMMENTS, PaginationInput, UNLIKE_POST } from '@/graphql'
import { GetPostsWithComments, GetPostsWithCommentsVariables } from '@/graphql/types/GetPostsWithComments'
import { UnlikePost, UnlikePostVariables } from '@/graphql/types/UnlikePost'

export const useUnlikePost = (
  fetchPosts: () => Promise<
    | {
        data: GetPostsWithComments
        loading: boolean
        error: ApolloError | undefined
      }
    | undefined
  >
) => {
  const [_unlikePost] = useMutation<UnlikePost, UnlikePostVariables>(UNLIKE_POST)

  const unlikePost = useCallback(
    ({
      postId,
      userId,
      postsPage,
      commentsPage
    }: {
      postId: string
      userId: string
      postsPage: PaginationInput
      commentsPage: PaginationInput
    }) => {
      _unlikePost({
        variables: { param: { postId, userId } },
        update: (cache, { data }) => {
          try {
            const postsData = cache.readQuery<GetPostsWithComments, GetPostsWithCommentsVariables>({
              query: GET_POSTS_WITH_COMMENTS,
              variables: { postsPage, commentsPage, user_id: userId }
            })
            if (!data || !data.unlikePost || !postsData || !postsData.posts) {
              console.error('error reading posts cache in apollo')
              return
            }

            const newPosts = postsData.posts.map(p => {
              if (p.id === postId) return { ...p, liked: false }
              return p
            })

            cache.writeQuery<GetPostsWithComments, GetPostsWithCommentsVariables>({
              query: GET_POSTS_WITH_COMMENTS,
              variables: { postsPage, commentsPage, user_id: userId },
              data: { posts: newPosts }
            })
          } catch (err) {
            console.error(err)
          }
        },
        onQueryUpdated: () => fetchPosts()
      })
    },
    [fetchPosts, _unlikePost]
  )

  return { unlikePost }
}
