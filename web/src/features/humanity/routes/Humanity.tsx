import { Icon } from '@iconify/react'
import Dayjs from 'dayjs'
import RelativeTime from 'dayjs/plugin/relativeTime'
import { useSnackbar } from 'notistack'
import React, { useEffect, useMemo, useState } from 'react'
import { useEffectOnce } from 'react-use'

import { LoadingPage } from '@/components/Misc'
import { useFetchHumanity, useUpsertHumanity } from '@/features/humanity'
import { MissionLayout, MissionUnavailable, useFetchMission } from '@/features/mission'
import { useAuth } from '@/lib/auth'

Dayjs.extend(RelativeTime)

const TEAM_BATCH_MAP: Record<string, 1 | 2> = {
  '1c143db7-c2b2-4342-bbaa-91c0b0fb6d36': 1, // 我们想不到
  '8e5dc0d6-ee2b-42a7-a05f-18ab63d24dc5': 1, // 一班小学生
  'e726fbdd-4408-47cb-af69-4f4384d45205': 1, //格外惊喜
  '39d812ae-80f6-4b6b-8479-0966d32ac662': 1, // 守护者军团
  '78ab856d-5352-4071-a962-b7bb5887214d': 1, // 守护者军队
  '0f26382f-abf4-41f7-9ae2-c2bc687dd069': 1, // 🦑鱿鱼456🐙⏺🔼⏹
  '7035d269-f375-4568-a141-e2fefd331a1b': 1, // 我是大赢家
  'f52f7980-c87a-49c8-9a2f-7928e7b8ae19': 1, // 假装有名字
  '3258c229-f8cf-485c-b1a9-241c91521201': 1, // 不醒人室
  '60f6073d-f9f8-4584-a135-23da6f72eac3': 1, // 与你闯输赢
  '661eacee-d53b-4fb7-bd18-433084e6155e': 1, // 惰们玩格子
  '4b4d4364-ff28-4914-afe6-ba525320d0f5': 1, // 菠萝菠萝蜜🍍
  '3373c3fb-b99e-401f-908e-67ae43303782': 1, // 有一点烧
  '6515a82b-aef6-48f9-8bdb-f9574277f58d': 1, // 懒得想名字
  '00551b89-9f22-42b5-94a2-9c326116c5ea': 1, // Level 99
  'da206d2e-12e2-4fcc-8878-00584a661a80': 1, // 哈哈哈哈哈
  '0884b173-62e6-4ce6-9ef5-7feef2ff00ff': 1, // 让你们回家
  '4560f603-5218-4db0-92f2-231113125bac': 2, // 咸鱼花腩煲
  '3bd9304d-48ea-4398-891c-2c5e3528a508': 2, // Group 4 Steady La
  '1c543f53-54b7-48be-8b09-1f65abf15c97': 2, // 要就拿第一
  'e385a176-91c6-4f6f-98ce-d203026e6429': 2, // 💯分的我们
  '2faf8c96-6031-4975-a2c3-3c29d1695451': 2, // 我们爱中华
  '864a3330-0067-4ee8-bc4a-bc36bd61f009': 2, // 队友网很卡
  '9490e15d-30cd-4ba3-9b6e-1e89288de049': 2, // 呵呵呵呵呵
  '660a461a-0c5a-455c-99ca-dace22ecb2e2': 2, // Think out of the box
  'c8aa484a-4f23-476b-8588-ec5241479fa2': 2, // 麤龘骉鱻
  '0c7507ee-0b62-4370-b516-e831c088174b': 2, // 2345y
  '922d1051-338b-42fa-be23-7f8a9ff09bed': 2, // 格天再说
  '118f462d-1534-43aa-bd46-6f0e8e394a14': 2, // 单身狗协会
  '3323ce17-28c4-4016-a23e-92c220c7c9d0': 2, // Shopee 11.11
  '8c13b76d-b10d-4c42-94db-14d4ad925707': 2, // 鱼肉米粉汤
  '89f098a1-aa81-4b3f-92fa-f41469f6aeb5': 2, // 最优秀的Sotong
  '8629bd6b-ec7c-45ea-b51f-6d1c9bf9f167': 2 // 名字真难取
}

