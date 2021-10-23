import create from 'zustand'
import { persist, devtools } from 'zustand/middleware'

import { CreateNewUser_createUser } from '@/graphql'

export enum UserCurrentState {
  UNAUTHENTICATED = 'UNAUTHENTICATED',
  REGISTERED = 'REGISTERED',
  LOGGEDIN = 'LOGGEDIN'
}

type UserState = {
  state: UserCurrentState
  user: CreateNewUser_createUser | null
  rating: { registration: number | null }
  setState: (state: UserCurrentState) => void
  setUser: (user: CreateNewUser_createUser | null) => void
  setRating: (rating: { registration: number }) => void
  reset: () => void
}

const createState = persist<UserState>(
  set => ({
    state: UserCurrentState.UNAUTHENTICATED,
    user: null as CreateNewUser_createUser | null,
    rating: {
      registration: null as number | null
    },
    setState: (state: UserCurrentState) => set({ state }),
    setUser: (user: CreateNewUser_createUser | null) => set({ user }),
    setRating: (rating: { registration: number }) => set({ rating }),
    reset: () =>
      set({
        state: UserCurrentState.UNAUTHENTICATED,
        user: null
      })
  }),
  {
    name: 'thebox-user'
  }
)

export const useUser = create(import.meta.env.DEV ? devtools(createState) : createState)
