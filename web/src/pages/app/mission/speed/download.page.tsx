import React from 'react'

import { CheckAuth } from '@/components/Misc'
import { Download } from '@/features/speed'

const DownloadPage: React.FC = () => (
  <CheckAuth>
    <Download />
  </CheckAuth>
)

export default DownloadPage
