import React from 'react'

import { MissionLayout } from '@/features/mission'

const images = [
  'https://vfqzgsbgmlvglbygosna.supabase.in/storage/v1/object/public/assets/Game2/decode-latest-20.10_01.png',
  'https://vfqzgsbgmlvglbygosna.supabase.in/storage/v1/object/public/assets/Game2/decode-latest-20.10_02.png',
  'https://vfqzgsbgmlvglbygosna.supabase.in/storage/v1/object/public/assets/Game2/decode-latest-20.10_03.png',
  'https://vfqzgsbgmlvglbygosna.supabase.in/storage/v1/object/public/assets/Game2/decode-latest-20.10_04.png',
  'https://vfqzgsbgmlvglbygosna.supabase.in/storage/v1/object/public/assets/Game2/decode-latest-20.10_05.png',
  'https://vfqzgsbgmlvglbygosna.supabase.in/storage/v1/object/public/assets/Game2/decode-latest-20.10_06.png',
  'https://vfqzgsbgmlvglbygosna.supabase.in/storage/v1/object/public/assets/Game2/decode-latest-20.10_07.png'
]

export const Download: React.FC = () => {
  return (
    <MissionLayout isHall utilities={{ p: 'px-4 pt-4 pb-96', pos: 'relative' }}>
      <div className='my-8'>
        <h2 className='text-2xl font-bold mb-2'>Instruction Menu</h2>
        <p>* 分派7个人处理照片和1个人负责阅读指示 Checkout everyone hints (7photo & 1 menu)</p>
        <p>
          * 7个人下载照片并在IG依照以下调色板来调节找用户名字 - 暖色调，饱和度，高亮调，淡化调 Each person download 1
          photo & edit it accordingly the adjustment - Warmth，Saturation，Highlight，Fade
        </p>
        <p>* 在面子书寻找这些用户 Found the @account name & search in FB</p>
        <p>* 复制用户里所发的代码帖 Search their post and copy the code</p>
        <p>* 把这些代码(Binary Code)转换成字体(Text) Convert binary card to text</p>
        <p>
          * 用一下网站转换成字体（Text） Use below link to get specific website -
          <a href='https://www.rapidtables.com/convert/number/binary-to-ascii.html' target='_blank' rel='noreferrer'>
            https://www.rapidtables.com/convert/number/binary-to-ascii.html
          </a>
        </p>
        <p>* 转换后字体(网址)点击找出关键词 Find hidden word in the website</p>
        <p>* 把关键词拼成一个句子 Combine as a sentence</p>
      </div>
      <div className='flex flex-col justify-center items-center'>
        {images.map((image, index) => (
          <img
            key={image}
            src={image}
            alt={`${image}'s img'`}
            className={`w-64 h-64 cursor-pointer ${index !== 0 ? 'mt-4' : ''}`}
            onClick={() => window.open(image)}
          />
        ))}
      </div>
    </MissionLayout>
  )
}
