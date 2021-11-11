import React from 'react'

import { Powercard as PowercardEnum } from '@/graphql'
import { WindiUtilities } from '@/types/windi'
import { constructClassName } from '@/utils'

export const cards = {
  [PowercardEnum.REVERSE]: {
    name: 'Reverse',
    description: 'hahaa',
    img: 'https://vfqzgsbgmlvglbygosna.supabase.in/storage/v1/object/public/assets/Powercard/Reverse.png'
  },
  [PowercardEnum.BLOCK]: {
    name: 'Block',
    description: 'hahaha',
    img: 'https://vfqzgsbgmlvglbygosna.supabase.in/storage/v1/object/public/assets/Powercard/Block.jpg'
  },
  [PowercardEnum.ONEMORECHANCE]: {
    name: 'One More Chance',
    description: 'hahaha',
    img: 'https://vfqzgsbgmlvglbygosna.supabase.in/storage/v1/object/public/assets/Powercard/OneMoreChance.png'
  }
}

type PowercardProps = {
  powercard: PowercardEnum
  onClick?: () => void
  utilities?: WindiUtilities
  className?: string
}

export const Powercard: React.FC<PowercardProps> = ({ powercard, onClick, utilities, className = '' }) => {
  const defaultUtilities: WindiUtilities = {
    p: 'p-4',
    bg: 'group bg-dark-100 hover:bg-primary',
    border: 'rounded-lg',
    transition: 'transition duration-200 ease-in-out'
  }
  return (
    <button className={constructClassName(utilities, defaultUtilities, className)} onClick={onClick}>
      <img src={cards[powercard].img} alt={cards[powercard].name} className='rounded-2xl w-42 h-64' />
      <p className='font-bold text-lg mt-3'>{cards[powercard].name}</p>
      <p className='text-sm text-true-gray-400 group-hover:text-white'>{cards[powercard].description}</p>
    </button>
  )
}
