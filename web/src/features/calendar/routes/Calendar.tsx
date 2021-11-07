import { Icon } from '@iconify/react'
import Dayjs from 'dayjs'
import React from 'react'

import { AppLayout } from '@/components/Elements'

enum EventStatus {
  DONE,
  COMINGSOON
}

const events = [
  { event: 'Mystery Escape 绝地逃离', timestamp: '2021-10-29T20:00:00', status: EventStatus.DONE },
  { event: 'Time Hunter 极速斗决', timestamp: '2021-10-30T20:00:00', status: EventStatus.DONE },
  { event: 'Bloody Treasury 善恶的金库', timestamp: '2021-11-06T20:00:00', status: EventStatus.DONE },
  { event: 'Epic Breakout 超然绝活', timestamp: '2021-11-10T23:59:59', status: EventStatus.COMINGSOON },
  { event: 'Cyber Battleground 终结之战', timestamp: '2021-10-29T16:00:00', status: EventStatus.COMINGSOON }
]

export const Calendar: React.FC = () => {
  return (
    <AppLayout>
      <div className='flex items-center text-2xl font-bold mb-12'>
        Calendar
        <Icon icon='emojione:spiral-calendar' className='ml-2' />
      </div>
      <table className='w-full'>
        <thead>
          <tr className='border-b border-true-gray-500 text-center capitalize text-true-gray-200'>
            <th className='pb-3 font-medium'>event</th>
            <th className='pb-3 font-medium'>date</th>
            <th className='pb-3 font-medium'>time</th>
            <th className='pb-3 font-medium'>status</th>
          </tr>
        </thead>
        <tbody>
          {events.map(event => (
            <tr key={event.event} className='border-b border-true-gray-500 text-true-gray-200'>
              <td className='py-3 text-center font-medium'>{event.event}</td>
              <td className='py-3 text-center'>{Dayjs(event.timestamp).format('DD MMM YYYY (ddd)')}</td>
              <td className='py-3 text-center'>{Dayjs(event.timestamp).format('h.mmA')}</td>
              <td className={`py-3 text-center`}>
                {event.status === EventStatus.DONE ? (
                  <div className='flex justify-center items-center text-green-400 font-medium'>
                    <Icon icon='entypo:dot-single' />
                    done
                  </div>
                ) : event.status === EventStatus.COMINGSOON ? (
                  <div className='flex justify-center items-center text-yellow-400 font-medium'>
                    <Icon icon='eos-icons:three-dots-loading' />
                    coming soon
                  </div>
                ) : (
                  ''
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </AppLayout>
  )
}