const TEAM_GATHER_LINK: Record<string, string> = {
  '1c143db7-c2b2-4342-bbaa-91c0b0fb6d36': 'https://gather.town/app/cHTIRlWtLr1wvdjx/Keep%20and%20Steal%20Room%20A', // 我们想不到
  '8e5dc0d6-ee2b-42a7-a05f-18ab63d24dc5': 'https://gather.town/app/cHTIRlWtLr1wvdjx/Keep%20and%20Steal%20Room%20A', // 一班小学生
  'e726fbdd-4408-47cb-af69-4f4384d45205': 'https://gather.town/app/A1ldro1rwhmsNnj6/Keep%20and%20Steal%20Room%20B', // 格外惊喜
  '39d812ae-80f6-4b6b-8479-0966d32ac662': 'https://gather.town/app/A1ldro1rwhmsNnj6/Keep%20and%20Steal%20Room%20B', // 守护者军团
  '78ab856d-5352-4071-a962-b7bb5887214d': 'https://gather.town/app/A1ldro1rwhmsNnj6/Keep%20and%20Steal%20Room%20B', // 守护者军队
  '0f26382f-abf4-41f7-9ae2-c2bc687dd069': 'https://gather.town/app/umqdTJ4fOfmfB4Zj/Keep%20and%20Steal%20Room%20C', // 🦑鱿鱼456🐙⏺🔼⏹
  '7035d269-f375-4568-a141-e2fefd331a1b': 'https://gather.town/app/umqdTJ4fOfmfB4Zj/Keep%20and%20Steal%20Room%20C', // 我是大赢家
  'f52f7980-c87a-49c8-9a2f-7928e7b8ae19': 'https://gather.town/app/xkXTlevB7tnPRzV0/Keep%20and%20Steal%20Room%20D', // 假装有名字
  '3258c229-f8cf-485c-b1a9-241c91521201': 'https://gather.town/app/xkXTlevB7tnPRzV0/Keep%20and%20Steal%20Room%20D', // 不醒人室
  '60f6073d-f9f8-4584-a135-23da6f72eac3': 'https://gather.town/app/6fJszfsNmpWnB1qk/Keep%20and%20Steal%20Room%20E', // 与你闯输赢
  '661eacee-d53b-4fb7-bd18-433084e6155e': 'https://gather.town/app/6fJszfsNmpWnB1qk/Keep%20and%20Steal%20Room%20E', // 惰们玩格子
  '4b4d4364-ff28-4914-afe6-ba525320d0f5': 'https://gather.town/app/k3bxfQLTkUWxZoGV/Keep%20and%20Steal%20Room%20F', // 菠萝菠萝蜜🍍
  '3373c3fb-b99e-401f-908e-67ae43303782': 'https://gather.town/app/k3bxfQLTkUWxZoGV/Keep%20and%20Steal%20Room%20F', // 有一点烧
  '6515a82b-aef6-48f9-8bdb-f9574277f58d': 'https://gather.town/app/YIn9sHLn4krzsZz8/Keep%20and%20Steal%20Room%20G', // 懒得想名字
  '00551b89-9f22-42b5-94a2-9c326116c5ea': 'https://gather.town/app/YIn9sHLn4krzsZz8/Keep%20and%20Steal%20Room%20G', // Level 99
  'da206d2e-12e2-4fcc-8878-00584a661a80': 'https://gather.town/app/6WaK6qFxheKbX55a/Keep%20and%20Steal%20Room%20H', // 哈哈哈哈哈
  '0884b173-62e6-4ce6-9ef5-7feef2ff00ff': 'https://gather.town/app/6WaK6qFxheKbX55a/Keep%20and%20Steal%20Room%20H', // 让你们回家
  '4560f603-5218-4db0-92f2-231113125bac': 'https://gather.town/app/cHTIRlWtLr1wvdjx/Keep%20and%20Steal%20Room%20A', // 咸鱼花腩煲
  '3bd9304d-48ea-4398-891c-2c5e3528a508': 'https://gather.town/app/cHTIRlWtLr1wvdjx/Keep%20and%20Steal%20Room%20A', // Group 4 Steady La
  '1c543f53-54b7-48be-8b09-1f65abf15c97': 'https://gather.town/app/A1ldro1rwhmsNnj6/Keep%20and%20Steal%20Room%20B', // 要就拿第一
  'e385a176-91c6-4f6f-98ce-d203026e6429': 'https://gather.town/app/A1ldro1rwhmsNnj6/Keep%20and%20Steal%20Room%20B', // 💯分的我们
  '2faf8c96-6031-4975-a2c3-3c29d1695451': 'https://gather.town/app/umqdTJ4fOfmfB4Zj/Keep%20and%20Steal%20Room%20C', // 我们爱中华
  '864a3330-0067-4ee8-bc4a-bc36bd61f009': 'https://gather.town/app/umqdTJ4fOfmfB4Zj/Keep%20and%20Steal%20Room%20C', // 队友网很卡
  '9490e15d-30cd-4ba3-9b6e-1e89288de049': 'https://gather.town/app/xkXTlevB7tnPRzV0/Keep%20and%20Steal%20Room%20D', // 呵呵呵呵呵
  '660a461a-0c5a-455c-99ca-dace22ecb2e2': 'https://gather.town/app/xkXTlevB7tnPRzV0/Keep%20and%20Steal%20Room%20D', // Think out of the box
  'c8aa484a-4f23-476b-8588-ec5241479fa2': 'https://gather.town/app/6fJszfsNmpWnB1qk/Keep%20and%20Steal%20Room%20E', // 麤龘骉鱻
  '8629bd6b-ec7c-45ea-b51f-6d1c9bf9f167': 'https://gather.town/app/6fJszfsNmpWnB1qk/Keep%20and%20Steal%20Room%20E', // 名字真难取
  '0c7507ee-0b62-4370-b516-e831c088174b': 'https://gather.town/app/k3bxfQLTkUWxZoGV/Keep%20and%20Steal%20Room%20F', // 2345y
  '922d1051-338b-42fa-be23-7f8a9ff09bed': 'https://gather.town/app/k3bxfQLTkUWxZoGV/Keep%20and%20Steal%20Room%20F', // 格天再说
  '118f462d-1534-43aa-bd46-6f0e8e394a14': 'https://gather.town/app/YIn9sHLn4krzsZz8/Keep%20and%20Steal%20Room%20G', // 单身狗协会
  '8c13b76d-b10d-4c42-94db-14d4ad925707': 'https://gather.town/app/YIn9sHLn4krzsZz8/Keep%20and%20Steal%20Room%20G', // 鱼肉米粉汤
  '3323ce17-28c4-4016-a23e-92c220c7c9d0': 'https://gather.town/app/6WaK6qFxheKbX55a/Keep%20and%20Steal%20Room%20H', // Shopee 11.11
  '89f098a1-aa81-4b3f-92fa-f41469f6aeb5': 'https://gather.town/app/6WaK6qFxheKbX55a/Keep%20and%20Steal%20Room%20H' // 最优秀的Sotong
}

