import { Dialog, Transition } from '@headlessui/react'
import { Icon } from '@iconify/react'
import { Form, Formik } from 'formik'
import { useSnackbar } from 'notistack'
import React, { Fragment, useCallback, useEffect, useState } from 'react'
import Highlighter from 'react-highlight-words'
import { useEffectOnce } from 'react-use'

import { Button, InputField } from '@/components/Elements'
import { LoadingPage } from '@/components/Misc'
import { EscapeLayout } from '@/features/escape'
import { useMysteryGame } from '@/hooks/stores'
import { supabase } from '@/lib/supabase'

const NUMBER_OF_HIGHLIGHTS = 4

const raw_paragraphs = [
  `在这繁华世界里，每个人都在追求自己喜爱的人事物。在这个世界里充满着许多的虚拟和不真实在这个不堪一击的社会里，人人都在为着某样事物在卖命哪有什么事物是值得留恋的呢？在这人海茫茫中有个女生在这虚拟的世界里稍有名气，时常在线上花里花俏得到人的认可和关注。`,
  `“五道题答对了四道，恭喜你，高先生，你在线上答对的我的问题，让我为你唱一首歌！“ ”谢谢你，这位Anthony你给的爱心我收到了“ ”哦？我喜欢怎样类型的男生，特别是每天都上线关注我的你们啊“ ”哎呀！！原来现在已经12点了也很晚了，我也是时候下线了，我们明天再见！“ 这位女生每一天都上线开播到12点才休息，而她的职业是知名的直播主，因为是直播主的关系，时常出到街上都会被认出来，时不时就有人和她打招呼，又突然有人要求合照。所以这些都成为了她出街时很平常的画面和习惯。`,
  `同时回到现实生活，这位女生还是需要上班来维持日常所需。毕竟另外一份直播职业还不能支撑一个月的开销，有一天在办公的电脑信箱里不断弹出匿名的邮件，但邮件里面都是写着一堆莫名其妙的‘我爱你’使得这女生顿时充满了疑问。`,
  `当她放工回家的路上，一直感觉有人跟在他的背后。她时不时回头望，但也看不到任何人影，当他走到一个地铁下水道时，突然有个人冒出来把她吓了一大跳！原来是她的闺蜜出来四处找她，那位女生才知道闺蜜突然收到一个陌生号码发来一堆照片都是这位女生在街上和出入家时的一些日常照，导致她的闺蜜十分慌张地跑出来找她, 担心她会有什么事那位女生也不以为然的说道可能是那些在直播间的人吧，因为她常常会收到粉丝的礼物，或者收到一些祝福卡之类的。所以有些铁粉迷恋她也不出奇啊，但也不会做出什么奇葩的事啦她的闺蜜还是很担心她的安全，但没办法只能叮咛她千万个小心在外头。`,
  `当那位女生回到家，整个人都累的不得了因为等下10点晚上还要惯例的开直播，而现在才8点钟，那有一些私人时间做些自己的事整理好自己，梳洗之后正在热一杯快熟面在厨房里，突然电话响起，她接了但是在电话里头没有任何人说话，她不断的询问对方是谁，到头来还是一个寂寞。挂了电话，准备去客厅看电视，因为她有个习惯是每晚开播前都要看当日的《新闻报报看》，缓缓的来到客厅，那女生坐在沙发上，不知不觉又到了10点钟，开始上线要开当天的直播。一如往常的又一堆男粉在那里送这个送那个，搞得这女生在镜头前载歌载舞。就这样的闹了2个小时，又是到时候下线和每个男粉说再见了。`,
  `人啊，就是不断在满足别人的需要，来换取自己的利益和虚荣，是什么东西让我们不能再像以前那样？这朴实无华的日子又到到几时呢？每个早上起来关了闹钟声，是什么在叫醒你？虚荣和利益？ 还是梦想和未来？`
]

