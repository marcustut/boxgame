import create, { GetState, SetState, StateCreator, StoreApi } from 'zustand'
import { devtools } from 'zustand/middleware'

import { PaginationInput } from '@/graphql'

export type SocialPaginationState = {
  postsPage: PaginationInput
  commentsPage: PaginationInput
  setPostsPagination: (postsPage: PaginationInput) => void
  setCommentsPagination: (commentsPage: PaginationInput) => void
}

const state: StateCreator<
  SocialPaginationState,
  SetState<SocialPaginationState>,
  GetState<SocialPaginationState>,
  StoreApi<SocialPaginationState>
> = set => ({
  postsPage: { limit: 5, offset: 0 },
  commentsPage: { limit: 5, offset: 0 },
  setPostsPagination: (postsPage: PaginationInput) => set({ postsPage }),
  setCommentsPagination: (commentsPage: PaginationInput) => set({ commentsPage })
})

export const useSocialPagination = create(devtools(state))
