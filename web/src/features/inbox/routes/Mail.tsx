import { Icon } from '@iconify/react'
import Dayjs from 'dayjs'
import { useSnackbar } from 'notistack'
import React, { useEffect, useState } from 'react'

import { AppLayout, Spinner } from '@/components/Elements'
import { UploadedFileWrapper } from '@/features/inbox/routes'
import { supabase } from '@/lib/supabase'
import { definitions } from '@/types/supabase'

type MailProps = {
  id: string
}

export const Mail: React.FC<MailProps> = ({ id }) => {
  const { enqueueSnackbar } = useSnackbar()
  const [mail, setMail] = useState<definitions['Mail']>()

  useEffect(() => {
    supabase
      .from<definitions['Mail']>('Mail')
      .update({ read: true })
      .select('*')
      .eq('id', id)
      .then(({ data, error }) => {
        if (error || !data) {
          console.error('Unable to fetch mail with id ', id)
          enqueueSnackbar(`Unable to fetch mail with id ${id}`, { variant: 'error' })
          return
        }
        setMail(data[0])
      })
  }, [enqueueSnackbar, id])

  return (
    <AppLayout>
      {mail ? (
        <div className='my-6'>
          <button
            data-blobity-magnetic={false}
            className='flex items-center text-sm mb-4 text-true-gray-400 hover:text-white transition duration-200 ease-in-out'
            onClick={() => (window.location.href = `/app/inbox`)}
          >
            <Icon icon='mdi:chevron-left' className='mr-1 w-6 h-6' />
            Back to Inbox
          </button>
          <h2 className='font-bold text-2xl'>{mail.title}</h2>
          <p className='text-xs text-true-gray-400'>
            from <strong>{mail.sender}</strong> on {Dayjs(mail.created_at).format('MMM DD')}
          </p>
          <div className='my-4'>
            <p className='font-bold text-true-gray-400 text-sm'>Content</p>
            <p className=''>{mail.text !== '' ? mail.text : 'no text'}</p>
          </div>
          <p className='font-bold text-true-gray-400 text-sm'>Attachment</p>
          <div className='border-dashed border p-4 mt-2 border-true-gray-500 flex justify-center items-center text-true-gray-300'>
            {mail.attachment.length === 0 ? (
              <>no attachment</>
            ) : (
              <div className='grid grid-cols-3 gap-4'>
                {mail.attachment.map(a => {
                  const url = a as string
                  const fileExtension = url.split('.').pop()
                  const filename = url.split('/').pop() ?? url
                  const BtnWrapper: React.FC = ({ children }) => (
                    <button data-blobity-magnetic={false} onClick={() => window.open(url)}>
                      {children}
                    </button>
                  )
                  if (fileExtension && ['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension))
                    return (
                      <BtnWrapper key={url}>
                        <UploadedFileWrapper filename={filename}>
                          <img className='object-cover w-56 h-full' src={url} alt={url} />
                        </UploadedFileWrapper>
                      </BtnWrapper>
                    )
                  else if (fileExtension && ['mp4', 'mpeg'].includes(fileExtension))
                    return (
                      <BtnWrapper key={url}>
                        <UploadedFileWrapper filename={filename}>
                          <video controls>
                            <source src={url} type='video/mp4' />
                          </video>
                        </UploadedFileWrapper>
                      </BtnWrapper>
                    )
                  return (
                    <BtnWrapper key={url}>
                      <UploadedFileWrapper filename={filename}>
                        <div className='h-full flex justify-center items-center'>
                          <Icon icon='mdi:file' className='w-12 h-12 text-true-gray-400' />
                        </div>
                      </UploadedFileWrapper>
                    </BtnWrapper>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      ) : (
        <Spinner />
      )}
    </AppLayout>
  )
}
