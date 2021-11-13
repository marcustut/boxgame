import React from 'react'

import { CheckAuth } from '@/components/Misc'
import { ControlPanel } from '@/features/battleground'

const BattlegroundControlPanel: React.FC = () => (
  <CheckAuth>
    <ControlPanel />
  </CheckAuth>
)

export default BattlegroundControlPanel
