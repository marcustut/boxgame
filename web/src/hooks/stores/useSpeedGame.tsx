import create from 'zustand'
import { devtools, persist } from 'zustand/middleware'

type SpeedGameState = {
  completedAt: string | null
  setCompletedAt: (completedAt: string) => void
}

const createState = persist<SpeedGameState>(
  set => ({
    completedAt: null,
    setCompletedAt: completedAt => set({ completedAt })
  }),
  {
    name: 'thebox-speed-game'
  }
)

export const useSpeedGame = create(import.meta.env.DEV ? devtools(createState) : createState)
