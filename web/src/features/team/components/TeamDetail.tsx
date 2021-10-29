import React, { useEffect } from 'react'

import { Avatar, Spinner } from '@/components/Elements'
import { useFetchTeam } from '@/features/team'

type TeamDetailProps = {
  teamId: string
}

export const TeamDetail: React.FC<TeamDetailProps> = ({ teamId }) => {
  const { team, fetchTeam } = useFetchTeam()

  useEffect(() => {
    console.log(teamId)
    fetchTeam(teamId).then(() => console.log('fetched team'))
  }, [fetchTeam, teamId])

  if (!team || !team.data.team) return <Spinner className='text-secondary' />

  return (
    <>
      {team.data.team.members.length > 0 && (
        <>
          <h3 className='self-start font-medium text-sm mb-1'>Team Members</h3>
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
        </>
      )}
      <span className='font-medium text-true-gray-500'></span>
    </>
  )
}
