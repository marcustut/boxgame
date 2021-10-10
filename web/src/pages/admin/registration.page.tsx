import React, { useEffect, useState } from 'react'
import { useEffectOnce } from 'react-use'
import { Dialog } from '@headlessui/react'

import { supabase } from '@/lib/supabase'
import { Button, Input } from '@/components/Elements'

const RegistrationPage: React.FC = () => {
  const [mounted, setMounted] = useState<boolean>(false)
  const [password, setPassword] = useState<string>('')
  const [passwordOpen, setPasswordOpen] = useState<boolean>(true)
  const [registrationData, setRegistrationData] = useState<string>('')

  useEffectOnce(() => {
    setMounted(true)
    ;(async () => {
      const { data, error } = await supabase.from('UserDetailsView').select().csv()
      if (error || !data) {
        alert('Error fetching user details')
        console.error(error)
        return
      }
      setRegistrationData(data)
    })()
  })

  useEffect(() => {
    if (password.trim().toLowerCase() === 'cyc_m100_abcd') setPasswordOpen(false)
  }, [password])

  if (!mounted) return null

  return (
    <>
      <div className='min-h-[100vh] flex justify-center items-center'>
        <Button
          onClick={() => {
            if (typeof window === 'undefined') return

            const a = document.createElement('a')
            const file = new Blob([registrationData], { type: 'text/csv' })
            a.href = URL.createObjectURL(file)
            a.download = `TheBox_UserDetails_${new Date().toLocaleString()}.csv`
            a.click()
          }}
        >
          Download
        </Button>
      </div>
      <Dialog open={passwordOpen} onClose={() => {}}>
        <Dialog.Overlay className='inset-0 transition ease-in-out duration-200 fixed backdrop-filter backdrop-blur-sm backdrop-brightness-75' />

        <div className='font-mono z-10 <sm:w-[95%] bg-dark-300 flex-col rounded-lg text-word-active-light p-4 transform transition top-[50%] ease-in-out left-[50%] shadow-2xl w-96 translate-x-[-50%] translate-y-[-50%] duration-200 fixed items-center ronded-2xl dark: flex dark:bg-dark-shade2 dark:text-word-active-dark'>
          <Input placeholder='Enter admin password' onChange={event => setPassword(event.target.value)} />
        </div>
      </Dialog>
    </>
  )
}

export default RegistrationPage
