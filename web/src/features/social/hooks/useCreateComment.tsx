import { ApolloError, useMutation } from '@apollo/client'

import { CREATE_COMMENT, GET_POSTS_WITH_COMMENTS, PaginationInput } from '@/graphql'
import { CreateComment, CreateCommentVariables } from '@/graphql/types/CreateComment'
import { GetPostsWithComments, GetPostsWithCommentsVariables } from '@/graphql/types/GetPostsWithComments'
import { useCallback } from 'react'
import produce from 'immer'

export const useCreateComment = (
  fetchPosts: () => Promise<
    | {
        data: GetPostsWithComments
        loading: boolean
        error: ApolloError | undefined
      }
    | undefined
  >
) => {
  const [_createComment] = useMutation<CreateComment, CreateCommentVariables>(CREATE_COMMENT)

  const createComment = useCallback(
    async ({
      postId,
      userId,
      content,
      postsPage,
      commentsPage
    }: {
      postId: string
      userId: string
      content: string
      postsPage: PaginationInput
      commentsPage: PaginationInput
    }) => {
      const result = await _createComment({
        variables: { param: { postId, userId, content } },
        update: (cache, { data }) => {
          try {
            const posts = cache.readQuery<GetPostsWithComments, GetPostsWithCommentsVariables>({
              query: GET_POSTS_WITH_COMMENTS,
              variables: { postsPage, commentsPage, user_id: userId }
            })
            if (!posts || !posts.posts || !data || !data.createComment) {
              console.error('error getting GET_POSTS_WITH_COMMENTS cache from apollo')
              return
            }

            cache.writeQuery<GetPostsWithComments, GetPostsWithCommentsVariables>({
              query: GET_POSTS_WITH_COMMENTS,
              variables: { postsPage, commentsPage, user_id: userId },
              data: {
                posts: produce(posts.posts, draft => {
                  draft.find(p => p.id === postId)!.comments.push(data.createComment!)
                })
              }
            })
          } catch (err) {
            console.error(err)
          }
        },
        onQueryUpdated: () => fetchPosts()
      })
      return result
    },
    [fetchPosts, _createComment]
  )

  return { createComment }
}
