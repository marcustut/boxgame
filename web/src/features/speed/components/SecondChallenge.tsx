import { Icon } from '@iconify/react'
import { useSnackbar } from 'notistack'
import React, { useCallback, useState } from 'react'

import { Input, Button } from '@/components/Elements'

const PASSWORD = '!@#thebox2021#@!'

type SecondChallengeProps = {
  unlocked: boolean
  setUnlocked: (unlocked: boolean) => void
}

export const SecondChallenge: React.FC<SecondChallengeProps> = ({ unlocked, setUnlocked }) => {
  const [inputText, setInputText] = useState<string>('')
  const { enqueueSnackbar } = useSnackbar()

  const handleUnlock = useCallback(() => {
    if (unlocked) {
      enqueueSnackbar('Already unlocked!', { variant: 'info' })
      return
    }
    if (inputText.trim().toLowerCase() === PASSWORD) {
      setUnlocked(true)
      enqueueSnackbar('Congratulations!', { variant: 'success' })
      return
    }
    enqueueSnackbar('Password incorrect', { variant: 'error' })
  }, [enqueueSnackbar, inputText, setUnlocked, unlocked])

  return (
    <>
      <div className='mt-12 flex items-center text-2xl'>
        <h2 className='font-bold'>Second Challenge</h2> <Icon icon='twemoji:keycap-2' className='ml-2' />
      </div>
      <p className='text-true-gray-400 mt-1 whitespace-pre-wrap'>
        Before proceeding to this challenge, make sure you have acquired the password from the previous challenge. In
        this challenge, you'll first have to <strong>unlock the link to 7 images below.</strong> The goal of this
        challenge is to find the clues we left behind in the images, decode them and{' '}
        <strong>find the final message</strong>. Follow the instructions provided in the unlocked materials below.{' '}
        {'\n'}
        开始这挑战之前，请确保您已从上一个挑战中获取密码。这挑战中，您首先必须解锁以下 7
        张图片的链接。这个挑战的目标是找到我们在图像中留下的线索，解码它们并找到最终的信息。
        按照以下解锁材料中提供的说明进行操作。
      </p>
      <div className='flex justify-center items-center'>
        <div className='p-4 bg-dark-300 rounded-lg mt-4 w-full'>
          <Input placeholder='Enter password here...' onChange={e => setInputText(e.target.value)} />
          <Button className='w-full mt-4' onClick={handleUnlock}>
            Unlock
          </Button>
        </div>
        <div className='flex items-center p-4 w-full'>
          Download Link:{' '}
          <div
            className={`px-4 py-2 ${
              !unlocked ? 'w-48 bg-dark-200' : ''
            } flex items-center font-medium text-true-gray-500 ml-2`}
          >
            {!unlocked ? (
              <>
                <Icon icon='mdi:lock' className='mr-2' />
                Locked
              </>
            ) : (
              <a
                data-blobity-magnetic='false'
                className='hover:text-secondary hover:underline flex items-center'
                href={`${window.location.pathname}/donwload`}
                target='_blank'
                rel='noreferrer'
              >
                <Icon icon='mdi:lock-open-variant' className='mr-2' />
                Click me
              </a>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
