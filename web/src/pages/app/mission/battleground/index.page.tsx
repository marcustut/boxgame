import React from 'react'

import { CheckAuth, LockPage } from '@/components/Misc'
import { Battleground } from '@/features/battleground'

const BattlegroundPage: React.FC = () => (
  <CheckAuth>
    <LockPage>
      <Battleground />
    </LockPage>
  </CheckAuth>
)

export default BattlegroundPage
