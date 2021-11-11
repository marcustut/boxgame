import React from 'react'

import { CheckAuth, LockPage } from '@/components/Misc'
import { ControlPanel } from '@/features/battleground'

const BattlegroundControlPanel: React.FC = () => (
  <CheckAuth>
    <LockPage>
      <ControlPanel />
    </LockPage>
  </CheckAuth>
)

export default BattlegroundControlPanel
