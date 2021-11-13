import { Icon } from '@iconify/react'
import Dayjs from 'dayjs'
import { useSnackbar } from 'notistack'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useEffectOnce } from 'react-use'

import { Spinner } from '@/components/Elements'
import { LoadingPage } from '@/components/Misc'
import { DisableWrapper, Leaderboard, SelectionButton } from '@/features/battleground'
import { BattlegroundSelection } from '@/graphql'
import { useAuth } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { definitions } from '@/types/supabase'

type RoomProps = {
  roomCode: string
}

export const Room: React.FC<RoomProps> = ({ roomCode }) => {
  const { enqueueSnackbar } = useSnackbar()
  const { user } = useAuth()
  const [room, setRoom] = useState<definitions['BattlegroundRoom']>()
  const [currentRound, setCurrentRound] = useState<definitions['BattlegroundRound']>()
  const [lastUpdated, setLastUpdated] = useState<Dayjs.Dayjs>(Dayjs())

  const isMyTurn = useMemo(() => {
    if (!user || !currentRound) return
    return currentRound.attacker === user.user.username || currentRound.defender === user.user.username
  }, [currentRound, user])

  const whoami = useMemo(() => {
    if (!user || !currentRound || !isMyTurn) return
    return currentRound.attacker === user.user.username ? 'attacker' : 'defender'
  }, [currentRound, isMyTurn, user])

  const updateSelection = useCallback(
    async (selection: BattlegroundSelection, type: 'attacker' | 'defender') => {
      if (!currentRound) return
      const params = {
        attackerSelection: type === 'attacker' ? selection : undefined,
        defenderSelection: type === 'defender' ? selection : undefined,
        updatedAt: Dayjs().toISOString()
      }
      const { data, error } = await supabase
        .from<definitions['BattlegroundRound']>('BattlegroundRound')
        .update(params)
        .eq('code', roomCode)
        .eq('round', currentRound.round)
      if (error || !data) {
        console.error(error)
        enqueueSnackbar(`Unable to make selection, ask for help\n${JSON.stringify(error, null, 2)}`, {
          variant: 'error'
        })
        return
      }
      setCurrentRound(data[0])
    },
    [currentRound, enqueueSnackbar, roomCode]
  )

  useEffectOnce(() => {
    if (roomCode.length !== 4) throw new Error('Room Code must be 4 digits')
  })

  useEffectOnce(() => {
    ;(async () => {
      // fetch round
      const { data, error } = await supabase
        .from<definitions['BattlegroundRound']>('BattlegroundRound')
        .select('*')
        .eq('code', roomCode)
      // if error happens while fetching
      if (error || !data) {
        console.error(error)
        enqueueSnackbar(`Something went wrong, ask for help\n${JSON.stringify(error, null, 2)}`, { variant: 'error' })
        return
      }
      if (data.length === 0) throw new Error(`Room with code ${roomCode} does not exist`)
      setCurrentRound([...data].sort((a, b) => b.round - a.round)[0])

      // fetch room
      const { data: room, error: roomErr } = await supabase
        .from<definitions['BattlegroundRoom']>('BattlegroundRoom')
        .select('*')
        .eq('code', roomCode)
      // if error happens while fetching
      if (roomErr || !room) {
        console.error(roomErr)
        enqueueSnackbar(`Something went wrong, ask for help\n${JSON.stringify(roomErr, null, 2)}`, { variant: 'error' })
        return
      }
      if (data.length === 0) throw new Error(`Room with code ${roomCode} does not exist`)
      setRoom(room[0])
    })()
  })

  useEffect(() => {
    if (!currentRound || !room) return
    const roundSubscription = supabase
      .from<definitions['BattlegroundRound']>('BattlegroundRound')
      .on('UPDATE', async payload => {
        // ignore other room's and other round's update
        if (payload.new.code !== roomCode && payload.new.round !== currentRound.round) return
        setCurrentRound(payload.new)
        setLastUpdated(Dayjs(payload.commit_timestamp))
        console.log(`round ${payload.new.round} updated`)
      })
      .on('INSERT', async payload => {
        // ignore other room's update
        if (payload.new.code !== roomCode) return
        // update current round
        setCurrentRound(payload.new)
        setLastUpdated(Dayjs(payload.commit_timestamp))
        console.log(`round ${payload.new.round} inserted`)
      })
      .subscribe()
    const roomSubscription = supabase
      .from<definitions['BattlegroundRoom']>('BattlegroundRoom')
      .on('UPDATE', async payload => {
        if (payload.new.code !== roomCode) return
        setRoom(payload.new)
        console.log(`room ${payload.new.code} updated`)
      })
      .subscribe()
    return () => {
      supabase.removeSubscription(roundSubscription)
      supabase.removeSubscription(roomSubscription)
    }
  }, [currentRound, room, roomCode])

  if (!user) return <LoadingPage />

  return (
    <div className='container p-4 pb-32 mx-auto relative'>
      <div className='flex <sm:flex-col justify-between'>
        <div className='flex flex-col'>
          <h2 className='font-bold text-2xl'>Battleground Room {roomCode}</h2>
          <p className='text-true-gray-400 <sm:text-sm'>
            This is where you will be interacting with the others in the room
          </p>
        </div>
        {currentRound ? (
          <div className='flex items-center <sm:justify-center <sm:mt-4'>
            <div className='text-5xl font-bold'>Round {currentRound.round}</div>
          </div>
        ) : (
          <Spinner className='text-secondary' />
        )}
      </div>

      <div
        className={`w-full mt-8 font-bold text-2xl flex items-center justify-center ${
          isMyTurn ? 'text-red-500' : 'text-yellow-500'
        }`}
      >
        <p>{isMyTurn ? "IT'S YOUR TURN NOW" : 'Not your turn, be patient'}</p>
        <Icon icon={isMyTurn ? 'octicon:stop-16' : 'octicon:stopwatch-16'} className='ml-2' />
      </div>

      {room ? (
        <DisableWrapper disabled={room.status !== 'ONGOING'} message={'Room is not started'}>
          <div className='flex flex-col items-center mt-4'>
            {currentRound ? (
              <div className='flex items-center justify-center mt-8 rounded-lg p-8 <sm:p-4 bg-dark-300/50'>
                {isMyTurn && whoami ? (
                  <>
                    {whoami === 'attacker' ? (
                      !currentRound.attackerSelection ? (
                        <div className='flex flex-col items-center'>
                          <p className='text-center text-true-gray-300'>
                            You are the <strong>Attacker</strong> this round, choose one of the following:
                          </p>
                          <div className='flex <sm:flex-col mt-4'>
                            {Object.values(BattlegroundSelection).map(selection => (
                              <SelectionButton
                                key={selection}
                                selection={selection}
                                onClick={async () => await updateSelection(selection, whoami)}
                              />
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div>You have selected {currentRound.attackerSelection}</div>
                      )
                    ) : !currentRound.defenderSelection ? (
                      <div className='flex flex-col items-center'>
                        <p className='text-center text-true-gray-300'>
                          You are the <strong>Defender</strong> this round, choose one of the following:
                        </p>
                        <div className='flex <sm:flex-col mt-4'>
                          {Object.values(BattlegroundSelection).map(selection => (
                            <SelectionButton
                              key={selection}
                              selection={selection}
                              onClick={async () => await updateSelection(selection, whoami)}
                            />
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div>You have selected {currentRound.defenderSelection}</div>
                    )}
                  </>
                ) : (
                  <div>Not your turn</div>
                )}
              </div>
            ) : (
              <Spinner />
            )}

            {currentRound ? (
              <div className='flex flex-col items-center mt-8 rounded-lg p-8 <sm:p-4 bg-dark-300/50'>
                <div className='flex items-center'>
                  {currentRound.attacker ? (
                    <div className='flex flex-col'>
                      <p className='font-bold text-2xl <sm:text-xl'>{currentRound.attacker}</p>
                      <p className='text-center text-true-gray-400 text-sm <sm:text-xs'>(Attacker)</p>
                    </div>
                  ) : (
                    <div className='flex flex-col'>
                      <div className='flex items-center text-2xl <sm:text-xl'>
                        <p className='font-bold'>not selected</p>
                        <Icon icon='eos-icons:bubble-loading' className='ml-2' />
                      </div>
                      <p className='text-center text-true-gray-400 text-sm <sm:text-xs'>(Attacker)</p>
                    </div>
                  )}
                  <p className='mx-8'>vs</p>
                  {currentRound.defender ? (
                    <div className='flex flex-col'>
                      <p className='font-bold text-2xl <sm:text-xl'>{currentRound.defender}</p>
                      <p className='text-center text-true-gray-400 text-sm <sm:text-xs'>(Defender)</p>
                    </div>
                  ) : (
                    <div className='flex flex-col'>
                      <div className='flex items-center text-2xl <sm:text-xl'>
                        <p className='font-bold'>not selected</p>
                        <Icon icon='eos-icons:bubble-loading' className='ml-2' />
                      </div>
                      <p className='text-center text-true-gray-400 text-sm <sm:text-xs'>(Defender)</p>
                    </div>
                  )}
                </div>
                <p className='mt-6 sm:-mb-2 text-xs text-true-gray-500'>
                  Last Updated: {lastUpdated.format('hh:mm:ss A')}
                </p>
              </div>
            ) : (
              <Spinner />
            )}

            {room ? (
              <Leaderboard
                teamIds={room.teamIds as string[]}
                utilities={{ m: 'mt-8', minW: 'min-w-76', display: 'block', pos: '' }}
              />
            ) : (
              <Spinner />
            )}
          </div>
        </DisableWrapper>
      ) : (
        <Spinner />
      )}
    </div>
  )
}
