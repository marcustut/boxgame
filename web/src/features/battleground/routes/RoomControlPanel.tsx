import { useMutation } from '@apollo/client'
import { Listbox } from '@headlessui/react'
import { Icon } from '@iconify/react'
import Dayjs from 'dayjs'
import { useSnackbar } from 'notistack'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useEffectOnce } from 'react-use'

import { Avatar, Button, Spinner } from '@/components/Elements'
import { LoadingPage } from '@/components/Misc'
import {
  DisableWrapper,
  EffectBox,
  Leaderboard,
  MiniUserDetail,
  PlayerSelect,
  powercardEffects,
  RoomStatusToggler
} from '@/features/battleground'
import { Powercard } from '@/features/team'
import {
  BattlegroundEffect,
  BattlegroundSelection,
  GET_BATTLEGROUND_ROOM,
  GET_TEAMS,
  Powercard as PowercardEnum,
  RoomStatus,
  UPDATE_BATTLEGROUND_ROOM,
  UPDATE_TEAM,
  useQueryWithTypes
} from '@/graphql'
import { GetBattlegroundRoom, GetBattlegroundRoomVariables } from '@/graphql/types/GetBattlegroundRoom'
import { GetTeams, GetTeamsVariables } from '@/graphql/types/GetTeams'
import { UpdateBattlegroundRoom, UpdateBattlegroundRoomVariables } from '@/graphql/types/UpdateBattlegroundRoom'
import { UpdateTeam, UpdateTeamVariables } from '@/graphql/types/UpdateTeam'
import { useBattleground } from '@/hooks/stores'
import { supabase } from '@/lib/supabase'
import { definitions } from '@/types/supabase'

export type RoundJoinedUserQuery = definitions['BattlegroundRound'] & {
  attackerUser: { team: { id: string; points: number } } | null
  defenderUser: { team: { id: string; points: number } } | null
}

export type RoomControlPanelProps = {
  roomCode: string
}

