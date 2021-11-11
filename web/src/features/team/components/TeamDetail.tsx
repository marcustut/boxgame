import { useMutation } from '@apollo/client'
import { Icon } from '@iconify/react'
import { useSnackbar } from 'notistack'
import React, { useEffect } from 'react'

import { Avatar, Spinner } from '@/components/Elements'
import { cards, Powercard, useFetchTeam } from '@/features/team'
import { UPDATE_TEAM } from '@/graphql'
import { UpdateTeam, UpdateTeamVariables } from '@/graphql/types/UpdateTeam'

type TeamDetailProps = {
  teamId: string
}

export const TeamDetail: React.FC<TeamDetailProps> = ({ teamId }) => {
  const { enqueueSnackbar } = useSnackbar()
  const { team, fetchTeam } = useFetchTeam()
  const [updateTeam] = useMutation<UpdateTeam, UpdateTeamVariables>(UPDATE_TEAM)

  useEffect(() => {
    console.log(teamId)
    fetchTeam(teamId).then(() => console.log('fetched team'))
  }, [fetchTeam, teamId])

  if (!team || !team.data.team) return <Spinner className='text-secondary' />

  return (
    <>
      {team.data.team.members.length > 0 && (
        <>
          <p className='font-bold text-3xl mt-2'>{team.data.team.points} Points</p>
          <h3 className='self-start font-medium text-sm mt-4 mb-1'>Team Members</h3>
          {team.data.team.members.map((member, index) =>
            member.profile ? (
              <div
                key={member.id}
                className={`w-full flex items-center bg-dark-200 px-3 py-2 rounded-lg ${index !== 0 ? 'mt-2' : ''}`}
              >
                <Avatar
                  src={member.profile.avatarUrl}
                  name={member.profile.nameEng}
                  gender={member.profile.gender}
                  utilities={{ w: 'w-8', h: 'h-8', p: 'p-0.5', m: 'mr-2' }}
                />
                <div className='flex flex-col'>
                  <span>{member.profile.nameEng}</span>
                  <span className='text-xs text-true-gray-400'>@{member.username}</span>
                </div>
              </div>
            ) : null
          )}
          <h3 className='self-start font-medium text-sm mt-4 mb-1'>Powercard</h3>
          <p className='self-start text-xs text-true-gray-400'>
            Powercard are special ability that you will be able to use during the final challenge.{' '}
            {!team.data.team.powercard && team.data.team.eligiblePowercards.length !== 0 && (
              <>
                <br /> Choose one if you have not already. Pick wisely, you can only choose once.
              </>
            )}
          </p>
          <div className='flex justify-around mt-4'>
            {!team.data.team.powercard ? (
              team.data.team.eligiblePowercards.length !== 0 ? (
                <div className='flex flex-col'>
                  <div className='flex items-center'>
                    {team.data.team.eligiblePowercards.map((p, idx) => (
                      <Powercard
                        key={p}
                        powercard={p}
                        onClick={async () => {
                          if (!team.data.team) return

                          if (
                            window.confirm(
                              `Are you sure you want to choose 《${cards[p].name}》?\nThere is no turning back`
                            )
                          ) {
                            try {
                              const { data, errors } = await updateTeam({
                                variables: { team_id: team.data.team.id, param: { powercard: p } }
                              })
                              if (errors || !data) {
                                enqueueSnackbar(`Unable to select powercard\n${errors}`, { variant: 'error' })
                                console.error(errors)
                                return
                              }
                              fetchTeam(team.data.team.id)
                              enqueueSnackbar(`Successfully selected ${cards[p].name}`, { variant: 'success' })
                            } catch (err) {
                              enqueueSnackbar(`Unable to select powercard\n${err}`, { variant: 'error' })
                              console.error(err)
                              return
                            }
                          }
                        }}
                        utilities={{ m: idx !== 0 ? 'ml-4' : '' }}
                      />
                    ))}
                  </div>
                  <p className='mt-4 text-sm text-center text-true-gray-400'>
                    Your team can pick one from {team.data.team.eligiblePowercards.length}{' '}
                    {team.data.team.eligiblePowercards.length !== 0 ? 'powercards' : 'powercard'}
                  </p>
                </div>
              ) : (
                <div className='flex items-center'>
                  Sorry, your team is not eligible for any powercards
                  <Icon icon='noto:sad-but-relieved-face' className='ml-2' />
                </div>
              )
            ) : (
              <Powercard powercard={team.data.team.powercard} />
            )}
          </div>
        </>
      )}
    </>
  )
}
