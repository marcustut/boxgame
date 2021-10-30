import { Dialog, Transition } from '@headlessui/react'
import { Icon } from '@iconify/react'
import React, { Fragment } from 'react'

type ReadReminderProps = {
  open: boolean
  onClose: () => void
  content?: string | React.ReactElement
}

export const ReadReminder: React.FC<ReadReminderProps> = ({ open, onClose, content }) => {
  return (
    <Transition show={open} as={Fragment}>
      <Dialog onClose={onClose}>
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
          <div className='flex flex-col justify-center items-center fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 <sm:w-4/5 w-96 px-6 py-4 bg-dark-400/90 rounded-lg shadow-2xl'>
            <div className='flex justify-center items-center mb-4 font-bold w-full'>
              Reminder <Icon icon='fxemoji:lightbulb' className='ml-1' />
              <button
                data-blobity-magnetic='false'
                type='button'
                className='p-1 bg-dark-200 rounded-full absolute right-4 focus:outline-none'
                onClick={onClose}
              >
                <Icon icon='mdi:close' />
              </button>
            </div>
            <span className='text-true-gray-300 text-sm text-center'>
              {content ? content : 'Remember to read the description!'}
            </span>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  )
}