export const roundJoinedUserQuery = `
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
  const { appliedEffects } = useBattleground()
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
  const [winner, setWinner] = useState<'attacker' | 'defender' | 'draw'>()
  const [applyTo, setApplyTo] = useState<'attacker' | 'defender'>('attacker')

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

  const attacker = useMemo(() => {
    if (!currentRound) return
    if (!currentRound.attackerUser) return
    if (teams.length === 0) return
    const attackerUser = currentRound.attackerUser
    const team = teams.find(t => t.id === attackerUser.team.id)
    if (!team) return
    const user = team.members.find(m => m.username === currentRound.attacker)
    if (!user) return
    return { ...user, team }
  }, [currentRound, teams])

  const defender = useMemo(() => {
    if (!currentRound) return
    if (!currentRound.defenderUser) return
    if (teams.length === 0) return
    const defenderUser = currentRound.defenderUser
    const team = teams.find(t => t.id === defenderUser.team.id)
    if (!team) return
    const user = team.members.find(m => m.username === currentRound.defender)
    if (!user) return
    return { ...user, team }
  }, [currentRound, teams])

  const setRounds = useCallback((rounds: RoundJoinedUserQuery[]) => {
    // set all rounds in ascending order
    setAllRounds([...rounds].sort((a, b) => a.round - b.round))
    // set the latest round
    setCurrentRound([...rounds].sort((a, b) => b.round - a.round)[0])
  }, [])

  const checkResult = useCallback(
    (aSelection: BattlegroundSelection, dSelection: BattlegroundSelection) => {
      // draw
      if (aSelection === dSelection) {
        setWinner('draw')
        enqueueSnackbar('DRAW!')
        return
      }
      // king wins (king vs knight)
      if (aSelection === BattlegroundSelection.KING && dSelection === BattlegroundSelection.KNIGHT) {
        setWinner('attacker')
        enqueueSnackbar('Attacker wins!', { variant: 'success' })
        return
      } else if (dSelection === BattlegroundSelection.KING && aSelection === BattlegroundSelection.KNIGHT) {
        setWinner('defender')
        enqueueSnackbar('Defender wins!', { variant: 'success' })
        return
      }
      // knight wins (knight vs witch)
      if (aSelection === BattlegroundSelection.KNIGHT && dSelection === BattlegroundSelection.WITCH) {
        setWinner('attacker')
        enqueueSnackbar('Attacker wins!', { variant: 'success' })
        return
      } else if (dSelection === BattlegroundSelection.KNIGHT && aSelection === BattlegroundSelection.WITCH) {
        setWinner('defender')
        enqueueSnackbar('Defender wins!', { variant: 'success' })
        return
      }
      // witch wins (witch vs king)
      if (aSelection === BattlegroundSelection.WITCH && dSelection === BattlegroundSelection.KING) {
        setWinner('attacker')
        enqueueSnackbar('Attacker wins!', { variant: 'success' })
        return
      } else if (dSelection === BattlegroundSelection.WITCH && aSelection === BattlegroundSelection.KING) {
        setWinner('defender')
        enqueueSnackbar('Defender wins!', { variant: 'success' })
        return
      }
    },
    [enqueueSnackbar]
  )

  const gunaPowercard = useCallback(
    async (powercard: PowercardEnum, round: number) => {
      if (!attacker || !defender) {
        enqueueSnackbar('Attacker or Defender has not been selected yet', { variant: 'error' })
        return
      }

      const ae = appliedEffects[round]

      if (powercard === PowercardEnum.REVERSE) {
        console.log('old :', ae.aPointsOld, ae.dPointsOld)
        const { aPoints, dPoints } = powercardEffects[ae.effect](ae.dPointsOld, ae.aPointsOld)
        console.log('new :', aPoints, dPoints)
        const { data: aTeam, errors: aTeamErr } = await updateTeam({
          variables: {
            team_id: applyTo === 'attacker' ? defender.team.id : attacker.team.id,
            param: { points: aPoints }
          }
        })
        if (aTeamErr || !aTeam) {
          console.error(aTeamErr)
          enqueueSnackbar('Error updating points, contact Kai Yang immediately', { variant: 'error' })
          return
        }
        const { data: dTeam, errors: dTeamErr } = await updateTeam({
          variables: {
            team_id: applyTo === 'attacker' ? attacker.team.id : defender.team.id,
            param: { points: dPoints }
          }
        })
        if (dTeamErr || !dTeam) {
          console.error(dTeamErr)
          enqueueSnackbar('Error updating points, contact Kai Yang immediately', { variant: 'error' })
          return
        }
      } else if (powercard === PowercardEnum.BLOCK) {
        const { data: aTeam, errors: aTeamErr } = await updateTeam({
          variables: {
            team_id: applyTo === 'attacker' ? attacker.team.id : defender.team.id,
            param: { points: ae.aPointsOld }
          }
        })
        if (aTeamErr || !aTeam) {
          console.error(aTeamErr)
          enqueueSnackbar('Error updating points, contact Kai Yang immediately', { variant: 'error' })
          return
        }
        const { data: dTeam, errors: dTeamErr } = await updateTeam({
          variables: {
            team_id: applyTo === 'attacker' ? defender.team.id : attacker.team.id,
            param: { points: ae.dPointsOld }
          }
        })
        if (dTeamErr || !dTeam) {
          console.error(dTeamErr)
          enqueueSnackbar('Error updating points, contact Kai Yang immediately', { variant: 'error' })
          return
        }
      } else {
        const { data, error } = await supabase
          .from<definitions['BattlegroundRound']>('BattlegroundRound')
          .update({ effect: null as unknown as undefined })
          .eq('code', roomCode)
          .eq('round', round)
        if (error || !data) {
          console.error(error)
          enqueueSnackbar('Error using ONE MORE CHANCE, contact Kai Yang immediately', { variant: 'error' })
          return
        }
      }

      enqueueSnackbar('Powercard used successfully', { variant: 'success' })
    },
    [appliedEffects, applyTo, attacker, defender, enqueueSnackbar, roomCode, updateTeam]
  )

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
  }, [allRounds, currentRound, enqueueSnackbar, roomCode, setRounds])

  if (error || allTeamsErr) {
    console.error(error)
    console.error(allTeamsErr)
    return <div className='flex justify-center items-center h-[100vh]'>Some error occured, refresh again.</div>
  }
  if (!room || !allTeams) return <LoadingPage />

  console.log(applyTo)

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
                    applyTo={applyTo}
                    applyEffect={async (aPoints, dPoints) => {
                      // if (currentRound.effect) {
                      //   enqueueSnackbar('Already opened a box this round, go next round!', { variant: 'warning' })
                      //   return
                      // }
                      // make sure both are selected
                      if (!currentRound.attackerUser || !currentRound.defenderUser) {
                        enqueueSnackbar('Make sure both attacker and defender are selected', { variant: 'error' })
                        return
                      }
                      console.log('attacker', aPoints)
                      console.log('defender', dPoints)
                      // only update is there's a difference
                      const { data, errors } = await updateTeam({
                        variables: {
                          team_id:
                            applyTo === 'attacker'
                              ? currentRound.attackerUser.team.id
                              : currentRound.defenderUser.team.id,
                          param: { points: aPoints }
                        }
                      })
                      if (errors || !data) {
                        console.error(errors)
                        enqueueSnackbar("Error updating attacker's points, refresh and try again", {
                          variant: 'error'
                        })
                        return
                      }
                      // only update if there's a difference
                      const { data: d, errors: err } = await updateTeam({
                        variables: {
                          team_id:
                            applyTo === 'attacker'
                              ? currentRound.defenderUser.team.id
                              : currentRound.attackerUser.team.id,
                          param: { points: dPoints }
                        }
                      })
                      if (err || !d) {
                        console.error(err)
                        enqueueSnackbar("Error updating defender's points, refresh and try again", {
                          variant: 'error'
                        })
                        return
                      }
                      // update effect
                      const { data: d3, error: err3 } = await supabase
                        .from<RoundJoinedUserQuery>('BattlegroundRound')
                        .update({ effect: box.effect })
                        .eq('code', roomCode)
                        .eq('round', currentRound.round)
                        .select(roundJoinedUserQuery)
                      if (err3 || !d3) {
                        console.error(err3)
                        enqueueSnackbar(`Unable to apply box effect, ask for help\n${JSON.stringify(error, null, 2)}`, {
                          variant: 'error'
                        })
                        return
                      }
                      setAllRounds(allRounds.map(r => (r.round === d3[0].round ? d3[0] : r)))
                      setCurrentRound(d3[0])
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

        <div className='w-full mx-auto mt-8'>
          <p className='text-sm mb-2'>Apply to:</p>
          <Listbox value={applyTo} onChange={value => setApplyTo(value)} as='div' className='flex flex-col'>
            <Listbox.Button
              data-blobity-magnetic='false'
              className='relative flex justify-between items-center py-2 px-3 text-left text-true-gray-200 bg-dark-300 rounded-lg shadow-md text-sm hover:focus:ring-2 hover:focus:ring-secondary-ring'
            >
              <span className='block truncate'>{applyTo ? `${applyTo}` : 'not selected'}</span>
              <Icon icon='heroicons-solid:selector' className='ml-4' />
            </Listbox.Button>
            <Listbox.Options className='w-full bg-dark-300/50 rounded-lg mt-3 px-2 py-2' as='div'>
              {['attacker', 'defender'].map((v, i) => (
                <Listbox.Option
                  key={v}
                  value={v}
                  className={`flex items-center list-none text-sm px-2 py-2 rounded-md hover:bg-secondary ${
                    i !== 0 ? 'mt-1' : ''
                  }`}
                >
                  {v}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Listbox>
        </div>

        {currentRound ? (
          <DisableWrapper disabled={!isOngoing} message='Room is not started!'>
            <div className={`my-8 px-6 py-4 rounded-lg bg-dark-50/50 flex`}>
              <div className='flex flex-col justify-center items-center'>
                <div className='flex items-center'>
                  <div className='flex flex-col items-center self-center'>
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
                  <div className='flex flex-col items-center ml-4 self-center'>
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
                </div>
                <div className='flex items-center'>
                  <Button
                    className='mt-4 mr-1 px-3 py-2 text-sm font-medium'
                    onClick={async () => {
                      const { data, error } = await supabase
                        .from<RoundJoinedUserQuery>('BattlegroundRound')
                        .select(roundJoinedUserQuery)
                        .eq('code', currentRound.code)
                        .eq('round', currentRound.round)
                      if (error || !data) {
                        console.error(error)
                        enqueueSnackbar(`Something went wrong, ask for help\n${JSON.stringify(error, null, 2)}`, {
                          variant: 'error'
                        })
                        return
                      }
                      // check if both has selected
                      if (!data[0].attackerSelection || !data[0].defenderSelection) {
                        enqueueSnackbar('Not both has selected yet', { variant: 'warning' })
                        return
                      }
                      checkResult(
                        data[0].attackerSelection as BattlegroundSelection,
                        data[0].defenderSelection as BattlegroundSelection
                      )
                    }}
                  >
                    Check Result
                  </Button>
                  <Button
                    className='mt-4 ml-1 px-3 py-2 text-sm font-medium'
                    // disabled={}
                    color='secondary'
                    onClick={async () => {
                      const { data, error } = await supabase
                        .from<RoundJoinedUserQuery>('BattlegroundRound')
                        .update({
                          attackerSelection: null as unknown as undefined,
                          defenderSelection: null as unknown as undefined
                        })
                        .eq('code', currentRound.code)
                        .eq('round', currentRound.round)
                      if (error || !data) {
                        console.error(error)
                        enqueueSnackbar(`Something went wrong, ask for help\n${JSON.stringify(error, null, 2)}`, {
                          variant: 'error'
                        })
                        return
                      }
                      enqueueSnackbar('Successfully reset selection', { variant: 'success' })
                    }}
                  >
                    Reset Selection
                  </Button>
                </div>
              </div>
              <div className='mx-auto flex justify-center items-center'>
                {/* Replace with the one below */}
                {attacker && attacker.team.powercard ? (
                  <DisableWrapper disabled={!currentRound.effect} message={'Must first open a box'} fontSize={12}>
                    <Powercard
                      powercard={attacker.team.powercard}
                      magnetic={false}
                      disabled={!currentRound.effect ? true : false}
                      utilities={{
                        w: '',
                        p: 'p-2',
                        bg: `bg-dark-50/50 hover:bg-secondary`
                      }}
                      onClick={async ({ name }) => {
                        if (!defender) return
                        if (!currentRound.effect) return
                        if (!attacker.team.powercard) return
                        const confirmed = window.confirm(
                          `Are you sure you want to use ${name}?\nNOTE: You can only use it once.`
                        )
                        if (!confirmed) return

                        if (!(currentRound.round in appliedEffects)) {
                          enqueueSnackbar(`Something wrong when applying effect, contact Kai Yang immediately`, {
                            variant: 'error'
                          })
                          return
                        }

                        await gunaPowercard(attacker.team.powercard, currentRound.round)
                      }}
                      render={({ img, name }) => (
                        <>
                          <img src={img} alt={name} className='w-full h-32' />
                          <p className='mt-1 -mb-1 text-sm text-true-gray-300 font-medium'>{name}</p>
                        </>
                      )}
                    />
                  </DisableWrapper>
                ) : (
                  <p className='text-true-gray-400'>no powercard</p>
                )}
              </div>
              <div className='flex justify-center items-center px-8 rounded-md bg-dark-50/50'>
                <div className='mr-8'>
                  {attacker ? <MiniUserDetail win={winner === 'attacker'} user={attacker} /> : 'not selected'}
                </div>
                <span className='text-true-gray-400'>vs</span>
                <div className='ml-8'>
                  {defender ? <MiniUserDetail win={winner === 'defender'} user={defender} /> : 'not selected'}
                </div>
              </div>
              <div className='mx-auto flex justify-center items-center'>
                {defender && defender.team.powercard ? (
                  <DisableWrapper disabled={!currentRound.effect} message={'Must first open a box'} fontSize={12}>
                    <Powercard
                      powercard={defender.team.powercard}
                      magnetic={false}
                      disabled={!currentRound.effect ? true : false}
                      utilities={{
                        w: '',
                        p: 'p-2',
                        bg: `bg-dark-50/50 hover:bg-secondary`
                      }}
                      onClick={async ({ name }) => {
                        if (!defender) return
                        if (!currentRound.effect) return
                        if (!defender.team.powercard) return
                        const confirmed = window.confirm(
                          `Are you sure you want to use ${name}?\nNOTE: You can only use it once.`
                        )
                        if (!confirmed) return

                        if (!(currentRound.round in appliedEffects)) {
                          enqueueSnackbar(`Something wrong when applying effect, contact Kai Yang immediately`, {
                            variant: 'error'
                          })
                          return
                        }

                        await gunaPowercard(defender.team.powercard, currentRound.round)
                      }}
                      render={({ img, name }) => (
                        <>
                          <img src={img} alt={name} className='w-full h-32' />
                          <p className='mt-1 -mb-1 text-sm text-true-gray-300 font-medium'>{name}</p>
                        </>
                      )}
                    />
                  </DisableWrapper>
                ) : (
                  <p className='text-true-gray-400'>no powercard</p>
                )}
              </div>
              <p className='self-center text-2xl font-bold'>Round {currentRound.round}</p>
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
