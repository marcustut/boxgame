import { Disclosure } from '@headlessui/react'
import { Icon } from '@iconify/react'
import Dayjs from 'dayjs'
import RelativeTime from 'dayjs/plugin/relativeTime'
import Timezone from 'dayjs/plugin/timezone'
import UTC from 'dayjs/plugin/utc'
import { useSnackbar } from 'notistack'
import React, { useEffect, useMemo, useState } from 'react'
import Dropzone from 'react-dropzone'
import { useEffectOnce } from 'react-use'

import { Button } from '@/components/Elements'
import { LoadingPage } from '@/components/Misc'
import { useFetchHumanity, useUpsertHumanity, bulkUploadFilesToSupabase } from '@/features/humanity'
import { MissionLayout, MissionUnavailable, useFetchMission } from '@/features/mission'
import { useAuth } from '@/lib/auth'

Dayjs.extend(RelativeTime)
Dayjs.extend(UTC)
Dayjs.extend(Timezone)

const STORY_PART_ONE = `在这繁华世界里，每个人都在追求自己喜爱的人事物。在这个世界里充满着许多的虚拟和不真实在这个不堪一击的社会里，人人都在为着某样事物在卖命哪有什么事物是值得留恋的呢？在这人海茫茫中有个女生在这虚拟的世界里稍有名气，时常在线上花里花俏得到人的认可和关注。

“五道题答对了四道，恭喜你，高先生，你在线上答对的我的问题，让我为你唱一首歌！“ ”谢谢你，这位Anthony你给的爱心我收到了“ ”哦？我喜欢怎样类型的男生，特别是每天都上线关注我的你们啊“ ”哎呀！！原来现在已经12点了也很晚了，我也是时候下线了，我们明天再见！“ 这位女生每一天都上线开播到12点才休息，而她的职业是知名的直播主，因为是直播主的关系，时常出到街上都会被认出来，时不时就有人和她打招呼，又突然有人要求合照。所以这些都成为了她出街时很平常的画面和习惯。

同时回到现实生活，这位女生还是需要上班来维持日常所需。毕竟另外一份直播职业还不能支撑一个月的开销，有一天在办公的电脑信箱里不断弹出匿名的邮件，但邮件里面都是写着一堆莫名其妙的‘我爱你’使得这女生顿时充满了疑问。

当她放工回家的路上，一直感觉有人跟在他的背后。她时不时回头望，但也看不到任何人影，当他走到一个地铁下水道时，突然有个人冒出来把她吓了一大跳！原来是她的闺蜜出来四处找她，那位女生才知道闺蜜突然收到一个陌生号码发来一堆照片都是这位女生在街上和出入家时的一些日常照，导致她的闺蜜十分慌张地跑出来找她, 担心她会有什么事那位女生也不以为然的说道可能是那些在直播间的人吧，因为她常常会收到粉丝的礼物，或者收到一些祝福卡之类的。所以有些铁粉迷恋她也不出奇啊，但也不会做出什么奇葩的事啦她的闺蜜还是很担心她的安全，但没办法只能叮咛她千万个小心在外头。

当那位女生回到家，整个人都累的不得了因为等下10点晚上还要惯例的开直播，而现在才8点钟，那有一些私人时间做些自己的事整理好自己，梳洗之后正在热一杯快熟面在厨房里，突然电话响起，她接了但是在电话里头没有任何人说话，她不断的询问对方是谁，到头来还是一个寂寞。挂了电话，准备去客厅看电视，因为她有个习惯是每晚开播前都要看当日的《新闻报报看》，缓缓的来到客厅，那女生坐在沙发上，不知不觉又到了10点钟，开始上线要开当天的直播。一如往常的又一堆男粉在那里送这个送那个，搞得这女生在镜头前载歌载舞。就这样的闹了2个小时，又是到时候下线和每个男粉说再见了。

人啊，就是不断在满足别人的需要，来换取自己的利益和虚荣，是什么东西让我们不能再像以前那样？这朴实无华的日子又到到几时呢？每个早上起来关了闹钟声，是什么在叫醒你？虚荣和利益？ 还是梦想和未来？
`

