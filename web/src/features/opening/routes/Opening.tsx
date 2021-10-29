import { Transition } from '@headlessui/react'
import { Icon } from '@iconify/react'
import { EmojiData, Picker } from 'emoji-mart'
import React, { Fragment, useState } from 'react'
import { useEffectOnce, useInterval } from 'react-use'

import { Button } from '@/components/Elements'
import { OnlinePanel, EmojiWrapper, Scene } from '@/features/opening'

import 'emoji-mart/css/emoji-mart.css'
import 'virtual:windi.css'
import '@/styles/globals.css'

export const Opening: React.FC = () => {
  const [mounted, setMounted] = useState<boolean>(false)
  const [btnClicked, setBtnClicked] = useState<boolean>(false)
  const [pickerOpen, setPickerOpen] = useState<boolean>(false)
  const [emojis, setEmojis] = useState<EmojiData[]>([])

  useEffectOnce(() => setMounted(true))
  // const [videoElem, setVideoElem] = useState<HTMLVideoElement | null>()
  // useEffectOnce(() => setVideoElem(document.getElementById('logo-opening') as HTMLVideoElement))
  // useEvent('click', () => videoElem!.play())

  useInterval(() => {
    if (emojis.length === 0) return
    setEmojis(emojis.slice(0, emojis.length - 1))
  }, 1000)

  if (!mounted) return null

  return (
    <>
      <video id='logo-opening' width='0' height='0' controls>
        <source src='/video/TheBoxLogo_Opening.mp4' type='video/mp4' />
      </video>
      <div className='bg-dark-800 h-[100vh] relative'>
        {!btnClicked && (
          <Button
            className='absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10'
            style={{ bottom: '25%' }}
            onClick={() => setBtnClicked(true)}
          >
            Haha
          </Button>
        )}

        <OnlinePanel />

        <Transition
          show={pickerOpen}
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='absolute z-10' style={{ bottom: '4rem', right: '1rem' }}>
            <Picker
              title='Pick your emoji…'
              emoji='point_up'
              theme='dark'
              onSelect={emoji => setEmojis([...emojis, emoji])}
            />
          </div>
        </Transition>
        <button
          className='absolute rounded-full bg-secondary p-2 right-4 bottom-4 z-10 focus:outline-none hover:bg-secondary-hover shadow-lg'
          onClick={() => setPickerOpen(!pickerOpen)}
        >
          <Icon icon='fluent:emoji-surprise-24-regular' className='w-6 h-6' />
        </button>

        <div className='absolute bottom-8 right-4 flex flex-col' style={{ zIndex: 11 }}>
          {emojis.map((emoji, index) => (
            <EmojiWrapper key={emoji.name + index} emoji={emoji} size={25} lifetime={1500} />
          ))}
        </div>

        <Scene />
      </div>
    </>
  )
}
