import Dayjs from 'dayjs'
import RelativeTime from 'dayjs/plugin/relativeTime'
import React, { useMemo } from 'react'

import { MissionLayout } from '@/features/mission'
import { GetMission_mission } from '@/graphql/types/GetMission'

Dayjs.extend(RelativeTime)

type MissionClosedProps = {
  mission: GetMission_mission
}

export const MissionUnavailable: React.FC<MissionClosedProps> = ({ mission }) => {
  const isNotOpen = useMemo(() => Dayjs(mission.startAt).isAfter(Dayjs()), [mission])
  const isClosed = useMemo(() => Dayjs(mission.endAt).isBefore(Dayjs()), [mission])

  const message = (
    <>
      {mission.title} {isNotOpen ? 'will be available in' : isClosed ? 'closed' : ''}{' '}
      {isNotOpen ? Dayjs(mission.startAt).fromNow() : isClosed ? Dayjs(mission.endAt).fromNow() : null}
    </>
  )

  return (
    <MissionLayout isHall utilities={{ p: 'px-4 pt-4 pb-20' }}>
      <div className='h-[80vh] flex flex-col justify-center items-center'>
        <h1 className='text-5xl font-bold'>This Mission is Closed</h1>
        <span className='text-sm mt-1 text-true-gray-400'>{message}</span>
      </div>
    </MissionLayout>
  )
}
