import React from 'react'

import { LoadingPage } from '@/components/Misc'
import { RoomControlPanel } from '@/features/battleground'
import { usePageContext } from '@/hooks/usePageContext'

const BattlegroundRoomControlPanel: React.FC = () => {
  const pageContext = usePageContext()

  if (!pageContext) return <LoadingPage />

  return <RoomControlPanel roomCode={pageContext.routeParams['roomCode']} />
}

export default BattlegroundRoomControlPanel
