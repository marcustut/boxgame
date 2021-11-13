import { Dialog, Transition } from '@headlessui/react'
import { Icon } from '@iconify/react'
import { useSnackbar } from 'notistack'
import React, { Fragment, useState } from 'react'

import { Button } from '@/components/Elements'
import { RoundJoinedUserQuery } from '@/features/battleground'
import { BattlegroundEffect } from '@/graphql'
import { useBattleground } from '@/hooks/stores'

type PointsCalculateFunc = (aPoints: number, dPoints: number) => { aPoints: number; dPoints: number }

const effectsTitle: Record<BattlegroundEffect, string> = {
  [BattlegroundEffect.ADD_100_PERCENT]: '增加现有分数100%。',
  [BattlegroundEffect.ADD_20_PERCENT]: '增加现有分数20%。',
  [BattlegroundEffect.ADD_30_PERCENT]: '增加现有分数30%。',
  [BattlegroundEffect.ADD_50_PERCENT]: '增加现有分数50%。',
  [BattlegroundEffect.ADD_90_PERCENT]: '增加现有分数90%。',
  [BattlegroundEffect.GIVE_100]: '给予对方组100分。',
  [BattlegroundEffect.GIVE_150]: '给予对方组150分。',
  [BattlegroundEffect.GIVE_200]: '给予对方组200分。',
  [BattlegroundEffect.GIVE_80]: '给予对方组80分。',
  [BattlegroundEffect.STEAL_100]: '获取对方组的100分。',
  [BattlegroundEffect.STEAL_150]: '获取对方组的150分。',
  [BattlegroundEffect.STEAL_200]: '获取对方组的200分。',
  [BattlegroundEffect.STEAL_80]: '获取对方组的80分。',
  [BattlegroundEffect.SUBTRACT_20_PERCENT]: '扣除现有分数的20%。',
  [BattlegroundEffect.SUBTRACT_30_PERCENT]: '扣除现有分数的30%。',
  [BattlegroundEffect.SUBTRACT_50_PERCENT]: '扣除现有分数的50%。'
}

export const powercardEffects: Record<BattlegroundEffect, PointsCalculateFunc> = {
  [BattlegroundEffect.ADD_100_PERCENT]: (aPoints, dPoints) => ({ aPoints: aPoints * 2, dPoints }),
  [BattlegroundEffect.ADD_20_PERCENT]: (aPoints, dPoints) => ({ aPoints: aPoints * 1.2, dPoints }),
  [BattlegroundEffect.ADD_30_PERCENT]: (aPoints, dPoints) => ({ aPoints: aPoints * 1.3, dPoints }),
  [BattlegroundEffect.ADD_50_PERCENT]: (aPoints, dPoints) => ({ aPoints: aPoints * 1.5, dPoints }),
  [BattlegroundEffect.ADD_90_PERCENT]: (aPoints, dPoints) => ({ aPoints: aPoints * 1.9, dPoints }),
  [BattlegroundEffect.GIVE_100]: (aPoints, dPoints) => ({ aPoints: aPoints - 100, dPoints: dPoints + 100 }),
  [BattlegroundEffect.GIVE_150]: (aPoints, dPoints) => ({ aPoints: aPoints - 150, dPoints: dPoints + 150 }),
  [BattlegroundEffect.GIVE_200]: (aPoints, dPoints) => ({ aPoints: aPoints - 200, dPoints: dPoints + 200 }),
  [BattlegroundEffect.GIVE_80]: (aPoints, dPoints) => ({ aPoints: aPoints - 80, dPoints: dPoints + 80 }),
  [BattlegroundEffect.STEAL_100]: (aPoints, dPoints) => ({ aPoints: aPoints + 100, dPoints: dPoints - 100 }),
  [BattlegroundEffect.STEAL_150]: (aPoints, dPoints) => ({ aPoints: aPoints + 150, dPoints: dPoints - 150 }),
  [BattlegroundEffect.STEAL_200]: (aPoints, dPoints) => ({ aPoints: aPoints + 200, dPoints: dPoints - 200 }),
  [BattlegroundEffect.STEAL_80]: (aPoints, dPoints) => ({ aPoints: aPoints + 80, dPoints: dPoints - 80 }),
  [BattlegroundEffect.SUBTRACT_20_PERCENT]: (aPoints, dPoints) => ({ aPoints: aPoints * 0.8, dPoints }),
  [BattlegroundEffect.SUBTRACT_30_PERCENT]: (aPoints, dPoints) => ({ aPoints: aPoints * 0.7, dPoints }),
  [BattlegroundEffect.SUBTRACT_50_PERCENT]: (aPoints, dPoints) => ({ aPoints: aPoints * 0.5, dPoints })
}

