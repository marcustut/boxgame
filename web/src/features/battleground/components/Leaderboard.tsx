import { Icon } from '@iconify/react'
import Dayjs from 'dayjs'
import React, { useEffect, useState } from 'react'

import { LoadingPage } from '@/components/Misc'
import { GET_TEAMS_WITHOUT_MEMBERS, useQueryWithTypes } from '@/graphql'
import { GetTeamsWithoutMembers, GetTeamsWithoutMembersVariables } from '@/graphql/types/GetTeamsWithoutMembers'
import { supabase } from '@/lib/supabase'
import { definitions } from '@/types/supabase'
import { WindiUtilities } from '@/types/windi'
import { constructClassName } from '@/utils'

type LeaderboardProps = {
  teamIds: string[]
  utilities?: WindiUtilities
  className?: string
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ teamIds, utilities, className }) => {
  const [lastUpdated, setLastUpdated] = useState<Dayjs.Dayjs>(Dayjs())
  const { data, error, refetch } = useQueryWithTypes<GetTeamsWithoutMembers, GetTeamsWithoutMembersVariables>(
    GET_TEAMS_WITHOUT_MEMBERS,
    { variables: { page: { limit: 50, offset: 0 } } }
  )

  useEffect(() => {
    const teamSubscription = supabase
      .from<definitions['Team']>('Team')
      .on('UPDATE', payload => {
        if (!teamIds.includes(payload.new.id)) return
        refetch()
        setLastUpdated(Dayjs(payload.commit_timestamp))
      })
      .subscribe()
    return () => {
      supabase.removeSubscription(teamSubscription)
    }
  })

  if (!data) return <LoadingPage />
  if (error) return <div>Failed to load teams</div>

  const defaultUtilities: WindiUtilities = { p: 'p-4', bg: 'bg-dark-300/50', pos: 'fixed', border: 'rounded-2xl' }

  return (
    <div className={constructClassName(utilities, defaultUtilities, className)}>
      <div className='flex items-center text-2xl'>
        <p className='font-bold text-secondary'>Leaderboard</p>
        <Icon icon='twemoji:clipboard' className='ml-2' />
      </div>
      <p className='mb-4 text-xs text-true-gray-500'>Last Updated: {lastUpdated.format('hh:mm:ss A')}</p>
      {[...data.teams]
        .filter(t => teamIds.includes(t.id))
        .sort((a, b) => b.points - a.points)
        .map((team, idx) => (
          <div key={team.id} className='flex flex-col'>
            <div className={`flex items-center ${idx !== 0 ? 'mt-3' : ''}`}>
              <p className='w-12 text-true-gray-400'>{String(idx + 1).padStart(2, '0')}</p>
              <div className='flex items-center w-full'>
                <img
                  src={
                    team.avatarUrl
                      ? team.avatarUrl
                      : `https://ui-avatars.com/api/?name=${encodeURIComponent(team.name!)}`
                  }
                  alt={`${team.name}'s avatar'`}
                  className='w-7 h-7 rounded-full object-cover'
                />
                <p className='ml-2 text-sm'>{team.name}</p>
              </div>
              <div className='font-bold'>{team.points}</div>
            </div>
          </div>
        ))}
    </div>
  )
}