const STORY_PART_TWO = `那个晚上她侧夜难睡，脑海里都一直回想着回家时的感受到的身影。突然间屋外传来一阵车的引擎声，又听到一些脚步声，搞得她胡思乱想，从床上下来准备去探个究竟。穿上了睡衣袍，顺手去拿手机下楼，但是找来找去手机不知跑去哪里了，《.........死了都要愛 不淋漓盡致不痛快，感情多深只有這樣才足夠表白............》突然听见手机响起，这个铃声仿佛就在房间里传来，但是就找不出它的位置。那个铃声越来越大声，原来手机掉入床底下，当她接听时传来一段很刺耳电波的声音。完全听不明，就挂了电话，赶紧去打开房间的灯，”怎么这个时候没反应？！现在才来停电？“她说道。赶紧在柜里拿出手电筒小心翼翼的走下楼梯在下着楼梯时，突然客厅传来电视机的声音，来到客厅看到电视机很灵异的播放着，顿时心都寒了因为她还记得上去睡觉前明明把电源都关了，怎么可能电视机还播放着。突然间，电视机擅自的转了频道，重播回当晚8点时的新闻。她心想都快凌晨2点了，哪来的插播新闻啊。她正想拿遥控器关闭电视时，那个遥控器盘旋在半空中。她根本无法想象她眼前所看到的事情，然后再把目光看向那则新闻，才发现正在报导着一名粉丝送了一张沙发出去，而且那个沙发的皮质是从那位粉丝身上的皮割制而来的。她突然领悟到自己收到的沙发和新闻里的沙发的一模一样的，最巧合的是她家的沙发也是匿名粉丝送给她的完全不敢相信她眼前的沙发是多么的血腥和令人作呕。突然厨房的发出一堆碗碟打破的声音，她赶紧喊叫谁在厨房里，慢慢的看见有个人影一拐一拐的从厨房走出来，隐隐约约看到厨房有滩血迹，难道里面还有人受伤了？走出来时手上还拿着水果刀，但是看不出这个人的样子，因为穿得很紧密难道那人就是削了身上的皮的粉丝吗？他往那女生的方向朝去。一瞬间，她看见自己的身上流出很多的血，流不停，但是那个人急忙地逃走。血流不停，开始没力气倒在地上，突然感觉有一滴一滴的水滴在她的脸上。

慢慢的失去意志而闭上眼睛了。。。。

突然之间 ；
当她再次打开眼睛时发现自己回到了房间，竟然看到另外一个自己还在床上侧夜难眠，跟一开始的场景一模一样，她试图呼叫另外一个还在床上的自己。但是一点反应也没有，她才发现她来到二度空间，而躺在床上的自己是在现实的空间，她回想到刚才的惨剧，她现在想要试图阻止一切的发生。她跑到楼下，看见一辆车刚好停在她的家门口，她在客厅的总电箱关闭自己房间的电源，避免凶手发现楼上的房间有人，再赶紧冲上楼找现实空间的自己，上到房间时，看到现实空间的自己在找着电话，但是唯有在二度空间的她知道电话在床底下。她用自己的电话拨打现实空间的电话，突然电话响起，现实空间的自己找到并接通了电话她试图叫现实空间的自己逃跑，但这通电话很快就挂了。她又冲下楼打开电视机，尝试引导楼上的自己下来看新闻。
她又尝试拿起遥控器和转换频道要让现实空间的自己看到那则关于自己的新闻
但是她看见凶手已经爬进厨房里了，她把厨房里的碗碟从柜里拿出来朝那个凶手的方向丢去试图吓走这个凶手，
碗碟不小心挂破凶手的脚，留了一些血迹在地上。
突然听到客厅里传来自己的叫声，那个凶手走出去，
二度空间的她完全阻止不了那个凶手往自己的肚子扎了一刀，
看着自己躺在地上，没办法控制她的眼泪不断的流下来。
《对不起，是我害死了我自己；我不该引导自己下楼遇害的》`