const INTRO_VIDEO = 'https://www.youtube.com/embed/Y42egm2GEJ4'
const BRIEFING_VIDEO = 'https://www.youtube.com/embed/BRfg6XGzAEs'
const COMPLETED_VIDEO = 'https://www.youtube.com/watch?v=9edf-__ocLU'

const MISSION_ID = 'b9498ffd-5702-4a7e-aa7b-9cdcfd71b126'

const BATCH_ONE_RELEASE_TIME = '2021-11-06T12:30:00'
const BATCH_TWO_RELEASE_TIME = '2021-11-06T13:00:00'

export const Humanity: React.FC = () => {
  const [mounted, setMounted] = useState<boolean>(false)
  const { enqueueSnackbar } = useSnackbar()
  const { user } = useAuth()
  const { mission, fetchMission } = useFetchMission()
  const { humanity, fetchHumanity } = useFetchHumanity()
  const { upsertHumanity } = useUpsertHumanity()

  const isOngoing = useMemo(
    () =>
      Dayjs(mission?.data.mission?.startAt).isBefore(Dayjs()) && Dayjs(Dayjs()).isBefore(mission?.data.mission?.endAt),
    [mission]
  )

  useEffectOnce(() => {
    setMounted(true)
    fetchMission(MISSION_ID).then(() => console.log('fetched mission'))
  })

  useEffect(() => {
    if (!user || !user.user.team) return
    fetchHumanity(user.user.team.id)
      .then(() => console.log('fetched humanity'))
      .catch(err => {
        if (err.message === 'ErrNotFound') {
          const teamId = user.user.team!.id
          const batch = TEAM_BATCH_MAP[teamId]
          const gatherLink = TEAM_GATHER_LINK[teamId]
          upsertHumanity({ teamId, missionId: MISSION_ID, batch, gatherLink }).then(() => {
            console.log('upserted humanity')
            fetchHumanity(teamId).then(() => console.log('fetched humanity'))
          })
        }
      })
  }, [fetchHumanity, upsertHumanity, user])

  // if still loading data
  if (!user || !mounted || !mission || !humanity) return <LoadingPage />

  // if unable to load team
  if (!user.user.team) return <div>Error loading team</div>

  // if unable to load mission
  if (!mission.data.mission) return <div>Error loading mission</div>

  // if unable to load speed
  if (!humanity.data.humanity) return <div>Error loading humanity</div>

  // if mission is closed
  // if (!isOngoing) return <MissionUnavailable mission={mission.data.mission} />

  return (
    <MissionLayout isHall utilities={{ p: 'px-4 pt-4 pb-96', pos: 'relative' }}>
      <div className='flex flex-col'>
        <h2 className='font-bold text-2xl'>You are now in {mission.data.mission.title}'s Mission Page</h2>
        <div className='w-full flex <sm:flex-col justify-center items-center mx-auto mt-12'>
          <iframe
            src={INTRO_VIDEO}
            title='YouTube video player'
            frameBorder='0'
            allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
            allowFullScreen
            className='w-full h-80 <sm:h-64 <sm:mt-4 sm:mr-2'
          />
          <iframe
            src={BRIEFING_VIDEO}
            title='YouTube video player'
            frameBorder='0'
            allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
            allowFullScreen
            className='w-full h-80 <sm:h-64 <sm:mt-4 sm:ml-2'
          />
        </div>
        <div className='flex justify-center items-center text-lg mt-4'>
          <Icon icon='emojione:index-pointing-up-medium-skin-tone' className='mr-2 transform' />
          <span className='text-true-gray-400'>Refer to the video if needed 若有需要请参阅视频</span>
        </div>

        <h2 className='font-bold text-2xl mt-12'>Game Description</h2>

        <div className='mt-12 flex items-center text-2xl'>
          <h2 className='font-bold'>First Challenge</h2> <Icon icon='twemoji:keycap-1' className='ml-2' />
        </div>
        <p className='text-true-gray-400 mt-1 whitespace-pre-wrap'>
          {`各位玩家，有项紧急任务需要你们处理🚨
你们将会收到一个故事情节，故事情节中有不少隐藏的玄机需要你们找出来，在接下来的半小时内务必完成‼️

规则与步骤很简单，
仔细看清楚：
1. 你将收到故事情节
2. 仔细阅读整篇故事
3. 下载哪附加的三张图
4. 用你们的方式圈出隐藏的玄机
5. 完成后上传至以下的upload box

📝备注：
- 如果你使用的是windows电脑，可以使用paint；
- 或者可以使用whatsapp下载图片然后去圈。

时长半小时，透过团队合作，一起闯关吧！`}
        </p>
        <div className='flex <sm:flex-col justify-evenly items-center mt-4'>
          <div className='flex flex-col items-center text-center'>
            <img
              src='https://vfqzgsbgmlvglbygosna.supabase.in/storage/v1/object/public/assets/Game3/a.jpg'
              alt='Kitchen'
              className='w-50 h-50 mt-2'
            />
            <a
              data-blobity-magnetic='false'
              href='https://vfqzgsbgmlvglbygosna.supabase.in/storage/v1/object/public/assets/Game3/a.jpg'
              target='_blank'
              rel='noreferrer'
              className='text-true-gray-400 hover:text-secondary hover:underline font-medium text-sm mt-1'
            >
              Kitchen (Click Me to Download)
            </a>
          </div>
          <div className='flex flex-col items-center text-center <sm:mt-4'>
            <img
              src='https://vfqzgsbgmlvglbygosna.supabase.in/storage/v1/object/public/assets/Game3/b.jpg'
              alt='LivingRoom'
              className='w-48'
            />
            <a
              data-blobity-magnetic='false'
              href='https://vfqzgsbgmlvglbygosna.supabase.in/storage/v1/object/public/assets/Game3/b.jpg'
              target='_blank'
              rel='noreferrer'
              className='text-true-gray-400 hover:text-secondary hover:underline font-medium text-sm mt-1'
            >
              Living Room (Click Me to Download)
            </a>
          </div>
          <div className='flex flex-col items-center text-center <sm:mt-4'>
            <img
              src='https://vfqzgsbgmlvglbygosna.supabase.in/storage/v1/object/public/assets/Game3/c.jpg'
              alt='Room'
              className='w-48'
            />
            <a
              data-blobity-magnetic='false'
              href='https://vfqzgsbgmlvglbygosna.supabase.in/storage/v1/object/public/assets/Game3/c.jpg'
              target='_blank'
              rel='noreferrer'
              className='text-true-gray-400 hover:text-secondary hover:underline font-medium text-sm mt-1'
            >
              Room (Click Me to Download)
            </a>
          </div>
        </div>
      </div>
    </MissionLayout>
  )
}
