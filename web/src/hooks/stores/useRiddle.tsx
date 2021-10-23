import create from 'zustand'
import { persist, devtools } from 'zustand/middleware'

type RiddleState = {
  timeUsed: number | null
  completed: boolean
  setTimeUsed: (timeUsed: number | null) => void
  setCompleted: (completed: boolean) => void
  reset: () => void
}

const createState = persist<RiddleState>(
  set => ({
    timeUsed: null,
    completed: false,
    setTimeUsed: (timeUsed: number | null) => set({ timeUsed }),
    setCompleted: (completed: boolean) => set({ completed }),
    reset: () =>
      set({
        timeUsed: null,
        completed: false
      })
  }),
  {
    name: 'thebox-riddle'
  }
)

export const useRiddle = create(import.meta.env.DEV ? devtools(createState) : createState)
