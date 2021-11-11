import { Icon } from '@iconify/react'
import React, { useEffect } from 'react'

import { Button, Input } from '@/components/Elements'
import { Leaderboard } from '@/features/battleground'
import { MissionLayout } from '@/features/mission'
import { supabase } from '@/lib/supabase'
import { definitions } from '@/types/supabase'

const teamIds = [
  '118f462d-1534-43aa-bd46-6f0e8e394a14',
  '7035d269-f375-4568-a141-e2fefd331a1b',
  'e385a176-91c6-4f6f-98ce-d203026e6429',
  '3373c3fb-b99e-401f-908e-67ae43303782',
  '60f6073d-f9f8-4584-a135-23da6f72eac3',
  '8c13b76d-b10d-4c42-94db-14d4ad925707',
  '1c543f53-54b7-48be-8b09-1f65abf15c97',
  '3258c229-f8cf-485c-b1a9-241c91521201',
  '922d1051-338b-42fa-be23-7f8a9ff09bed',
  '8e5dc0d6-ee2b-42a7-a05f-18ab63d24dc5',
  '660a461a-0c5a-455c-99ca-dace22ecb2e2',
  '1c143db7-c2b2-4342-bbaa-91c0b0fb6d36',
  '0884b173-62e6-4ce6-9ef5-7feef2ff00ff',
  '3bd9304d-48ea-4398-891c-2c5e3528a508',
  '3323ce17-28c4-4016-a23e-92c220c7c9d0',
  '9490e15d-30cd-4ba3-9b6e-1e89288de049',
  '661eacee-d53b-4fb7-bd18-433084e6155e',
  '0c7507ee-0b62-4370-b516-e831c088174b',
  '39d812ae-80f6-4b6b-8479-0966d32ac662',
  '0f26382f-abf4-41f7-9ae2-c2bc687dd069',
  '8629bd6b-ec7c-45ea-b51f-6d1c9bf9f167',
  'da206d2e-12e2-4fcc-8878-00584a661a80',
  '864a3330-0067-4ee8-bc4a-bc36bd61f009',
  'e726fbdd-4408-47cb-af69-4f4384d45205',
  'f52f7980-c87a-49c8-9a2f-7928e7b8ae19',
  '2faf8c96-6031-4975-a2c3-3c29d1695451',
  '6515a82b-aef6-48f9-8bdb-f9574277f58d',
  '4b4d4364-ff28-4914-afe6-ba525320d0f5',
  '89f098a1-aa81-4b3f-92fa-f41469f6aeb5',
  '4560f603-5218-4db0-92f2-231113125bac',
  'c8aa484a-4f23-476b-8588-ec5241479fa2',
  '00551b89-9f22-42b5-94a2-9c326116c5ea'
]

const INTRO_VIDEO = 'https://www.youtube.com/embed/9edf-__ocLU'

export const Battleground: React.FC = () => {
  return (
    <MissionLayout isHall utilities={{ p: 'px-4 pt-4 pb-20', pos: 'relative' }}>
      {/* <Leaderboard teamIds={teamIds} /> */}
      <h2 className='font-bold text-2xl'>You are now in {'fill in me soon'}'s Mission Page</h2>
      <div className='w-full flex <sm:flex-col justify-center items-center mx-auto mt-12'>
        <iframe
          src={INTRO_VIDEO}
          title='YouTube video player'
          frameBorder='0'
          allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
          allowFullScreen
          className='w-full h-80 <sm:h-64 <sm:mt-4 sm:mr-2'
        />
        {/* <iframe
          src={BRIEFING_VIDEO}
          title='YouTube video player'
          frameBorder='0'
          allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
          allowFullScreen
          className='w-full h-80 <sm:h-64 <sm:mt-4 sm:ml-2'
        /> */}
      </div>
      <div className='flex justify-center items-center text-lg mt-4'>
        <Icon icon='emojione:index-pointing-up-medium-skin-tone' className='mr-2 transform' />
        <span className='text-true-gray-400'>Refer to the video if needed 若有需要请参阅视频</span>
      </div>

      <h2 className='font-bold text-2xl mt-8'>Game Description</h2>
      <p className='text-true-gray-400 mt-1 whitespace-pre-wrap'>
        {`In this mission, you will have to compete against the time, if you look on the bottom right, there is a countdown timer, when the timer reaches 0, the mission will close and no one will be able to submit their answer.
在这个任务中，你必须与时间竞争，如果你看右下角，有一个倒数计时器，当计时器到0时，任务将关闭，不能再提交你们的答案`}
      </p>

      <div className='my-32 flex flex-col justify-center items-center text-true-gray-500'>
        <Icon icon='fluent:conference-room-16-regular' className='w-16 h-16' />
        <h2 className='font-bold text-2xl'>Battleground Room</h2>
        <p className='text-sm'>The room code will be given by your 守护者, be prepared and buckle up.</p>
        <div className='flex flex-col justify-center items-center mt-4'>
          <Input className='text-white' placeholder='Enter room code...' maxLength={4} />
          <Button size='small' className='mt-4 px-3 font-medium'>
            Enter
          </Button>
        </div>
      </div>
    </MissionLayout>
  )
}
