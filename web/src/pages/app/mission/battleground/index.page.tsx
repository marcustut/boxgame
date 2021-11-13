import React from 'react'

import { CheckAuth } from '@/components/Misc'
import { Battleground } from '@/features/battleground'

const BattlegroundPage: React.FC = () => (
  <CheckAuth>
    <Battleground />
  </CheckAuth>
)

export default BattlegroundPage
