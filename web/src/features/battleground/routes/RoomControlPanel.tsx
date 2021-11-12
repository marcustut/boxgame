import { useMutation } from '@apollo/client'
import { Listbox } from '@headlessui/react'
import { Icon } from '@iconify/react'
import Dayjs from 'dayjs'
import { useSnackbar } from 'notistack'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useEffectOnce } from 'react-use'

import { Avatar, Button, Spinner } from '@/components/Elements'
import { LoadingPage } from '@/components/Misc'
import { DisableWrapper, EffectBox, Leaderboard, PlayerSelect, RoomStatusToggler } from '@/features/battleground'
import {
  BattlegroundEffect,
  GET_BATTLEGROUND_ROOM,
  GET_TEAMS,
  RoomStatus,
  UPDATE_BATTLEGROUND_ROOM,
  UPDATE_TEAM,
  useQueryWithTypes
} from '@/graphql'
import { GetBattlegroundRoom, GetBattlegroundRoomVariables } from '@/graphql/types/GetBattlegroundRoom'
import { GetTeams, GetTeamsVariables } from '@/graphql/types/GetTeams'
import { UpdateBattlegroundRoom, UpdateBattlegroundRoomVariables } from '@/graphql/types/UpdateBattlegroundRoom'
import { UpdateTeam, UpdateTeamVariables } from '@/graphql/types/UpdateTeam'
import { supabase } from '@/lib/supabase'
import { definitions } from '@/types/supabase'

export type RoundJoinedUserQuery = definitions['BattlegroundRound'] & {
  attackerUser: { team: { id: string; points: number } } | null
  defenderUser: { team: { id: string; points: number } } | null
}

type RoomControlPanelProps = {
  roomCode: string
}

const roundJoinedUserQuery = `
  *,
  attackerUser:User!attacker (
    team:Team!teamId (
      id,
      points
    )
  ),
  defenderUser:User!defender (
    team:Team!teamId (
      id,
      points
    )
  )
`

