import React, { useState } from 'react'
import { useEffectOnce } from 'react-use'

import { CheckAuth, LoadingPage } from '@/components/Misc'
import { Mail } from '@/features/inbox/routes'

const MailPage: React.FC = () => {
  const [mailId, setMailId] = useState<string>()

  useEffectOnce(() => {
    const queryParams = Object.fromEntries(new URLSearchParams(window.location.search))
    if (!('id' in queryParams)) throw new Error("Must have 'id' query param")
    setMailId(queryParams['id'])
  })

  if (!mailId) return <LoadingPage />
  return (
    <CheckAuth>
      <Mail id={mailId} />
    </CheckAuth>
  )
}

export default MailPage
