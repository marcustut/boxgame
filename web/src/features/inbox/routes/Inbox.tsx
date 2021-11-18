import { Icon } from '@iconify/react'
import Dayjs from 'dayjs'
import { useSnackbar } from 'notistack'
import React, { useEffect, useState } from 'react'

import { AppLayout, Spinner } from '@/components/Elements'
import { useAuth } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { definitions } from '@/types/supabase'

export const Inbox: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar()
  const { user } = useAuth()
  const [mails, setMails] = useState<definitions['Mail'][]>()
  useEffect(() => {
    if (!user) return
    supabase
      .from<definitions['Mail']>('Mail')
      .select('*')
      .eq('receiver', user.user.username)
      .then(({ data, error }) => {
        if (error || !data) {
          console.error('Unable to fetch mails')
          enqueueSnackbar('Unable to fetch mails', { variant: 'error' })
          return
        }
        setMails(data)
      })
  }, [enqueueSnackbar, user])
  return (
    <AppLayout>
      <div className='my-6'>
        <div className='flex justify-between items-center'>
          <div className='flex items-center'>
            <h2 className='text-2xl font-bold'>Inbox</h2>
            <Icon icon='emojione:postbox' className='ml-2 w-6 h-6' />
          </div>
          <button
            data-blobity-magnetic='false'
            className='bg-dark-200 px-3 py-1 rounded-md text-sm text-true-gray-300 hover:bg-secondary hover:text-white transition duration-200 ease-in-out'
            onClick={() => (window.location.href = `${window.location.pathname}/send`)}
          >
            Send a mail
          </button>
        </div>

        <div className='bg-dark-300/50 p-4 rounded-md mt-4'>
          {mails ? (
            mails.length !== 0 ? (
              mails.map((mail, i) => (
                <button
                  key={mail.id}
                  data-blobity-magnetic={false}
                  className={`w-full flex px-4 py-3 rounded-sm hover:bg-dark-100 ${
                    !mail.read ? 'font-bold bg-dark-300' : 'text-true-gray-400 bg-dark-200 relative'
                  } ${i !== 0 ? 'mt-4' : ''}`}
                  onClick={() => (window.location.href = `${window.location.pathname}/mail?id=${mail.id}`)}
                >
                  {mail.read && (
                    <div className='px-2 py-0.5 rounded-full absolute -top-2.5 right-2 bg-secondary text-xs font-medium text-dark-200'>
                      already read
                    </div>
                  )}
                  {mail.sender}
                  <p className='ml-4'>{mail.title}</p>
                  <p className='ml-auto'>{Dayjs(mail.created_at).format('MMM DD')}</p>
                </button>
              ))
            ) : (
              <div className='flex flex-col justify-center items-center text-true-gray-400'>
                <Icon icon='mdi:email-remove-outline' className='w-12 h-12' />
                you have no mails
              </div>
            )
          ) : (
            <Spinner />
          )}
        </div>
      </div>
    </AppLayout>
  )
}
