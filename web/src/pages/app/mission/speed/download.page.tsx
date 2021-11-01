import React from 'react'

import { CheckAuth, LockPage } from '@/components/Misc'
import { Download } from '@/features/speed'

const DownloadPage: React.FC = () => (
  <CheckAuth>
    <LockPage>
      <Download />
    </LockPage>
  </CheckAuth>
)

export default DownloadPage
