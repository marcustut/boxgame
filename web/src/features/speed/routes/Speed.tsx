import { Icon } from '@iconify/react'
import Dayjs from 'dayjs'
import RelativeTime from 'dayjs/plugin/relativeTime'
import { Form, Formik } from 'formik'
import React, { useMemo, useState } from 'react'
import Countdown from 'react-countdown'
import { useEffectOnce } from 'react-use'

import { Button, InputField } from '@/components/Elements'
import { LoadingPage } from '@/components/Misc'
import { MissionUnavailable, MissionLayout, useFetchMission, ReadReminder } from '@/features/mission'
import { FirstChallenge, SecondChallenge, SubmissionForm } from '@/features/speed'
import { useAuth } from '@/lib/auth'
import { sleep } from '@/utils/sleep'

Dayjs.extend(RelativeTime)

const INTRO_VIDEO = 'https://www.youtube.com/embed/caFKHAcLwSI'
const COMPLETED_VIDEO = 'https://www.youtube.com/watch?v=caFKHAcLwSI'

export const Speed: React.FC = () => {
  const [mounted, setMounted] = useState<boolean>(false)
  const [unlocked, setUnlocked] = useState<boolean>(false)
  const [completed, setCompleted] = useState<boolean>(false)
  const [reminderOpen, setReminderOpen] = useState<boolean>(true)
  const { user } = useAuth()
  const { mission, fetchMission } = useFetchMission()

  const isOngoing = useMemo(
    () =>
      Dayjs(mission?.data.mission?.startAt).isBefore(Dayjs()) && Dayjs(Dayjs()).isBefore(mission?.data.mission?.endAt),
    [mission]
  )

  useEffectOnce(() => {
    setMounted(true)
    fetchMission('6f0621af-2e3e-4be6-90dd-24f3ee763f5d').then(() => console.log('fetched mission'))
  })

  // if still loading data
  if (!user || !mounted || !mission) return <LoadingPage />

  // if unable to load mission
  if (!mission.data.mission) return <div>Error loading mission</div>

  // if mission is closed
  // if (!isOngoing) return <MissionUnavailable mission={mission.data.mission} />

  return (
    <>
      <MissionLayout isHall utilities={{ p: 'px-4 pt-4 pb-96', pos: 'relative' }}>
        <div className='flex flex-col'>
          <h2 className='font-bold text-2xl'>You are now in {mission.data.mission.title}'s Mission Page</h2>
          <div className='flex <sm:flex-col items-center mx-auto'>
            <iframe
              width='400'
              height='250'
              src={INTRO_VIDEO}
              title='YouTube video player'
              frameBorder='0'
              allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
              allowFullScreen
              className='mt-12'
            />
            <div className='flex items-center ml-4 text-lg <sm:mt-2'>
              <Icon
                icon='emojione:index-pointing-up-medium-skin-tone'
                className='mr-2 transform rotate-270 <sm:rotate-0'
              />
              <span className='text-true-gray-400'>Refer to the video if needed</span>
            </div>
          </div>

          <h2 className='font-bold text-2xl mt-12'>Game Description</h2>
          <p className='text-true-gray-400 mt-1'>
            In this mission, you will have to compete against the time, if you look on the bottom right, there is a
            countdown timer, when the timer reaches 0, the mission will close and no one will be able to submit their
            answer.
          </p>

          <FirstChallenge />
          <SecondChallenge unlocked={unlocked} setUnlocked={unlocked => setUnlocked(unlocked)} />
          <SubmissionForm completed={completed} setCompleted={completed => setCompleted(completed)} />

          {completed ? (
            <div className='flex flex-col justify-center items-center mt-24'>
              <Icon icon='emojione:party-popper' className='w-20 h-20 mb-4' />
              <h2 className='font-bold text-2xl'>Congratulations on completing all challenges above!</h2>
              <p className='text-true-gray-400 mt-1'>
                Here's one question for you and your teammates:{' '}
                <span className='font-bold text-lg text-true-gray-50'>What is inside the box?</span>
              </p>
              <span className='text-true-gray-400 text-sm'>
                Discuss with your groupmates and come up with a reasonable guess, the results will be revelead later on
                in our Social Page
              </span>
              <Formik
                initialValues={{ answer: '' }}
                onSubmit={async values => {
                  await sleep(500)
                  window.open(COMPLETED_VIDEO)
                }}
              >
                {({ isSubmitting }) => (
                  <Form className='mt-4 bg-dark-300 <sm:w-full w-96 p-4 rounded-lg flex flex-col items-center justify-center'>
                    <InputField name='answer' placeholder='Enter your guess here...' className='w-full' />
                    <Button
                      type='submit'
                      loading={isSubmitting}
                      disabled={isSubmitting}
                      size='small'
                      className='mt-4 text-sm px-4 py-2'
                    >
                      Submit
                    </Button>
                  </Form>
                )}
              </Formik>
              <span className='text-true-gray-500 text-sm mt-2'>
                A teaser for next game will be played after you submitted your guess
              </span>
            </div>
          ) : (
            <div className='flex flex-col justify-center items-center mt-24'>
              <Icon icon='ic:baseline-lock' className='text-true-gray-400 w-20 h-20 mb-2' />
              <h2 className='font-bold text-2xl text-true-gray-400'>Complete above challengs to unlock</h2>
              <p className='text-true-gray-500 mt-1'>
                This is just an extra task, it won't affect your submission time
              </p>
            </div>
          )}
        </div>

        <Countdown
          intervalDelay={0}
          precision={3}
          date={new Date(mission.data.mission.endAt)}
          renderer={props => (
            <div className='fixed bottom-4 right-4 text-2xl text-red-600 text-left' style={{ fontFamily: 'Audiowide' }}>
              {String(props.hours).padStart(2, '0')}:{String(props.minutes).padStart(2, '0')}:
              {String(props.seconds).padStart(2, '0')}
            </div>
          )}
        />
      </MissionLayout>

      <ReadReminder open={reminderOpen} onClose={() => setReminderOpen(false)} />
    </>
  )
}
