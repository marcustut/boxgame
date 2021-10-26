import create from 'zustand'
import { devtools, persist } from 'zustand/middleware'

type MysteryGameState = {
  searchWords: string[]
  answer: string
  keywords: { 沙发: boolean; 明星: boolean; 新闻: boolean; 粉丝: boolean; 送: boolean; 人皮: boolean }
  points: number
  setSearchWords: (searchWords: string[]) => void
  setAnswer: (answer: string) => void
  setKeywords: (keywords: MysteryGameState['keywords']) => void
  setPoints: (points: number) => void
}

const createState = persist<MysteryGameState>(
  set => ({
    searchWords: [],
    answer: '',
    keywords: {
      沙发: false,
      明星: false,
      新闻: false,
      粉丝: false,
      送: false,
      人皮: false
    },
    points: 0,
    setSearchWords: searchWords => set({ searchWords }),
    setAnswer: answer => set({ answer }),
    setKeywords: keywords => set({ keywords }),
    setPoints: points => set({ points })
  }),
  {
    name: 'thebox-mystery-game'
  }
)

export const useMysteryGame = create(import.meta.env.DEV ? devtools(createState) : createState)
