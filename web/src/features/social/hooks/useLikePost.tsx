import { useCallback } from 'react'
import { ApolloError, useMutation } from '@apollo/client'

import { GET_POSTS_WITH_COMMENTS, LIKE_POST, PaginationInput } from '@/graphql'
import { LikePost, LikePostVariables } from '@/graphql/types/LikePost'
import { GetPostsWithComments, GetPostsWithCommentsVariables } from '@/graphql/types/GetPostsWithComments'

export const useLikePost = (
  fetchPosts: () => Promise<
    | {
        data: GetPostsWithComments
        loading: boolean
        error: ApolloError | undefined
      }
    | undefined
  >
) => {
  const [_likePost] = useMutation<LikePost, LikePostVariables>(LIKE_POST)

  const likePost = useCallback(
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
      _likePost({
        variables: { param: { postId, userId } },
        update: (cache, { data }) => {
          try {
            const postsData = cache.readQuery<GetPostsWithComments, GetPostsWithCommentsVariables>({
              query: GET_POSTS_WITH_COMMENTS,
              variables: { postsPage, commentsPage, user_id: userId }
            })
            if (!data || !data.likePost || !postsData || !postsData.posts) {
              console.error('error reading posts cache in apollo')
              return
            }

            const newPosts = postsData.posts.map(p => {
              if (p.id === postId) return { ...p, liked: true }
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
    [fetchPosts, _likePost]
  )

  return { likePost }
}
