import React from 'react'

import { Avatar } from '@/components/Elements'
import { GetTeams_teams, GetTeams_teams_members } from '@/graphql/types/GetTeams'
import { WindiUtilities } from '@/types/windi'
import { constructClassName } from '@/utils'

type MiniUserDetailProps = {
  user: GetTeams_teams_members & { team: GetTeams_teams }
  win: boolean
  utilities?: WindiUtilities
  className?: string
}

export const MiniUserDetail: React.FC<MiniUserDetailProps> = ({ user, win, utilities, className = '' }) => {
  const defaultUtilities: WindiUtilities = {
    flex: 'flex flex-col items-center',
    font: 'font-bold',
    pos: 'relative'
  }
  return (
    <>
      {user.profile ? (
        <>
          <div
            className={constructClassName(
              utilities,
              defaultUtilities,
              `${className} ${win ? 'bg-confetti-animated' : ''}`
            )}
          >
            {win && <p className='text-xs text-true-gray-400 absolute -top-4 left-11'>Winner</p>}
            <div className='flex items-center'>
              <Avatar
                src={user.profile.avatarUrl}
                gender={user.profile.gender}
                name={user.profile.nameEng}
                utilities={{ m: 'mr-1', w: 'w-10', h: 'h-10', p: 'p-1', border: 'rounded-full' }}
              />
              <div className='flex flex-col'>
                <p>{user.username}</p>
                <p className='-mt-1 font-normal text-sm text-true-gray-400'>{user.team.name}</p>
              </div>
            </div>
          </div>
        </>
      ) : (
        user.username
      )}
    </>
  )
}
