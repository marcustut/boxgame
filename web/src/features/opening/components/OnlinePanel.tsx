import { Transition } from '@headlessui/react'
import { Icon } from '@iconify/react'
import React, { Fragment, useState } from 'react'

import { Avatar } from '@/components/Elements'
import { Gender } from '@/graphql'

const fakeUsers = [
  {
    id: 0,
    avatarUrl: 'https://gravatar.com/avatar/dca5ed5b13de8bcf9760884788604a60?s=400&d=robohash&r=x',
    username: 'marcustut',
    team: 'siapa-siapa'
  },
  {
    id: 1,
    avatarUrl: 'https://gravatar.com/avatar/dca5ed5b13de8bcf9760884788604a60?s=400&d=robohash&r=x',
    username: 'marcustut',
    team: 'siapa-siapa'
  },
  {
    id: 2,
    avatarUrl: 'https://gravatar.com/avatar/dca5ed5b13de8bcf9760884788604a60?s=400&d=robohash&r=x',
    username: 'marcustut',
    team: 'siapa-siapa'
  },
  {
    id: 3,
    avatarUrl: 'https://gravatar.com/avatar/dca5ed5b13de8bcf9760884788604a60?s=400&d=robohash&r=x',
    username: 'marcustut',
    team: 'siapa-siapa'
  },
  {
    id: 4,
    avatarUrl: 'https://gravatar.com/avatar/dca5ed5b13de8bcf9760884788604a60?s=400&d=robohash&r=x',
    username: 'marcustut',
    team: 'siapa-siapa'
  },
  {
    id: 5,
    avatarUrl: 'https://gravatar.com/avatar/dca5ed5b13de8bcf9760884788604a60?s=400&d=robohash&r=x',
    username: 'marcustut',
    team: 'siapa-siapa'
  },
  {
    id: 6,
    avatarUrl: 'https://gravatar.com/avatar/dca5ed5b13de8bcf9760884788604a60?s=400&d=robohash&r=x',
    username: 'marcustut',
    team: 'siapa-siapa'
  },
  {
    id: 7,
    avatarUrl: 'https://gravatar.com/avatar/dca5ed5b13de8bcf9760884788604a60?s=400&d=robohash&r=x',
    username: 'marcustut',
    team: 'siapa-siapa'
  }
]

export const OnlinePanel: React.FC = () => {
  const [panelOpen, setPanelOpen] = useState<boolean>(false)
  return (
    <>
      <Transition
        show={panelOpen}
        as={Fragment}
        enter='ease-out duration-300'
        enterFrom='opacity-0'
        enterTo='opacity-100'
        leave='ease-in duration-200'
        leaveFrom='opacity-100'
        leaveTo='opacity-0'
      >
        <div
          className='absolute w-48 z-10 p-4 flex flex-col justify-center items-center bg-dark-400 rounded-md'
          style={{ bottom: '4rem', left: '1rem' }}
        >
          <div className='font-medium flex items-center'>
            Online Now <Icon icon='ic:baseline-people-alt' className='ml-2' />
          </div>
          <div className='h-[1px] w-full bg-dark-100 my-2' />
          <div className='w-full max-h-64 overflow-y-scroll'>
            {fakeUsers.map((fu, index) => (
              <div
                key={fu.id}
                className={`flex items-center text-sm font-medium w-full text-true-gray-200 truncate ${
                  index !== 0 ? 'mt-2' : ''
                }`}
              >
                <div className='relative'>
                  <div className='absolute w-1.5 h-1.5 top-0.5 right-1.5 rounded-full bg-green-400' />
                  <Avatar
                    src={fu.avatarUrl}
                    name={fu.username}
                    gender={Gender.MALE}
                    utilities={{ w: 'w-7', h: 'h-7', p: '', m: 'mr-2', border: 'rounded-full' }}
                  />
                </div>
                <div className='flex flex-col'>
                  {fu.username}
                  <span className='-mt-1.5 text-xs font-normal text-true-gray-500'>{fu.team}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Transition>

      <div className='absolute left-4 bottom-4 z-10'>
        <div className='relative'>
          <div className='absolute w-2 h-2 bg-green-400 rounded-full top-0.5 right-0.5' />
          <button
            className='rounded-full bg-secondary p-2 focus:outline-none hover:bg-secondary-hover shadow-lg'
            onClick={() => setPanelOpen(!panelOpen)}
          >
            <Icon icon='ic:baseline-people-alt' className='w-6 h-6' />
          </button>
        </div>
      </div>
    </>
  )
}