export const RoomControlPanel: React.FC<RoomControlPanelProps> = ({ roomCode }) => {
  const { enqueueSnackbar } = useSnackbar()
  const [updateTeam] = useMutation<UpdateTeam, UpdateTeamVariables>(UPDATE_TEAM)
  const [updateBattlegroundRoom] = useMutation<UpdateBattlegroundRoom, UpdateBattlegroundRoomVariables>(
    UPDATE_BATTLEGROUND_ROOM
  )
  const {
    data: room,
    error,
    refetch
  } = useQueryWithTypes<GetBattlegroundRoom, GetBattlegroundRoomVariables>(GET_BATTLEGROUND_ROOM, {
    variables: { code: roomCode }
  })
  const { data: allTeams, error: allTeamsErr } = useQueryWithTypes<GetTeams, GetTeamsVariables>(GET_TEAMS, {
    variables: { page: { limit: 50, offset: 0 } }
  })
  const [nextRoundLoading, setNextRoundLoading] = useState<boolean>(false)
  const [allRounds, setAllRounds] = useState<RoundJoinedUserQuery[]>([])
  const [currentRound, setCurrentRound] = useState<RoundJoinedUserQuery>()

  const isOngoing = useMemo(() => room && room.battlegroundRoom.status === RoomStatus.ONGOING, [room])

  const teams = useMemo(() => {
    if (!allTeams) return []
    if (!room) return []
    return allTeams.teams.filter(t => room.battlegroundRoom.teamIds.includes(t.id))
  }, [allTeams, room])

  const availableBoxes = useMemo(
    () =>
      Object.values(BattlegroundEffect).map(e => {
        if (allRounds.find(r => r.effect === e)) {
          return { effect: e, selected: true }
        }
        return { effect: e, selected: false }
      }),
    [allRounds]
  )

  const setRounds = useCallback((rounds: RoundJoinedUserQuery[]) => {
    // set all rounds in ascending order
    setAllRounds([...rounds].sort((a, b) => a.round - b.round))
    // set the latest round
    setCurrentRound([...rounds].sort((a, b) => b.round - a.round)[0])
  }, [])

  useEffectOnce(() => {
    if (roomCode.length !== 4) throw new Error('Room Code must be 4 digits')
  })

  useEffectOnce(() => {
    ;(async () => {
      // fetch round
      const { data, error } = await supabase
        .from<RoundJoinedUserQuery>('BattlegroundRound')
        .select(roundJoinedUserQuery)
        .eq('code', roomCode)
      // if error happens while fetching
      if (error || !data) {
        console.error(error)
        enqueueSnackbar(`Something went wrong, ask for help\n${JSON.stringify(error, null, 2)}`, { variant: 'error' })
        return
      }
      // if empty result then create one
      if (data.length === 0) {
        const { data, error } = await supabase
          .from<RoundJoinedUserQuery>('BattlegroundRound')
          .insert({
            code: roomCode,
            round: 1,
            updatedAt: Dayjs().toISOString()
          })
          .select(roundJoinedUserQuery)
        if (error || !data) {
          console.error(error)
          enqueueSnackbar(`Something went wrong, ask for help\n${JSON.stringify(error, null, 2)}`, { variant: 'error' })
          return
        }
        console.log('created round 1', data)
        setRounds(data)
      } else {
        console.log('initialized rounds', data)
        setRounds(data)
      }
    })()
  })

  useEffect(() => {
    if (!currentRound) return
    const roundSubscription = supabase
      .from<definitions['BattlegroundRound']>('BattlegroundRound')
      .on('UPDATE', async payload => {
        // ignore other room's and other round's update
        if (payload.new.code !== roomCode && payload.new.round !== currentRound.round) return
        // fetch round
        const { data, error } = await supabase
          .from<RoundJoinedUserQuery>('BattlegroundRound')
          .select(roundJoinedUserQuery)
          .eq('code', roomCode)
          .eq('round', currentRound.round)
        // if error happens while fetching
        if (error || !data) {
          console.error(error)
          enqueueSnackbar(`Something went wrong, ask for help\n${JSON.stringify(error, null, 2)}`, { variant: 'error' })
          return
        }
        // update current round
        setAllRounds(allRounds.map(r => (r.round === data[0].round ? data[0] : r)))
        setCurrentRound(data[0])
        console.log(`round ${payload.new.round} updated`)
      })
      .on('INSERT', async payload => {
        // ignore other room's update
        if (payload.new.code !== roomCode) return
        // fetch round
        const { data, error } = await supabase
          .from<RoundJoinedUserQuery>('BattlegroundRound')
          .select(roundJoinedUserQuery)
          .eq('code', roomCode)
        // if error happens while fetching
        if (error || !data) {
          console.error(error)
          enqueueSnackbar(`Something went wrong, ask for help\n${JSON.stringify(error, null, 2)}`, { variant: 'error' })
          return
        }
        // update current round
        setRounds(data)
        console.log(`round ${payload.new.round} inserted`)
      })
      .subscribe()
    return () => {
      supabase.removeSubscription(roundSubscription)
    }
  }, [roomCode, currentRound, setRounds, allRounds, enqueueSnackbar])

  if (error || allTeamsErr) {
    console.error(error)
    console.error(allTeamsErr)
    return <div className='flex justify-center items-center h-[100vh]'>Some error occured, refresh again.</div>
  }
  if (!room || !allTeams) return <LoadingPage />

  return (
    <>
      <div className='container p-4 mx-auto relative'>
        <div className='flex justify-between'>
          <div className='flex flex-col'>
            <h2 className='font-bold text-2xl'>Battleground Room {roomCode}</h2>
            <p className='text-true-gray-400'>This is where 守护者 can manage the battleground room</p>
          </div>
          {currentRound ? (
            <div className='flex items-center'>
              <div className='text-5xl font-bold'>Round {currentRound.round}</div>
            </div>
          ) : (
            <Spinner className='text-secondary' />
          )}
        </div>

        <div className='flex items-center mt-4'>
          <Leaderboard
            teamIds={room.battlegroundRoom.teamIds}
            utilities={{ minW: 'min-w-76', display: 'block', pos: '' }}
          />
          {currentRound ? (
            <DisableWrapper
              disabled={!isOngoing || !currentRound.attacker || !currentRound.defender}
              message={!isOngoing ? 'Room is not started!' : 'Attacker and Defender must be selected first'}
              utilities={{ m: 'ml-3' }}
            >
              <div className='grid grid-cols-4 gap-3 w-full ml-3'>
                {availableBoxes.map((box, idx) => (
                  <EffectBox
                    key={box.effect}
                    round={currentRound}
                    effect={box.effect}
                    opened={box.selected}
                    applyEffect={async (aPoints, dPoints) => {
                      if (currentRound.effect) {
                        enqueueSnackbar('Already opened a box this round, go next round!', { variant: 'warning' })
                        return
                      }
                      // make sure both are selected
                      if (!currentRound.attackerUser || !currentRound.defenderUser) {
                        enqueueSnackbar('Make sure both attacker and defender are selected', { variant: 'error' })
                        return
                      }
                      // only update is there's a difference
                      if (currentRound.attackerUser.team.points !== aPoints) {
                        const { data, errors } = await updateTeam({
                          variables: { team_id: currentRound.attackerUser.team.id, param: { points: aPoints } }
                        })
                        if (errors || !data) {
                          console.error(errors)
                          enqueueSnackbar("Error updating attacker's points, refresh and try again", {
                            variant: 'error'
                          })
                          return
                        }
                      }
                      // only update is there's a difference
                      if (currentRound.defenderUser.team.points !== dPoints) {
                        const { data, errors } = await updateTeam({
                          variables: { team_id: currentRound.defenderUser.team.id, param: { points: dPoints } }
                        })
                        if (errors || !data) {
                          console.error(errors)
                          enqueueSnackbar("Error updating defender's points, refresh and try again", {
                            variant: 'error'
                          })
                          return
                        }
                      }
                      // update effect
                      const { data, error } = await supabase
                        .from<RoundJoinedUserQuery>('BattlegroundRound')
                        .update({ effect: box.effect })
                        .eq('code', roomCode)
                        .eq('round', currentRound.round)
                        .select(roundJoinedUserQuery)
                      if (error || !data) {
                        console.error(error)
                        enqueueSnackbar(`Unable to apply box effect, ask for help\n${JSON.stringify(error, null, 2)}`, {
                          variant: 'error'
                        })
                        return
                      }
                      setAllRounds(allRounds.map(r => (r.round === data[0].round ? data[0] : r)))
                      setCurrentRound(data[0])
                      enqueueSnackbar(`Successfully applied Box ${idx + 1} effect`, { variant: 'success' })
                    }}
                    id={idx + 1}
                  />
                ))}
              </div>
            </DisableWrapper>
          ) : (
            <Spinner />
          )}
        </div>

        {currentRound ? (
          <DisableWrapper disabled={!isOngoing} message='Room is not started!'>
            <div className={`my-8 px-6 py-4 rounded-lg bg-dark-50/50 flex`}>
              <div className='flex flex-col items-center'>
                <p className='mb-1 font-bold text-true-gray-200'>Attacker</p>
                <PlayerSelect
                  value={currentRound.attacker}
                  onChange={async attacker => {
                    const { data, error } = await supabase
                      .from<RoundJoinedUserQuery>('BattlegroundRound')
                      .update({ attacker })
                      .eq('code', currentRound.code)
                      .eq('round', currentRound.round)
                      .select(roundJoinedUserQuery)
                    if (error || !data) {
                      console.error(error)
                      enqueueSnackbar(`Something went wrong, ask for help\n${JSON.stringify(error, null, 2)}`, {
                        variant: 'error'
                      })
                      return
                    }
                    setAllRounds(allRounds.map(r => (r.round === data[0].round ? data[0] : r)))
                    setCurrentRound(data[0])
                    enqueueSnackbar('Successfully selected attacker', { variant: 'success' })
                  }}
                  teams={teams}
                />
              </div>
              <div className='flex flex-col items-center ml-4'>
                <p className='mb-1 font-bold text-true-gray-200'>Defender</p>
                <PlayerSelect
                  value={currentRound.defender}
                  onChange={async defender => {
                    const { data, error } = await supabase
                      .from<RoundJoinedUserQuery>('BattlegroundRound')
                      .update({ defender })
                      .eq('code', currentRound.code)
                      .eq('round', currentRound.round)
                      .select(roundJoinedUserQuery)
                    if (error || !data) {
                      console.error(error)
                      enqueueSnackbar(`Something went wrong, ask for help\n${JSON.stringify(error, null, 2)}`, {
                        variant: 'error'
                      })
                      return
                    }
                    setAllRounds(allRounds.map(r => (r.round === data[0].round ? data[0] : r)))
                    setCurrentRound(data[0])
                    enqueueSnackbar('Successfully selected defender', { variant: 'success' })
                  }}
                  teams={teams}
                />
              </div>
              <div className='flex justify-center items-center mx-auto'>
                <div className='mx-4 font-bold'>{currentRound.attacker ? currentRound.attacker : 'not selected'}</div>
                <span className='text-true-gray-400'>vs</span>
                <div className='mx-4 font-bold'>{currentRound.defender ? currentRound.defender : 'not selected'}</div>
              </div>
              <p className='mt-4 text-2xl font-bold'>Round {currentRound.round}</p>
            </div>
          </DisableWrapper>
        ) : (
          <Spinner />
        )}

        {currentRound ? (
          <div className='mt-8 flex flex-col'>
            <Button
              loading={nextRoundLoading}
              disabled={nextRoundLoading || !currentRound.effect}
              className='w-full mb-4'
              onClick={async () => {
                setNextRoundLoading(true)
                const { data, error } = await supabase
                  .from<RoundJoinedUserQuery>('BattlegroundRound')
                  .insert({
                    code: roomCode,
                    round: currentRound.round + 1,
                    updatedAt: Dayjs().toISOString()
                  })
                  .select(roundJoinedUserQuery)
                if (error || !data) {
                  console.error(error)
                  enqueueSnackbar(`Unable to go next round, ask for help\n${JSON.stringify(error, null, 2)}`, {
                    variant: 'error'
                  })
                  return
                }
                setAllRounds(allRounds.map(r => (r.round === data[0].round ? data[0] : r)))
                setCurrentRound(data[0])
                setNextRoundLoading(false)
                enqueueSnackbar(`Successfully reached round ${currentRound.round}`, { variant: 'success' })
              }}
            >
              Next Round
            </Button>
            <RoomStatusToggler
              roomCode={roomCode}
              currentStatus={room.battlegroundRoom.status}
              updateBattlegroundRoom={updateBattlegroundRoom}
              fetchBattlegroundRoom={refetch}
            />
          </div>
        ) : (
          <Spinner />
        )}
        {/* <pre>{JSON.stringify(allRounds, null, 2)}</pre>
        <pre>{JSON.stringify(currentRound, null, 2)}</pre> */}
      </div>
    </>
  )
}
