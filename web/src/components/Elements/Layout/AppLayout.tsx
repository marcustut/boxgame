import { Transition, Dialog } from '@headlessui/react'
import { Icon } from '@iconify/react'
import React, { Fragment, useState } from 'react'
import { useEffectOnce } from 'react-use'

import { Button, Navbar } from '@/components/Elements'
import { useAuth } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

const routes = [
  { id: 0, name: 'Profile', icon: 'mdi:face-man-profile', path: '/app/profile' },
  { id: 1, name: 'Team', icon: 'clarity:blocks-group-solid', path: '/app/team' },
  { id: 2, name: 'Mission', icon: 'mdi:clipboard', path: '/app/mission' },
  { id: 3, name: 'Social', icon: 'ion:share-social-sharp', path: '/app/social' },
  { id: 4, name: 'Leaderboard', icon: 'icon-park-outline:ranking', path: '/app/leaderboard' },
  { id: 5, name: 'Inbox', icon: 'mdi:inbox-full-outline', path: '/app/inbox' }
]

type AppLayoutProps = {
  navbar?: boolean
  navbarHeight?: string
  paddingX?: string
  className?: string
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  navbar = true,
  navbarHeight = 'h-14',
  paddingX = 'px-4',
  className = '',
  children
}) => {
  const { signOut } = useAuth()
  const [navOpen, setNavOpen] = useState<boolean>(false)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)

  useEffectOnce(() => {
    supabase.auth.session() && setIsLoggedIn(true)
  })

  const rightRender = (
    <div className='ml-auto'>
      {isLoggedIn ? (
        <>
          <button
            data-blobity-magnetic='false'
            data-blobity-tooltip='Nagivate to other page'
            className='p-2 mr-2 rounded-md bg-secondary focus:outline-none transition duration-200 ease-in-out focus:ring-secondary-ring focus:ring-2'
            onClick={() => setNavOpen(true)}
          >
            <Icon className='w-4 h-4' icon='mdi:menu' />
          </button>
          <button
            data-blobity-magnetic='false'
            data-blobity-tooltip='Log out'
            className='p-2 border-[1px] border-dark-100 rounded-md focus:outline-none transition duration-200 ease-in-out focus:ring-secondary-ring focus:ring-2'
            onClick={() => signOut()}
          >
            <Icon className='w-4 h-4' icon='mdi:logout' />
          </button>
        </>
      ) : (
        <>
          <button
            data-blobity-magnetic='false'
            className='px-3 py-1.5 mr-2 rounded-md bg-secondary text-sm font-medium focus:outline-none transition duration-200 ease-in-out focus:ring-secondary-ring focus:ring-2'
            onClick={() => (window.location.href = '/register')}
          >
            Register
          </button>
          <button
            data-blobity-magnetic='false'
            data-blobity-tooltip='Log out'
            className='px-3 py-1.5 border-[1px] border-dark-100 text-sm font-medium rounded-md focus:outline-none transition duration-200 ease-in-out focus:ring-secondary-ring focus:ring-2'
            onClick={() => (window.location.href = '/login')}
          >
            Login
          </button>
        </>
      )}
    </div>
  )

  return (
    <>
      <div className={`container mx-auto ${className}`}>
        {navbar && <Navbar className={`${navbarHeight} ${paddingX}`} rightRender={() => rightRender} />}
        <div className={`${paddingX} py-14`}>{children}</div>
      </div>

      <Transition show={navOpen} as={Fragment}>
        <Dialog onClose={() => setNavOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <Dialog.Overlay className='fixed inset-0 backdrop-filter backdrop-blur-sm backdrop-brightness-90' />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0 scale-95'
            enterTo='opacity-100 scale-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100 scale-100'
            leaveTo='opacity-0 scale-95'
          >
            <div className='flex flex-col justify-center items-center fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 <sm:w-4/5 px-6 py-4 bg-dark-400/90 rounded-lg shadow-2xl'>
              <p className='mb-2 font-medium text-sm'>Where do you want to go?</p>

              {routes.map(route => (
                <button
                  key={route.id}
                  data-blobity-magnetic='false'
                  className='flex justify-center items-center hover:bg-secondary font-medium text-sm w-full py-1 mt-2 rounded-[4px] focus:outline-none transition duration-200 ease-in-out focus:ring-secondary-ring focus:ring-2'
                  onClick={() => (window.location.href = route.path)}
                >
                  <Icon icon={route.icon} className='mr-1' />
                  {route.name}
                </button>
              ))}

              <Button
                onClick={() => setNavOpen(false)}
                className='mt-4 py-0.5 px-2.5 font-medium text-sm rounded-[4px]'
                size='tiny'
              >
                Cancel
              </Button>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  )
}
