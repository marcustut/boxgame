// import { Icon } from '@iconify/react'
import React from 'react'
import { useEffectOnce } from 'react-use'

// import { AppLayout } from '@/components/Elements'
import { LoadingPage } from '@/components/Misc'
import { useAuth } from '@/lib/auth'

export const Dashboard: React.FC = () => {
  const { user } = useAuth()

  useEffectOnce(() => {
    window.location.href = `${window.location.pathname}/social`
  })

  // show loading when fetching user
  if (!user) return <LoadingPage />

  return (
    <>
      <LoadingPage />
      {/* <AppLayout>
        <h3 className='font-bold text-2xl flex items-center'>
          Latest News <Icon icon='ps:megaphone' className='ml-2 w-6 h-6' />
        </h3>
        <div className='bg-dark-300 p-4 rounded-lg mt-2'>
          We are launching tonight at 8.00PM{' '}
          <Button
            size='small'
            color='secondary'
            className='mt-2'
            onClick={() => window.open('https://zoom.us/my/shawnwong')}
          >
            Click me for Zoom <Icon icon='grommet-icons:zoom' className='ml-2' />
          </Button>
        </div>
      </AppLayout> */}
    </>
  )
}
