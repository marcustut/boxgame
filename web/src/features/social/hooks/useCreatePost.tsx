import { ApolloError, useMutation } from '@apollo/client'
import { useCallback } from 'react'

import { CREATE_POST, GET_POSTS_WITH_COMMENTS, PaginationInput } from '@/graphql'
import { CreatePost, CreatePostVariables } from '@/graphql/types/CreatePost'
import { GetPostsWithComments, GetPostsWithCommentsVariables } from '@/graphql/types/GetPostsWithComments'

export const useCreatePost = (
  fetchPosts: () => Promise<
    | {
        data: GetPostsWithComments
        loading: boolean
        error: ApolloError | undefined
      }
    | undefined
  >
) => {
  const [_createPost] = useMutation<CreatePost, CreatePostVariables>(CREATE_POST)

  const createPost = useCallback(
    async ({
      userId,
      content,
      images,
      postsPage,
      commentsPage
    }: {
      userId: string
      content: string
      images: string[]
      postsPage: PaginationInput
      commentsPage: PaginationInput
    }) => {
      const result = await _createPost({
        variables: { param: { userId, content, images }, commentsPage, user_id: userId },
        update: (cache, { data }) => {
          const posts = cache.readQuery<GetPostsWithComments, GetPostsWithCommentsVariables>({
            query: GET_POSTS_WITH_COMMENTS,
            variables: { postsPage, commentsPage, user_id: userId }
          })
          if (!posts || !posts.posts || !data || !data.createPost) {
            console.error('error getting GET_POSTS_WITH_COMMENTS cache from apollo')
            return
          }

          cache.writeQuery<GetPostsWithComments, GetPostsWithCommentsVariables>({
            query: GET_POSTS_WITH_COMMENTS,
            variables: { postsPage, commentsPage, user_id: userId },
            data: {
              posts: [...posts.posts, data.createPost]
            }
          })
        },
        onQueryUpdated: () => fetchPosts()
      })
      return result
    },
    [fetchPosts, _createPost]
  )

  return { createPost }
}
