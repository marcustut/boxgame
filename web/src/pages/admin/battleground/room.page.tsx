import React from 'react'

import { CheckAuth, LoadingPage, LockPage } from '@/components/Misc'
import { RoomControlPanel } from '@/features/battleground'
import { usePageContext } from '@/hooks/usePageContext'

const BattlegroundRoomControlPanel: React.FC = () => {
  const pageContext = usePageContext()

  if (!pageContext) return <LoadingPage />

  return (
    <CheckAuth>
      <LockPage>
        <RoomControlPanel roomCode={pageContext.routeParams['roomCode']} />
      </LockPage>
    </CheckAuth>
  )
}

export default BattlegroundRoomControlPanel
