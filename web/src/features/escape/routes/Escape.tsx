import React, { useState } from 'react'

import { EscapeLayout, MissionOneDialog, MissionTwoDialog } from '@/features/escape'

export const Escape: React.FC = () => {
  const [missionOneDialog, setMissionOneDialog] = useState<boolean>(false)
  const [missionTwoDialog, setMissionTwoDialog] = useState<boolean>(false)

  return (
    <>
      <EscapeLayout isHall utilities={{ p: 'px-4 pt-4 pb-20', pos: 'relative' }}>
        <div className='flex flex-col <sm:items-center <sm:text-center'>
          <h2 className='font-bold text-2xl'>Welcome to the Hub!</h2>
          <p className='text-sm text-true-gray-400'>Scan the following QR Code to enter our virtual Escape Room</p>
          <img
            data-blobity-magnetic='false'
            data-blobity-tooltip='Click me!'
            src='https://vfqzgsbgmlvglbygosna.supabase.in/storage/v1/object/public/assets/ArtstepQR.png'
            alt="Artsteps' QR Code"
            className='mt-4 w-64 h-64 cursor-pointer'
            onClick={() => window.open('https://www.artsteps.com/view/61696cc9eee9bb3128d828c7')}
          />
          <p className='mt-4 text-sm text-true-gray-400'>
            In order to escape, you must complete the three tasks below:{' '}
          </p>

          <div className='mt-4 p-4 rounded-lg flex flex-col w-full'>
            <button
              data-blobity-magnetic='false'
              className='bg-dark-300 w-full rounded-lg p-4 relative'
              onClick={() => setMissionOneDialog(true)}
            >
              <span className='bg-secondary absolute -top-2 right-4 rounded-full px-2 py-1 text-xs font-medium'>
                Uncompleted
              </span>
              <span>Mission 1</span>
            </button>
            <button
              data-blobity-magnetic='false'
              className='mt-6 bg-dark-300 w-full rounded-lg p-4 relative'
              onClick={() => setMissionTwoDialog(true)}
            >
              <span className='bg-secondary absolute -top-2 right-4 rounded-full px-2 py-1 text-xs font-medium'>
                Uncompleted
              </span>
              <span>Mission 2</span>
            </button>
            <button
              data-blobity-magnetic='false'
              className='mt-6 bg-dark-300 w-full rounded-lg p-4 relative'
              onClick={() => (window.location.href = `${window.location.pathname}/mystery`)}
            >
              <span className='bg-secondary absolute -top-2 right-4 rounded-full px-2 py-1 text-xs font-medium'>
                Uncompleted
              </span>
              <span>Mission 3</span>
            </button>
          </div>
        </div>
      </EscapeLayout>

      <MissionOneDialog open={missionOneDialog} onClose={() => setMissionOneDialog(false)} />
      <MissionTwoDialog open={missionTwoDialog} onClose={() => setMissionTwoDialog(false)} />
    </>
  )
}