type EffectBoxProps = {
  round: RoundJoinedUserQuery
  effect: BattlegroundEffect
  opened: boolean
  id: number | string
  applyTo: 'attacker' | 'defender'
  applyEffect?: (aPoints: number, dPoints: number) => Promise<void>
}

export const EffectBox: React.FC<EffectBoxProps> = ({ round, effect, opened, id, applyTo, applyEffect }) => {
  const { enqueueSnackbar } = useSnackbar()
  const [open, setOpen] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const { setAppliedEffect } = useBattleground()

  return (
    <>
      <button
        data-blobity-magnetic='false'
        disabled={opened}
        className={`relative w-full h-[7.6rem] py-3 group ${
          opened ? 'bg-secondary/50' : 'bg-dark-300/50 hover:bg-primary/50'
        } rounded-md flex items-center justify-center transition duration-200 ease-in-out`}
        onClick={() => setOpen(true)}
      >
        <Icon
          icon={opened ? 'raphael:package' : 'noto:package'}
          className={`w-20 h-20 transform transition ease-in-out duration-200 ${
            opened ? '' : 'group-hover:scale-120'
          } `}
        />
        <p className='absolute bottom-2 right-2 text-sm text-true-gray-400 group-hover:text-white transition ease-in-out duration-200'>
          Box {id}
        </p>
      </button>

      <Transition show={open} as={Fragment}>
        <Dialog onClose={() => setOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <Dialog.Overlay className='fixed inset-0 backdrop-filter backdrop-blur-sm backdrop-brightness-90' />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0 scale-95'
            enterTo='opacity-100 scale-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100 scale-100'
            leaveTo='opacity-0 scale-95'
          >
            <div className='bg-confetti-animated flex flex-col justify-center items-center fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 <sm:w-4/5 w-96 px-6 py-4 bg-dark-400/90 rounded-lg shadow-2xl'>
              <p className='mb-1 font-bold text-center'>Are you sure you want to open this box?</p>
              <p className='mb-4'>{effectsTitle[effect]}</p>
              <div className='flex items-center'>
                <Button
                  loading={loading}
                  disabled={loading}
                  className='py-1 mr-1'
                  onClick={async () => {
                    if (!round.attackerUser || !round.defenderUser) {
                      enqueueSnackbar('Make sure both attacker and defender are selected', { variant: 'error' })
                      return
                    }
                    setLoading(true)
                    const a = applyTo === 'attacker' ? round.attackerUser.team.points : round.defenderUser.team.points
                    const b = applyTo === 'attacker' ? round.defenderUser.team.points : round.attackerUser.team.points
                    console.log(a, b)
                    const { aPoints, dPoints } = powercardEffects[effect](a, b)
                    applyEffect &&
                      setAppliedEffect(round.round, {
                        effect,
                        aPointsOld: round.attackerUser.team.points,
                        dPointsOld: round.defenderUser.team.points
                      })
                    applyEffect && (await applyEffect(aPoints, dPoints))
                    setLoading(false)
                    setOpen(false)
                  }}
                >
                  YESH
                </Button>
                <Button className='py-1 ml-1' color='secondary' onClick={() => setOpen(false)}>
                  No
                </Button>
              </div>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  )
}
