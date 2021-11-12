import { Listbox } from '@headlessui/react'
import { Icon } from '@iconify/react'
import React from 'react'

import { Avatar } from '@/components/Elements'
import { GetTeams_teams } from '@/graphql/types/GetTeams'

type PlayerSelectProps<T> = {
  value: T
  onChange: (value: T) => void
  teams: GetTeams_teams[]
}

export const PlayerSelect = <T extends unknown>({ value, onChange, teams }: PlayerSelectProps<T>) => {
  return (
    <Listbox value={value} onChange={onChange} as='div' className='flex flex-col'>
      <Listbox.Button
        data-blobity-magnetic='false'
        className='relative flex justify-between items-center py-2 px-3 text-left text-true-gray-200 bg-dark-300 rounded-lg shadow-md text-sm hover:focus:ring-2 hover:focus:ring-secondary-ring'
      >
        <span className='block truncate'>{value ? `${value}` : 'not selected'}</span>
        <Icon icon='heroicons-solid:selector' className='ml-4' />
      </Listbox.Button>
      <Listbox.Options className='w-full bg-dark-300/50 rounded-lg mt-3 px-2 py-2' as='div'>
        {teams.map((team, idx) => (
          <div key={team.id} className={`${idx !== 0 ? 'mt-2' : ''}`}>
            <span className='text-xs font-medium mx-2 text-true-gray-400'>{team.name}</span>
            {team.members.map((member, i) => (
              <Listbox.Option
                key={member.id}
                value={member.username}
                className={`flex items-center list-none text-sm px-2 py-2 rounded-md hover:bg-secondary ${
                  i !== 0 ? 'mt-1' : ''
                }`}
              >
                {member.profile && (
                  <>
                    <Avatar
                      src={member.profile.avatarUrl}
                      name={member.profile.nameEng}
                      gender={member.profile.gender}
                      utilities={{
                        w: 'w-4',
                        h: 'h-4',
                        p: '',
                        m: 'mr-2',
                        border: 'rounded-full'
                      }}
                    />
                    {member.profile.nameEng}
                  </>
                )}
              </Listbox.Option>
            ))}
          </div>
        ))}
      </Listbox.Options>
    </Listbox>
  )
}
