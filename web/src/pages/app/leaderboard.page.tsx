import React from 'react'

import { AppLayout } from '@/components/Elements'
import { Leaderboard } from '@/features/battleground'

const teamIds = [
  '1c143db7-c2b2-4342-bbaa-91c0b0fb6d36',
  '8e5dc0d6-ee2b-42a7-a05f-18ab63d24dc5',
  'e726fbdd-4408-47cb-af69-4f4384d45205',
  '39d812ae-80f6-4b6b-8479-0966d32ac662',
  '0f26382f-abf4-41f7-9ae2-c2bc687dd069',
  '7035d269-f375-4568-a141-e2fefd331a1b',
  'f52f7980-c87a-49c8-9a2f-7928e7b8ae19',
  '3258c229-f8cf-485c-b1a9-241c91521201',
  '60f6073d-f9f8-4584-a135-23da6f72eac3',
  '661eacee-d53b-4fb7-bd18-433084e6155e',
  '4b4d4364-ff28-4914-afe6-ba525320d0f5',
  '3373c3fb-b99e-401f-908e-67ae43303782',
  '6515a82b-aef6-48f9-8bdb-f9574277f58d',
  '00551b89-9f22-42b5-94a2-9c326116c5ea',
  'da206d2e-12e2-4fcc-8878-00584a661a80',
  '0884b173-62e6-4ce6-9ef5-7feef2ff00ff',
  '4560f603-5218-4db0-92f2-231113125bac',
  '3bd9304d-48ea-4398-891c-2c5e3528a508',
  '1c543f53-54b7-48be-8b09-1f65abf15c97',
  'e385a176-91c6-4f6f-98ce-d203026e6429',
  '2faf8c96-6031-4975-a2c3-3c29d1695451',
  '864a3330-0067-4ee8-bc4a-bc36bd61f009',
  '9490e15d-30cd-4ba3-9b6e-1e89288de049',
  '660a461a-0c5a-455c-99ca-dace22ecb2e2',
  'c8aa484a-4f23-476b-8588-ec5241479fa2',
  '0c7507ee-0b62-4370-b516-e831c088174b',
  '922d1051-338b-42fa-be23-7f8a9ff09bed',
  '118f462d-1534-43aa-bd46-6f0e8e394a14',
  '3323ce17-28c4-4016-a23e-92c220c7c9d0',
  '8c13b76d-b10d-4c42-94db-14d4ad925707',
  '89f098a1-aa81-4b3f-92fa-f41469f6aeb5',
  '8629bd6b-ec7c-45ea-b51f-6d1c9bf9f167'
]

const LeaderboardPage: React.FC = () => (
  <AppLayout>
    {/* <div className='flex flex-col justify-center items-center h-[80vh] text-5xl font-bold'>
      Coming Soon
      <span className='text-true-gray-500 text-sm font-medium mt-2'>Check back later!</span>
    </div> */}
    <Leaderboard teamIds={teamIds} utilities={{ display: 'block', pos: '' }} />
  </AppLayout>
)

export default LeaderboardPage
