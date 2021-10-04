import create from 'zustand'
import { combine, persist, devtools } from 'zustand/middleware'

const createState = persist(
  combine(
    {
      timeUsed: null as number | null,
      completed: false as boolean
    },
    set => ({
      setTimeUsed: (timeUsed: number | null) => set({ timeUsed }),
      setCompleted: (completed: boolean) => set({ completed }),
      reset: () =>
        set({
          timeUsed: null,
          completed: false
        })
    })
  ),
  {
    name: 'thebox-riddle'
  }
)

export const useRiddle = create(import.meta.env.DEV ? devtools(createState) : createState)
