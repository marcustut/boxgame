import React, { useEffect, useMemo, useState } from 'react'
import { useEffectOnce, useInterval, usePrevious } from 'react-use'
import { useQuery } from '@apollo/client'
import { Dialog } from '@headlessui/react'
import { Badge } from '@mui/material'
import { Icon } from '@iconify/react'

import { useRiddle } from '@/hooks/stores/useRiddle'
import { Layout, Lightbulb } from '@/features/register'
import { GET_REGISTERED_USER_COUNT, GetUserCount } from '@/graphql'
import { Button } from '@/components/Elements'
import { supabase } from '@/lib/supabase'
import { definitions } from '@/types/supabase'
import { getRandomInts } from '@/utils'
import { bulbColors } from '@/lib/constant'

type LightState = Record<number, boolean>

enum GameState {
  NOTSTARTED = 'NOTSTARTED',
  WIN = 'WIN',
  LOST = 'LOST'
}

const COUNTDOWN_TIME = 120

export const Riddle: React.FC = () => {
  const { setTimeUsed, setCompleted } = useRiddle()
  const { loading, error, data, refetch } = useQuery<GetUserCount>(GET_REGISTERED_USER_COUNT)
  const [sequenceLength] = useState<number>(6)
  const [lightState, setLightState] = useState<LightState>({ 0: false, 1: false, 2: false, 3: false })
  const prevLightState = usePrevious(lightState)
  const [answer, setAnswer] = useState<number[]>([])
  const [lightOpen, setLightOpen] = useState<number>(-1)
  const [dancing, setDancing] = useState<boolean>(false)
  const [guideRead, setGuideRead] = useState<boolean>(false)
  const [guideOpen, setGuideOpen] = useState<boolean>(true)
  const [resultDialogOpen, setResultDialogOpen] = useState<boolean>(false)
  const [cooldownTimer, setCooldownTimer] = useState<number>(0)
  const [gameState, setGameState] = useState<GameState>(GameState.NOTSTARTED)
  const [gameTimer, setGameTimer] = useState<number>(0)
  const [gameStart, setGameStart] = useState<boolean>(false)

  const lightSequence = useMemo(
    () => getRandomInts({ min: 0, max: 3 }, sequenceLength, { nonRepeat: true }),
    [sequenceLength]
  )
  const wireLengths = useMemo(() => getRandomInts({ min: 200, max: 400 }, 4, { nonRepeat: true }), [])
  const randomBulbColors = useMemo(() => bulbColors.sort(() => 0.5 - Math.random()), [])

  useEffectOnce(() => {
    const userSubscription = supabase
      .from<definitions['User']>('User')
      .on('INSERT', () => refetch())
      .subscribe()
    return () => {
      supabase.removeSubscription(userSubscription)
    }
  })

  // useEffect(() => {
  //   if (timeUsed && completed) window.location.href = '/register'
  // }, [timeUsed, completed])

  useEffect(() => {
    if (gameStart && prevLightState) {
      Object.values(lightState).forEach((v, i) => {
        if (v && Object.values(prevLightState)[i] !== v) setAnswer([...answer, i])
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightState])

  useEffect(() => {
    if (gameStart && answer.length === sequenceLength) {
      setGameStart(false)
      if (JSON.stringify(answer) === JSON.stringify(lightSequence)) {
        setResultDialogOpen(true)
        setGameState(GameState.WIN)
        setTimeUsed(gameTimer)
        setCompleted(true)
      } else {
        setResultDialogOpen(true)
        setGameState(GameState.LOST)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameStart, answer])

  useEffect(() => {
    if (gameStart) {
      setGameTimer(0)
      setCooldownTimer(COUNTDOWN_TIME)
    }
  }, [gameStart])

  useInterval(() => setGameTimer(gameTimer + 1), gameStart ? 1000 : null)
  useInterval(
    () => cooldownTimer > 0 && setCooldownTimer(cooldownTimer - 1),
    !gameStart && gameState === GameState.LOST ? 1000 : null
  )

  return (
    <>
      <Layout applyRootStyle={false} helmetProps={{ title: 'Riddle' }}>
        <div className='h-[100vh] flex flex-col font-mono'>
          <div className='flex justify-center'>
            {Array.from(Array(4).keys()).map((v, i) => (
              <Lightbulb
                key={v}
                button
                animate
                wire
                wireLength={`${wireLengths[i]}px`}
                glow={lightState[i]}
                bulbColor={randomBulbColors[i]}
                glowColor={randomBulbColors[i]}
                onClick={() => {
                  // when light opened and clicked other light
                  if (lightOpen !== -1 && lightOpen !== i) {
                    setLightState({ ...lightState, [lightOpen]: false, [i]: true })
                    setLightOpen(i)
                  }
                  // when no light open
                  if (lightOpen === -1) {
                    setLightOpen(i)
                    setLightState({ ...lightState, [i]: true })
                    return
                  }
                  // when clicked light is opened
                  if (lightOpen === i) {
                    setLightOpen(-1)
                    setLightState({ ...lightState, [i]: false })
                    return
                  }
                }}
                style={{ marginLeft: i !== 0 ? '35px' : '' }}
              />
            ))}
          </div>
          <div className='flex flex-col mt-auto px-4 pb-4'>
            <div className='self-end'>
              <Badge color='secondary' variant='dot' invisible={guideRead}>
                <Icon
                  icon='carbon:help-filled'
                  className='w-8 h-8 text-dark-50'
                  onClick={() => {
                    setGuideRead(true)
                    setGuideOpen(true)
                  }}
                />
              </Badge>
            </div>
            <Button
              className='my-2'
              color='primary'
              loading={dancing}
              disabled={dancing || gameStart || cooldownTimer !== 0}
              onClick={async () => {
                setDancing(true)
                for (let i = 0; i < lightSequence.length; i++) {
                  console.log(lightSequence[i])
                  setLightState({ ...lightState, [lightSequence[i]]: true })
                  await new Promise(r => setTimeout(r, 1000))
                }
                setLightState({ 0: false, 1: false, 2: false, 3: false })
                setDancing(false)
              }}
            >
              Dance 💃🏻
            </Button>
            <Button
              className='my-2'
              color='secondary'
              loading={gameStart}
              disabled={gameStart || dancing || cooldownTimer !== 0}
              onClick={() => {
                if (cooldownTimer === 0) setGameStart(true)
              }}
            >
              Start
            </Button>
            <div className='flex justify-between items-center'>
              {!loading && !error && data && data.userCount && (
                <div className='font-bold text-2xl text-secondary'>
                  {data.userCount}
                  <span className='text-sm text-true-gray-500'> seats remaining</span>
                </div>
              )}
              {gameStart && gameTimer ? (
                <div className='font-bold text-2xl text-secondary'>
                  {gameTimer}
                  <span className='text-sm text-true-gray-500 ml-2'>seconds</span>
                </div>
              ) : gameState === GameState.LOST ? (
                <div className='font-bold text-2xl text-secondary'>
                  {cooldownTimer}
                  <span className='text-sm text-true-gray-500 ml-2'>seconds</span>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </Layout>
      <Dialog open={guideOpen} onClose={() => setGuideOpen(false)}>
        <Dialog.Overlay className='inset-0 transition ease-in-out duration-200 fixed backdrop-filter backdrop-blur-sm backdrop-brightness-75' />

        <div className='font-mono z-10 <sm:w-[95%] bg-dark-300 flex-col rounded-lg text-word-active-light p-8 transform transition top-[50%] ease-in-out left-[50%] shadow-2xl w-96 translate-x-[-50%] translate-y-[-50%] duration-200 fixed items-center ronded-2xl dark: flex dark:bg-dark-shade2 dark:text-word-active-dark'>
          <div className='font-bold text-xl'>Dance with the Light</div>
          <div className='mt-2 flex flex-col self-start text-xs text-true-gray-400'>
            <p>1️⃣ Click 'Dance' to see the light dance</p>
            <p className='mt-1'>2️⃣ After you've remembered the move, click 'Start'</p>
            <p className='mt-1'>3️⃣ Click on the light bulb to dance with the light!</p>
            <p className='mt-4 font-bold text-sm'>NOTE💡</p>
            <p className='mt-1'>-There will be a 2 minute cooldown🕐 on each trial</p>
            <p className='mt-1'>-This game must be solved before registering</p>
          </div>
          <Button className='mt-4 text-xs' size='small' onClick={() => setGuideOpen(false)}>
            Close
          </Button>
        </div>
      </Dialog>
      <Dialog open={resultDialogOpen} onClose={() => setResultDialogOpen(false)}>
        <Dialog.Overlay className='inset-0 transition ease-in-out duration-200 fixed backdrop-filter backdrop-blur-sm backdrop-brightness-75' />

        <div className='font-mono z-10 <sm:w-[95%] bg-dark-300 flex-col rounded-lg text-word-active-light p-8 transform transition top-[50%] ease-in-out left-[50%] shadow-2xl w-96 translate-x-[-50%] translate-y-[-50%] duration-200 fixed items-center ronded-2xl dark: flex dark:bg-dark-shade2 dark:text-word-active-dark'>
          {gameState === GameState.WIN ? (
            <Icon icon='emojione:confetti-ball' className='w-12 h-12' />
          ) : (
            <Icon icon='emojione:crying-face' className='w-12 h-12' />
          )}
          <div className='font-bold mt-4 text-lg text-center leading-tight whitespace-pre-wrap'>
            {gameState === GameState.WIN
              ? 'Congratulations! You won the game'
              : 'Sorry, you lost.\n2 minutes cooldown starts now'}
          </div>
          <Button
            className='mt-4 text-xs w-full'
            size='small'
            onClick={() => {
              setLightState({ 0: false, 1: false, 2: false, 4: false })
              setAnswer([])
              setResultDialogOpen(false)
            }}
          >
            Try again <Icon icon='mdi:refresh' className='ml-1' />
          </Button>
          {gameState === GameState.WIN && (
            <Button
              color='secondary'
              className='mt-2 text-xs w-full'
              size='small'
              onClick={() => (window.location.href = '/register')}
            >
              Proceed to Registration <Icon icon='emojione:clipboard' className='ml-2' />
            </Button>
          )}
        </div>
      </Dialog>
    </>
  )
}
