import { Icon } from '@iconify/react'
import React from 'react'

import { BattlegroundSelection } from '@/graphql'

type SelectionButtonProps = {
  selection: BattlegroundSelection
  onClick?: () => void
}

export const SelectionButton: React.FC<SelectionButtonProps> = ({ selection, onClick }) => {
  return (
    <button
      data-blobity-magnetic={false}
      className={`flex flex-col justify-center items-center p-2 text-secondary hover:text-primary rounded-md mx-4 transition duration-200 ease-in-out`}
      onClick={onClick}
    >
      <Icon
        icon={
          selection === BattlegroundSelection.KING
            ? 'whh:crown'
            : selection === BattlegroundSelection.KNIGHT
            ? 'whh:knight'
            : 'whh:pixelpotion'
        }
        className='w-8 h-8'
      />
      <p className='font-bold capitalize mt-1'>{selection.toLowerCase()}</p>
    </button>
  )
}
