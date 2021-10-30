import { Icon } from '@iconify/react'
import Dayjs from 'dayjs'
import RelativeTime from 'dayjs/plugin/relativeTime'
import { Form, Formik } from 'formik'
import { useSnackbar } from 'notistack'
import React, { useEffect, useMemo, useState } from 'react'
import Countdown from 'react-countdown'
import { useEffectOnce } from 'react-use'

import { Button, InputField } from '@/components/Elements'
import { LoadingPage } from '@/components/Misc'
import { MissionUnavailable, MissionLayout, useFetchMission, ReadReminder } from '@/features/mission'
import { useFetchSpeed, useUpsertSpeed } from '@/features/speed'
import { FirstChallenge, SecondChallenge, SubmissionForm } from '@/features/speed'
import { useSpeedGame } from '@/hooks/stores'
import { useAuth } from '@/lib/auth'
import { getDuration } from '@/utils/time'

Dayjs.extend(RelativeTime)

const INTRO_VIDEO = 'https://www.youtube.com/embed/Y42egm2GEJ4'
const BRIEFING_VIDEO = 'https://www.youtube.com/embed/BRfg6XGzAEs'
const COMPLETED_VIDEO = 'https://www.youtube.com/watch?v=9edf-__ocLU'

const MISSION_ID = '6f0621af-2e3e-4be6-90dd-24f3ee763f5d'

const TimerWrapper: React.FC = ({ children }) => (
  <div className='fixed bottom-4 right-4 text-2xl text-red-600 text-left' style={{ fontFamily: 'Audiowide' }}>
    {children}
  </div>
)

export const Speed: React.FC = () => {
  const [mounted, setMounted] = useState<boolean>(false)
  const [unlocked, setUnlocked] = useState<boolean>(false)
  const [completed, setCompleted] = useState<boolean>(false)
  const [reminderOpen, setReminderOpen] = useState<boolean>(true)
  const { enqueueSnackbar } = useSnackbar()
  const { user } = useAuth()
  const { mission, fetchMission } = useFetchMission()
  const { speed, fetchSpeed } = useFetchSpeed()
  const { upsertSpeed } = useUpsertSpeed()
  const { completedAt } = useSpeedGame()

  const isOngoing = useMemo(
    () =>
      Dayjs(mission?.data.mission?.startAt).isBefore(Dayjs()) && Dayjs(Dayjs()).isBefore(mission?.data.mission?.endAt),
    [mission]
  )

  useEffectOnce(() => {
    setMounted(true)
    fetchMission(MISSION_ID).then(() => console.log('fetched mission'))
  })

  useEffect(() => {
    if (!user || !user.user.team) return
    fetchSpeed(user.user.team.id)
      .then(() => console.log('fetched speed'))
      .catch(err => {
        if (err.message === 'ErrNotFound') {
          upsertSpeed({ teamId: user.user.team!.id, missionId: MISSION_ID }).then(() => {
            console.log('upserted speed')
            fetchSpeed(user.user.team!.id).then(() => console.log('fetched speed'))
          })
        }
      })
  }, [fetchSpeed, upsertSpeed, user])

  // if still loading data
  if (!user || !mounted || !mission || !speed) return <LoadingPage />

  // if unable to load team
  if (!user.user.team) return <div>Error loading team</div>

  // if unable to load mission
  if (!mission.data.mission) return <div>Error loading mission</div>

  // if unable to load speed
  if (!speed.data.speed) return <div>Error loading speed</div>

  // if mission is closed
  // if (!isOngoing) return <MissionUnavailable mission={mission.data.mission} />

  return (
    <>
      <MissionLayout isHall utilities={{ p: 'px-4 pt-4 pb-96', pos: 'relative' }}>
        <div className='flex flex-col'>
          <h2 className='font-bold text-2xl'>You are now in {mission.data.mission.title}'s Mission Page</h2>
          <div className='w-full flex <sm:flex-col justify-center items-center mx-auto mt-12'>
            <iframe
              src={INTRO_VIDEO}
              title='YouTube video player'
              frameBorder='0'
              allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
              allowFullScreen
              className='w-full h-80 <sm:h-64 <sm:mt-4 sm:mr-2'
            />
            <iframe
              src={BRIEFING_VIDEO}
              title='YouTube video player'
              frameBorder='0'
              allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
              allowFullScreen
              className='w-full h-80 <sm:h-64 <sm:mt-4 sm:ml-2'
            />
          </div>
          <div className='flex justify-center items-center text-lg mt-4'>
            <Icon icon='emojione:index-pointing-up-medium-skin-tone' className='mr-2 transform' />
            <span className='text-true-gray-400'>Refer to the video if needed 若有需要请参阅视频</span>
          </div>

          <h2 className='font-bold text-2xl mt-12'>Game Description</h2>
          <p className='text-true-gray-400 mt-1'>
            In this mission, you will have to compete against the time, if you look on the bottom right, there is a
            countdown timer, when the timer reaches 0, the mission will close and no one will be able to submit their
            answer.
            在这个任务中，你必须与时间竞争，如果你看右下角，有一个倒数计时器，当计时器到0时，任务将关闭，不能再提交你们的答案
          </p>

          <FirstChallenge />
          <SecondChallenge unlocked={unlocked} setUnlocked={unlocked => setUnlocked(unlocked)} />
          <SubmissionForm
            team={user.user.team}
            mission={mission.data.mission}
            completed={completed}
            setCompleted={completed => setCompleted(completed)}
          />

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
                onSubmit={async ({ answer }) => {
                  const { data, errors } = await upsertSpeed({
                    teamId: user.user.team!.id,
                    missionId: mission.data.mission!.id,
                    answer
                  })
                  if (errors || !data) {
                    enqueueSnackbar('Unable to submit your answer now', { variant: 'error' })
                    console.error(errors)
                    return
                  }
                  enqueueSnackbar('Successfully submitted your answer', { variant: 'success' })
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

        {completedAt ? (
          <TimerWrapper>{getDuration(Dayjs(mission.data.mission.startAt), Dayjs(completedAt))}</TimerWrapper>
        ) : (
          <Countdown
            intervalDelay={0}
            precision={3}
            date={new Date(mission.data.mission.endAt)}
            renderer={props => (
              <TimerWrapper>
                {String(props.hours).padStart(2, '0')}:{String(props.minutes).padStart(2, '0')}:
                {String(props.seconds).padStart(2, '0')}
              </TimerWrapper>
            )}
          />
        )}
      </MissionLayout>

      <ReadReminder open={reminderOpen} onClose={() => setReminderOpen(false)} />
    </>
  )
}