const TEAM_BATCH_MAP: Record<string, 1 | 2> = {
  '1c143db7-c2b2-4342-bbaa-91c0b0fb6d36': 1, // 我们想不到
  '8e5dc0d6-ee2b-42a7-a05f-18ab63d24dc5': 1, // 一班小学生
  'e726fbdd-4408-47cb-af69-4f4384d45205': 1, // 格外惊喜
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

const INTRO_VIDEO = 'https://www.youtube.com/embed/MEoIkhIAoYM'
const BRIEFING_VIDEO = 'https://www.youtube.com/embed/jpy0bGkedzo'
const COMPLETED_VIDEO = 'https://www.youtube.com/watch?O62VFKxnXDc'

const MISSION_ID = 'b9498ffd-5702-4a7e-aa7b-9cdcfd71b126'

// const BATCH_ONE_RELEASE_TIME = '2021-11-06T20:30:00'
const BATCH_TWO_RELEASE_TIME = '2021-11-06T21:00:00'
const COMPLETED_VIDEO_RELEASE_TIME = '2021-11-06T21:30:00'

type StagedPhotos = { photo1: File | null; photo2: File | null; photo3: File | null }

export const Humanity: React.FC = () => {
  const [mounted, setMounted] = useState<boolean>(false)
  const [uploading, setUploading] = useState<boolean>(false)
  const [stagedPhotos, setStagedPhotos] = useState<StagedPhotos>({
    photo1: null,
    photo2: null,
    photo3: null
  })
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
            fetchHumanity(teamId).then(({ data }) => {
              console.log('fetched humanity')
            })
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
  if (!isOngoing) return <MissionUnavailable mission={mission.data.mission} />

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

        <h2 className='font-bold text-2xl mt-12'>Game Description 游戏详情</h2>
        <p className='text-true-gray-400 mt-1 whitespace-pre-wrap'>
          {`There will be a total of 2 challenges in this mission, depending on your batch one of the challenges will be locked until 9:00PM, at the time being, complete the challenge that is available.
这任务一共有两个挑战，其中一个挑战在 9:00PM 才会开启，为了节省时间先完成已开启的挑战。
          `}
        </p>

        <div className='mt-8 flex items-center text-2xl'>
          <h2 className='font-bold'>First Challenge 第一挑战</h2> <Icon icon='twemoji:keycap-1' className='ml-2' />
        </div>
        {humanity.data.humanity.batch === 2 ||
        (humanity.data.humanity.batch === 1 && Dayjs(BATCH_TWO_RELEASE_TIME).isBefore(Dayjs())) ? (
          humanity.data.humanity.submittedAt === null ? (
            <>
              <p className='text-true-gray-400 mt-1 whitespace-pre-wrap'>
                {`各位玩家，有项紧急任务需要你们处理🚨
你们将会收到一个故事情节，故事情节中有不少隐藏的玄机需要你们找出来，在接下来的半小时内务必完成‼️
💡 三张照片中共有 7 个玄机

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
              <div className='mt-4'>
                <h3 className='font-bold text-xl'>Storyline 故事情节</h3>
                <Disclosure as='div' className='mt-2'>
                  <Disclosure.Button
                    data-blobity-magnetic='false'
                    data-blobity-tooltip='Click me to view part 1 of the story'
                    className='bg-secondary px-3 py-0.5 rounded-full font-medium'
                  >
                    Part 1
                  </Disclosure.Button>
                  <Disclosure.Panel className='mt-2 whitespace-pre-wrap'>{STORY_PART_ONE}</Disclosure.Panel>
                </Disclosure>
                <Disclosure as='div' className='mt-2'>
                  <Disclosure.Button
                    data-blobity-magnetic='false'
                    data-blobity-tooltip='Click me to view part 2 of the story'
                    className='bg-secondary px-3 py-0.5 rounded-full font-medium'
                  >
                    Part 2
                  </Disclosure.Button>
                  <Disclosure.Panel className='mt-2 whitespace-pre-wrap'>{STORY_PART_TWO}</Disclosure.Panel>
                </Disclosure>
                {/* <p className='whitespace-pre-wrap'>{STORY_PART_TWO}</p> */}
              </div>
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

              <Dropzone
                accept='image/png, image/jpeg'
                onDrop={acceptedFiles => {
                  if (acceptedFiles.length === 0) return
                  if (acceptedFiles.length > 3) {
                    enqueueSnackbar('Can only upload up to 3 photos', { variant: 'error' })
                    return
                  }
                  setStagedPhotos(
                    Object.fromEntries(
                      [0, 1, 2].map(num => [`photo${num + 1}`, acceptedFiles[num] || null])
                    ) as unknown as StagedPhotos
                  )
                }}
                onDropRejected={fileRejections => {
                  fileRejections
                    .map(rejection => rejection.errors.map(error => error.message))
                    .forEach(messages => messages.forEach(message => enqueueSnackbar(message, { variant: 'error' })))
                }}
              >
                {({ getRootProps, getInputProps }) => (
                  <div className=''>
                    <div
                      {...getRootProps()}
                      className='mt-8 flex flex-col justify-center items-center border border-true-gray-500 border-dashed px-8 py-16 text-true-gray-500'
                    >
                      <input {...getInputProps()} />
                      <Icon icon='ph:upload-simple-duotone' className='w-16 h-16' />
                      <p className=''>Drag 'n' drop your files here, or click to select files</p>
                    </div>
                    <div className='flex justify-center items-center mt-4 border border-true-gray-600 py-8 text-true-gray-500'>
                      {Object.values(stagedPhotos).filter(photo => photo).length !== 0 ? (
                        Object.values(stagedPhotos).map(
                          (file, idx) =>
                            file && (
                              <div
                                key={file.name}
                                className={`relative text-true-gray-400 ${
                                  idx !== 0 ? 'ml-8' : ''
                                } flex flex-col justify-center items-center`}
                              >
                                <button
                                  data-blobity-magnetic='false'
                                  className='absolute bg-red-500 rounded-full p-0.5 -top-2 -right-2'
                                  onClick={() => setStagedPhotos({ ...stagedPhotos, [`photo${idx + 1}`]: null })}
                                >
                                  <Icon icon='mdi:close' className='w-4 h-4 text-white' />
                                </button>
                                <img
                                  src={URL.createObjectURL(file)}
                                  alt={file.name}
                                  className={`mb-0.5 object-cover w-64 h-48`}
                                />
                                {file.name}
                              </div>
                            )
                        )
                      ) : (
                        <div className='flex flex-col justify-center items-center'>
                          <Icon icon='ph:file-x' className='w-6 h-6' />
                          <p>no files uploaded yet</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </Dropzone>

              <Button
                className='mt-4 w-20 mx-auto'
                size='small'
                loading={uploading}
                onClick={async () => {
                  if (Object.values(stagedPhotos).filter(file => file).length !== 3) {
                    enqueueSnackbar('Must have 3 photos', { variant: 'error' })
                    return
                  }
                  setUploading(true)
                  const { publicURLs, error } = await bulkUploadFilesToSupabase(
                    Object.values(stagedPhotos).filter(file => file) as File[],
                    'games',
                    `humanity/${user.user.team!.name}`,
                    { cacheControl: '3600', upsert: true }
                  )
                  if (error || !publicURLs) {
                    setUploading(false)
                    enqueueSnackbar('Unable to upload files', { variant: 'error' })
                    return
                  }

                  const photos = Object.fromEntries(
                    publicURLs.map((url, idx) => [`photo${idx + 1}`, url])
                  ) as unknown as {
                    photo1?: string
                    photo2?: string
                    photo3?: string
                  }

                  const teamId = user.user.team!.id

                  const { data, errors } = await upsertHumanity({
                    teamId,
                    batch: TEAM_BATCH_MAP[teamId],
                    gatherLink: TEAM_GATHER_LINK[teamId],
                    missionId: mission.data.mission!.id,
                    submittedAt: Dayjs().toISOString(),
                    ...photos
                  })
                  if (errors || !data) {
                    setUploading(false)
                    enqueueSnackbar('Unable to submit your photos', { variant: 'error' })
                    return
                  }

                  setUploading(false)
                  enqueueSnackbar('successfully uploaded', { variant: 'success' })
                  await fetchHumanity(teamId)
                }}
              >
                Submit
              </Button>
            </>
          ) : (
            <div className='flex flex-col justify-center items-center text-true-gray-500'>
              <Icon icon='fxemoji:whiteheavycheckmark' className='w-20 h-20' />
              <p className='font-medium mt-2'>
                Already submitted at {Dayjs(humanity.data.humanity.submittedAt).toString()}
              </p>
            </div>
          )
        ) : (
          <div className='flex flex-col justify-center items-center mt-12'>
            <Icon icon='ic:baseline-lock' className='text-true-gray-400 w-20 h-20 mb-2' />
            <h2 className='font-bold text-2xl text-true-gray-400'>
              Available {Dayjs(BATCH_TWO_RELEASE_TIME).fromNow()}
            </h2>
            <p className='text-true-gray-500 mt-1'>Visit back after you've finished the challenge in GatherTown</p>
          </div>
        )}

        <div className='mt-12 flex items-center text-2xl mt-12'>
          <h2 className='font-bold'>Second Challenge 第二挑战</h2> <Icon icon='twemoji:keycap-2' className='ml-2' />
        </div>
        {humanity.data.humanity.batch === 2 && Dayjs(BATCH_TWO_RELEASE_TIME).isAfter(Dayjs()) ? (
          <>
            <div className='flex flex-col justify-center items-center mt-12'>
              <Icon icon='ic:baseline-lock' className='text-true-gray-400 w-20 h-20 mb-2' />
              <h2 className='font-bold text-2xl text-true-gray-400'>
                Available {Dayjs(BATCH_TWO_RELEASE_TIME).fromNow()}
              </h2>
              <p className='text-true-gray-500 mt-1'>This is the GatherTown's link to enter the treasury</p>
            </div>
          </>
        ) : humanity.data.humanity.batch === 1 || humanity.data.humanity.submittedAt ? (
          <div className='mt-2'>
            Link🔗:{' '}
            <a
              href={humanity.data.humanity.gatherLink}
              target='_blank'
              rel='noreferrer'
              className='underline text-true-gray-500'
            >
              {humanity.data.humanity.gatherLink}
            </a>
          </div>
        ) : (
          <>
            <div className='flex flex-col justify-center items-center mt-12'>
              <Icon icon='ic:baseline-lock' className='text-true-gray-400 w-20 h-20 mb-2' />
              <h2 className='font-bold text-2xl text-true-gray-400'>Complete above challenge to unlock</h2>
              <p className='text-true-gray-500 mt-1'>This is the GatherTown's link to enter the treasury</p>
            </div>
          </>
        )}

        <div className='mt-12 flex items-center text-2xl'>
          <h2 className='font-bold flex items-center'>
            {Dayjs(COMPLETED_VIDEO_RELEASE_TIME).isBefore(Dayjs()) ? (
              <>
                Surprise for Finale <Icon icon='noto-v1:video-camera' className='ml-2' />
              </>
            ) : (
              <>
                ?????? <Icon icon='noto:package' className='ml-2' />
              </>
            )}
          </h2>
        </div>
        {Dayjs(COMPLETED_VIDEO_RELEASE_TIME).isBefore(Dayjs()) ? (
          <a href={COMPLETED_VIDEO} target='_blank' rel='noreferrer' className='underline text-true-gray-500'>
            Click Me
          </a>
        ) : (
          <div className='flex flex-col justify-center items-center mt-8'>
            <Icon icon='ic:baseline-lock' className='text-true-gray-400 w-20 h-20 mb-2' />
            <h2 className='font-bold text-2xl text-true-gray-400'>
              Available at {Dayjs(COMPLETED_VIDEO_RELEASE_TIME).format('h:mmA')}
            </h2>
            <p className='text-true-gray-500 mt-1'>Visit back later</p>
          </div>
        )}
      </div>
    </MissionLayout>
  )
}