const important_phrase_map = {
  明星: '知名的直播主',
  粉丝: '铁粉迷恋她',
  送: '常常会收到粉丝的礼物',
  新闻: '都要看当日的《新闻报报看》',
  沙发: '坐在沙发'
}

export const Mystery: React.FC = () => {
  const [mounted, setMounted] = useState<boolean>(false)
  const [dialogOpen, setDialogOpen] = useState<boolean>(false)
  const [congratulationOpen, setCongratulationOpen] = useState<boolean>(false)
  const [points, setPoints] = useState<number>(0)
  const { enqueueSnackbar } = useSnackbar()
  const { keywords, setKeywords, answer, setAnswer, searchWords, setSearchWords } = useMysteryGame()

  // redirect to login if not authenticated
  useEffectOnce(() => {
    if (!supabase.auth.session()) window.location.href = '/login'
  })

  const handleHighlight = useCallback(() => {
    const selection = window.getSelection()
    if (!selection || selection.isCollapsed) return

    // can only highlight up to 20 words at once
    if (selection.toString().length > 20) {
      enqueueSnackbar('You can only highlight up to 20 words at one moment', { variant: 'error' })
      return
    }

    // highlighting across paragraph is not allowed
    if (selection.toString().includes('\n')) {
      enqueueSnackbar('Highlighting across paragraphs is not allowed', { variant: 'error' })
      return
    }

    // if highlighted word already exists then remove it
    if (searchWords.includes(selection.toString())) {
      setSearchWords(searchWords.filter(sw => sw !== selection.toString()))
      return
    }

    // make sure highlighted word is not a substring of already highlighted words
    for (let i = 0; i < searchWords.length; i++) {
      if (searchWords[i].search(selection.toString()) !== -1) return
    }

    // if user has no more highlights
    if (NUMBER_OF_HIGHLIGHTS - searchWords.length <= 0) {
      enqueueSnackbar('You have no more highlights left', { variant: 'error' })
      return
    }

    // if user found the keyword
    Object.entries(important_phrase_map).forEach(([keyword, phrase]) => {
      if (selection.toString().includes(phrase)) {
        setKeywords({ ...keywords, [keyword]: true })
      }
    })

    setSearchWords([...searchWords, selection.toString()])
  }, [searchWords])

  useEffect(() => {
    if (!Object.values(keywords).includes(true)) return
    setCongratulationOpen(true)
  }, [keywords])

  useEffectOnce(() => setMounted(true))

  if (!mounted) return <LoadingPage />

  return (
    <EscapeLayout utilities={{ p: 'px-4 pt-4 pb-20', pos: 'relative' }}>
      {/*<div>*/}
      {/*  <h1 className='text-lg font-bold'>Game Rules</h1>*/}
      {/*  <p className='text-sm'>*/}
      {/*    <strong>Objective:</strong> 从我们给的资料中去查寻事件的真相*/}
      {/*  </p>*/}
      {/*  <p className='text-sm'>*/}
      {/*    <strong>Objective:</strong> 从我们给的资料中去查寻事件的真相*/}
      {/*  </p>*/}
      {/*  <p className='text-sm'>*/}
      {/*    <strong>Objective:</strong> 从我们给的资料中去查寻事件的真相*/}
      {/*  </p>*/}
      {/*  <p className='text-sm'>*/}
      {/*    <strong>Objective:</strong> 从我们给的资料中去查寻事件的真相*/}
      {/*  </p>*/}
      {/*</div>*/}

      <div className='w-full flex justify-center'>
        <p className='text-2xl font-bold'>Points: {points}</p>
      </div>

      <div className='mt-8'>
        <h1 className='text-lg font-bold'>Paragraph</h1>
        <div>
          {raw_paragraphs.map((p, i) => (
            <div key={p} className={`font-medium text-justify <sm:text-sm sm:tracking-wide ${i !== 0 ? 'mt-4' : ''}`}>
              <Highlighter textToHighlight={p} searchWords={searchWords} onMouseUp={handleHighlight} />
            </div>
          ))}
        </div>
      </div>

      <div className='mt-8'>
        <Formik
          initialValues={{ answer }}
          onSubmit={async ({ answer }) => {
            setPoints(0)
            Object.keys(important_phrase_map).forEach(phrase => {
              if (answer.includes(phrase)) {
                setPoints(points => points + 10)
                enqueueSnackbar('You got 10 points!', { variant: 'success' })
              }
            })
          }}
        >
          {({ isSubmitting, values, setValues }) => (
            <Form>
              <InputField
                name='answer'
                placeholder='Enter your answer here...'
                inputClassName='bg-dark-300 focus:outline-none focus:ring-2 focus:ring-primary-ring border-0'
                textarea
                rows={10}
                onChange={e => {
                  setAnswer(e.target.value)
                  setValues({ answer: e.target.value })
                }}
              />
              <Button type='submit' loading={isSubmitting} disabled={isSubmitting} className='text-sm w-full mt-4'>
                Submit
              </Button>
            </Form>
          )}
        </Formik>
      </div>

      <div className='fixed bottom-4 right-4'>
        <button
          className='flex justify-center items-center bg-secondary w-12 h-12 p-1 rounded-full mb-4 ml-auto focus:outline-none shadow-lg'
          onClick={() => setDialogOpen(true)}
        >
          <Icon icon='twemoji:light-bulb' className='w-6 h-6' />
        </button>
        <div className='bg-secondary px-4 py-2 rounded-full text-sm shadow-lg'>
          {NUMBER_OF_HIGHLIGHTS - searchWords.length} highlights remaining
        </div>
      </div>

      <Transition show={dialogOpen} as={Fragment}>
        <Dialog onClose={() => setDialogOpen(false)}>
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
            <div className='px-4 py-4 flex flex-col justify-center items-center fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 <sm:w-4/5 w-96 bg-dark-400/90 rounded-lg shadow-2xl'>
              <div className='flex justify-center items-center mb-2 font-bold w-full'>
                Keywords Bag <Icon icon='emojione-v1:handbag' className='ml-2' />
                <button
                  type='button'
                  className='p-1 bg-dark-200 rounded-full absolute right-4 focus:outline-none'
                  onClick={() => setDialogOpen(false)}
                >
                  <Icon icon='mdi:close' />
                </button>
              </div>
              <div className='my-2'>
                {Object.entries(keywords)
                  .filter(v => v[1])
                  .map(keyword => (
                    <span key={keyword[0]} className='px-2 py-1 mx-1 bg-secondary rounded-full text-sm'>
                      {keyword[0]}
                    </span>
                  ))}
              </div>
              <p className='text-sm text-true-gray-400'>
                {Object.entries(keywords).filter(v => v[1]).length}/{Object.entries(keywords).length} collected
              </p>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition>

      <Transition show={congratulationOpen} as={Fragment}>
        <Dialog onClose={() => setCongratulationOpen(false)}>
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
            <div className='px-4 py-4 flex flex-col justify-center items-center fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 <sm:w-4/5 w-96 bg-dark-400/90 rounded-lg shadow-2xl bg-confetti-animated'>
              <div className='flex justify-center items-center mb-2 font-bold w-full'>
                Congratulations! <Icon icon='twemoji:clapping-hands-medium-light-skin-tone' className='ml-2' />
                <button
                  type='button'
                  className='p-1 bg-dark-200 rounded-full absolute right-4 focus:outline-none'
                  onClick={() => setCongratulationOpen(false)}
                >
                  <Icon icon='mdi:close' />
                </button>
              </div>
              <div className='my-2 text-sm'>
                You have found the keyword:{' '}
                <span className='font-bold text-lg'>
                  {Object.entries(keywords)
                    .filter(k => k[1])
                    .map(k => k[0])
                    .shift()}
                </span>
              </div>
              <p className='text-sm text-true-gray-400'>
                {Object.entries(keywords).filter(v => v[1]).length}/{Object.entries(keywords).length} collected
              </p>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition>
    </EscapeLayout>
  )
}
