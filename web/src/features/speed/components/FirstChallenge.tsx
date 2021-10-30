import { Icon } from '@iconify/react'
import React from 'react'

export const FirstChallenge: React.FC = () => {
  return (
    <>
      <div className='mt-12 flex items-center text-2xl'>
        <h2 className='font-bold'>First Challenge</h2> <Icon icon='twemoji:keycap-1' className='ml-2' />
      </div>
      <p className='text-true-gray-400 mt-1'>
        In this first challenge, you and your teammate will have to complete 碰糖 using an Instagram filter provided
        below. First, <strong>open the Instagram filter</strong> by scanning the QR or clicking the link provided. Then,
        complete the challenge <strong>using the 40 seconds setting</strong> and post it to your story by tagging{' '}
        <strong className='italic'>#TheBox2021</strong> and <strong className='italic'>#GroupName</strong> below. After
        posting, wait for our message, <strong>we will DM you the password for the next challenge.</strong>
      </p>
      <div className='flex <sm:flex-col justify-evenly items-center mt-4'>
        <div className='flex flex-col items-center text-center'>
          <img
            src='https://vfqzgsbgmlvglbygosna.supabase.in/storage/v1/object/public/assets/InstaFilterQR.png'
            alt='InstaFilterQR'
            className='w-50 h-50 mt-2'
          />
          <a
            data-blobity-magnetic='false'
            href='https://www.instagram.com/ar/190897399826883'
            target='_blank'
            rel='noreferrer'
            className='text-true-gray-400 hover:text-secondary hover:underline font-medium text-sm mt-1'
          >
            Instagram Filter (Click Me)
          </a>
        </div>
        <div className='flex flex-col items-center text-center <sm:mt-4'>
          <img
            src='https://vfqzgsbgmlvglbygosna.supabase.in/storage/v1/object/public/assets/Biscuit40Second.jpg'
            alt='Biscuit40Second'
            className='w-48'
          />
          <a
            data-blobity-magnetic='false'
            href='https://vfqzgsbgmlvglbygosna.supabase.in/storage/v1/object/public/assets/Biscuit40Second.jpg'
            target='_blank'
            rel='noreferrer'
            className='text-true-gray-400 hover:text-secondary hover:underline font-medium text-sm mt-1'
          >
            Choose 40 seconds
          </a>
        </div>
        <div className='flex flex-col items-center text-center <sm:mt-4'>
          <img
            src='https://vfqzgsbgmlvglbygosna.supabase.in/storage/v1/object/public/assets/BiscuitHashTag.jpg'
            alt='Biscuit40Second'
            className='w-48'
          />
          <a
            data-blobity-magnetic='false'
            href='https://vfqzgsbgmlvglbygosna.supabase.in/storage/v1/object/public/assets/BiscuitHashTag.jpg'
            target='_blank'
            rel='noreferrer'
            className='text-true-gray-400 hover:text-secondary hover:underline font-medium text-sm mt-1'
          >
            Hashtag #TheBox2021 and #GroupName
          </a>
        </div>
        <div className='flex flex-col items-center text-center <sm:mt-4'>
          <video
            controls
            src='https://vfqzgsbgmlvglbygosna.supabase.in/storage/v1/object/public/assets/BiscuitExample.mp4'
            className='w-48'
          />
          <a
            data-blobity-magnetic='false'
            href='https://vfqzgsbgmlvglbygosna.supabase.in/storage/v1/object/public/assets/BiscuitExample.mp4'
            target='_blank'
            rel='noreferrer'
            className='text-true-gray-400 hover:text-secondary hover:underline font-medium text-sm mt-1'
          >
            Success Example
          </a>
        </div>
      </div>
    </>
  )
}
