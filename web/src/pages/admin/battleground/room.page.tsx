import React, { useState } from 'react'
import { useEffectOnce } from 'react-use'

import { CheckAuth, LoadingPage, LockPage } from '@/components/Misc'
import { RoomControlPanel } from '@/features/battleground'

const BattlegroundRoomControlPanel: React.FC = () => {
  const [roomCode, setRoomCode] = useState<string>()

  useEffectOnce(() => {
    const queryParams = Object.fromEntries(new URLSearchParams(window.location.search))
    if (!('code' in queryParams)) throw new Error("Must have 'code' query param")
    setRoomCode(queryParams['code'])
  })

  if (!roomCode) return <LoadingPage />
  return (
    <CheckAuth>
      <LockPage>
        <RoomControlPanel roomCode={roomCode} />
      </LockPage>
    </CheckAuth>
  )
}

export default BattlegroundRoomControlPanel
