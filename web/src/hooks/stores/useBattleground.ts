import create, { GetState, SetState, StateCreator, StoreApi } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

import { BattlegroundEffect } from '@/graphql'

type AppliedEffect = { effect: BattlegroundEffect; aPointsOld: number; dPointsOld: number }

export type BattlegroundState = {
  appliedEffects: Record<number, AppliedEffect>
  setAppliedEffect: (round: number, appliedEffect: AppliedEffect) => void
}

const state: StateCreator<
  BattlegroundState,
  SetState<BattlegroundState>,
  GetState<BattlegroundState>,
  StoreApi<BattlegroundState>
> = (set, get) => ({
  appliedEffects: {},
  setAppliedEffect: (round, appliedEffect) => {
    const ae = { ...get().appliedEffects }
    ae[round] = appliedEffect
    set({ appliedEffects: ae })
  }
})

export const useBattleground = create(devtools(persist(state, { name: 'thebox-battleground' })))
