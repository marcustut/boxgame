import create from 'zustand'
import { combine, persist, devtools } from 'zustand/middleware'

import { CreateNewUser_createUser } from '@/graphql'

export enum UserState {
  UNAUTHENTICATED = 'UNAUTHENTICATED',
  REGISTERED = 'REGISTERED',
  LOGGEDIN = 'LOGGEDIN'
}

const createState = persist(
  combine(
    {
      state: UserState.UNAUTHENTICATED,
      user: null as CreateNewUser_createUser | null,
      rating: {
        registration: null as number | null
      }
    },
    set => ({
      setState: (state: UserState) => set({ state }),
      setUser: (user: CreateNewUser_createUser | null) => set({ user }),
      setRating: (rating: { registration: number }) => set({ rating }),
      reset: () =>
        set({
          state: UserState.UNAUTHENTICATED,
          user: null
        })
    })
  ),
  {
    name: 'thebox-user'
  }
)

export const useUser = create(import.meta.env.DEV ? devtools(createState) : createState)
