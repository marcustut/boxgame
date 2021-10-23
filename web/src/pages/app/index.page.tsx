import React, { Fragment, useState } from 'react'
import { useEffectOnce } from 'react-use'
import { Dialog, Transition } from '@headlessui/react'
import { Icon } from '@iconify/react'

import { LoadingPage } from '@/components/Misc'
import { useAuth } from '@/lib/auth'
import { Button } from '@/components/Elements'
import { supabase } from '@/lib/supabase'

const routes = [
  { id: 0, name: 'Profile', icon: 'mdi:face-man-profile', path: '/app/profile' },
  { id: 1, name: 'Team', icon: 'clarity:blocks-group-solid', path: '/app/team' },
  { id: 2, name: 'Mission', icon: 'mdi:clipboard', path: '/app/mission' },
  { id: 3, name: 'Social', icon: 'ion:share-social-sharp', path: '/app/social' }
]

export const AppPage: React.FC = () => {
  const { user, signOut } = useAuth()
  const [navOpen, setNavOpen] = useState<boolean>(false)

  // redirect to login if not authenticated
  useEffectOnce(() => {
    if (!supabase.auth.session()) window.location.href = '/login'
  })

  // show loading when fetching user
  if (!user) return <LoadingPage />

  return (
    <>
      <div className='container mx-auto'>
        <div className='fixed container h-14 px-4 flex items-center backdrop-filter backdrop-blur-md'>
          <div className='flex items-center font-bold'>
            <img
              src='/TheBoxColoredLogo.png'
              alt='TheBoxColoredLogo'
              className='w-10 filter grayscale-20 object-fit mr-1'
            />
            格子游戏
          </div>

          <div className='ml-auto'>
            <button
              className='p-2 mr-2 rounded-md bg-secondary focus:outline-none transition duration-200 ease-in-out focus:ring-secondary-ring focus:ring-2'
              onClick={() => setNavOpen(true)}
            >
              <Icon className='w-4 h-4' icon='mdi:menu' />
            </button>
            <button
              className='p-2 border-[1px] border-dark-100 rounded-md focus:outline-none transition duration-200 ease-in-out focus:ring-secondary-ring focus:ring-2'
              onClick={() => signOut()}
            >
              <Icon className='w-4 h-4' icon='mdi:logout' />
            </button>
          </div>
        </div>
        <div className='px-4 py-14'>
          Takuya is a freelance and a full-stack developer based in Osaka with a passion for building digital
          services/stuff he wants. He has a knack for all things launching products, from planning and designing all the
          way to solving real-life problems with code. When not online, he loves hanging out with his camera. Currently,
          he is living off of his own product called Inkdrop. Bio 1984Born in Osaka (大阪), Japan. 2010Completed the
          Master's Program in the Graduate School of Information Science at Nara Institute of Science and Technology
          (奈良先端科学技術大学院大学情報科学研究科修士課程) 2010Worked at Yahoo! Japan (ヤフー株式会社入社) 2012 to
          presentWorks as a freelance Takuya is a freelance and a full-stack developer based in Osaka with a passion for
          building digital services/stuff he wants. He has a knack for all things launching products, from planning and
          designing all the way to solving real-life problems with code. When not online, he loves hanging out with his
          camera. Currently, he is living off of his own product called Inkdrop. Bio 1984Born in Osaka (大阪), Japan.
          2010Completed the Master's Program in the Graduate School of Information Science at Nara Institute of Science
          and Technology (奈良先端科学技術大学院大学情報科学研究科修士課程) 2010Worked at Yahoo! Japan
          (ヤフー株式会社入社) 2012 to presentWorks as a freelance
        </div>
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
                  className='flex justify-center items-center bg-secondary font-medium text-sm w-full py-1 mt-2 rounded-[4px] focus:outline-none transition duration-200 ease-in-out focus:ring-secondary-ring focus:ring-2'
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

export default AppPage
