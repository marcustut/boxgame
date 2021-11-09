import { useMutation } from '@apollo/client'
import { Icon } from '@iconify/react'
import { useSnackbar } from 'notistack'
import React, { useEffect, useState } from 'react'
import Dropzone from 'react-dropzone'

import { Button } from '@/components/Elements'
import { LoadingPage } from '@/components/Misc'
import { useFetchDiscovery } from '@/features/discovery'
import { MissionLayout } from '@/features/mission'
import { UPSERT_DISCOVERY } from '@/graphql'
import { UpsertDiscovery, UpsertDiscoveryVariables } from '@/graphql/types/UpsertDiscovery'
import { useAuth } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

const MISSION_ID = '7cb65a74-0694-4d04-a39b-21eb8f051097'

const INTRO_VIDEO = 'https://www.youtube.com/embed/LFueGgO1zXw'

export const Discovery: React.FC = () => {
  const [file, setFile] = useState<File>()
  const [loading, setLoading] = useState<boolean>(false)
  const { user } = useAuth()
  const { enqueueSnackbar } = useSnackbar()
  const { discovery, fetchDiscovery } = useFetchDiscovery()
  const [upsertDiscovery] = useMutation<UpsertDiscovery, UpsertDiscoveryVariables>(UPSERT_DISCOVERY)

  useEffect(() => {
    if (!user || !user.user.team) return
    fetchDiscovery(user.user.team.id)
      .then(() => console.log('fetched discovery'))
      .catch(err => {
        if (err.message === 'ErrNotFound') {
          upsertDiscovery({ variables: { param: { teamId: user.user.team!.id, missionId: MISSION_ID } } }).then(() => {
            console.log('upserted discovery')
            fetchDiscovery(user.user.team!.id).then(() => console.log('fetched discovery'))
          })
        }
      })
  }, [fetchDiscovery, upsertDiscovery, user])

  if (!user || !discovery) return <LoadingPage />

  return (
    <MissionLayout isHall utilities={{ p: 'px-4 pt-4 pb-96', pos: 'relative' }}>
      <div className='w-full flex <sm:flex-col justify-center items-center mx-auto mt-12'>
        <iframe
          src={INTRO_VIDEO}
          title='YouTube video player'
          frameBorder='0'
          allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
          allowFullScreen
          className='w-full h-80 <sm:h-64 <sm:mt-4 sm:mr-2'
        />
      </div>
      <div className='flex justify-center items-center text-lg mt-4'>
        <Icon icon='emojione:index-pointing-up-medium-skin-tone' className='mr-2 transform' />
        <span className='text-true-gray-400'>Refer to the video if needed 若有需要请参阅视频</span>
      </div>

      <h2 className='font-bold text-2xl mt-12'>Game Description 游戏详情</h2>
      <p className='text-true-gray-400 mt-1 whitespace-pre-wrap'>
        {`Combine the video from all of your teammates into one and upload it below (only one video is allowed)
请把组员们的视频都剪辑在一起，并把视频上传到一下区域。(仅能上传一个视频)
          `}
      </p>

      <Dropzone
        accept='video/mp4, video/mpeg'
        onDrop={acceptedFiles => {
          if (acceptedFiles.length === 0) return
          if (acceptedFiles.length > 1) {
            enqueueSnackbar('Can only upload up to 1 video', { variant: 'error' })
            return
          }
          setFile(acceptedFiles[0])
        }}
        onDropRejected={fileRejections => {
          fileRejections
            .map(rejection => rejection.errors.map(error => error.message))
            .forEach(messages => messages.forEach(message => enqueueSnackbar(message, { variant: 'error' })))
        }}
      >
        {({ getRootProps, getInputProps }) => (
          <div className=''>
            <div
              {...getRootProps()}
              className={`mt-8 flex flex-col justify-center items-center border border-true-gray-500 border-dashed px-8 ${
                file ? 'py-8' : 'py-16'
              } text-true-gray-500`}
            >
              {!file ? (
                <>
                  <input {...getInputProps()} />
                  <Icon icon='ph:upload-simple-duotone' className='w-16 h-16' />
                  <p className=''>Drag 'n' drop your files here, or click to select files</p>
                </>
              ) : (
                <>
                  <video controls className='w-full h-96'>
                    <source src={URL.createObjectURL(file)} type='video/mp4' />
                  </video>
                  <p className='mt-2'>{file.name}</p>
                  <div className='flex items-center mt-2'>
                    <Button className='mr-1 text-white' color='secondary' onClick={() => setFile(undefined)}>
                      Cancel
                    </Button>
                    <Button
                      className='ml-1'
                      loading={loading}
                      disabled={loading}
                      onClick={async () => {
                        if (!user.user.team) {
                          enqueueSnackbar('You have not joined a team', { variant: 'error' })
                          return
                        }
                        setLoading(true)

                        enqueueSnackbar('Uploading might take awhile...', { variant: 'info' })
                        const { data, error: uploadErr } = await supabase.storage
                          .from('games')
                          .upload(`discovery/${user.user.team.id}/${file.name}`, file, {
                            cacheControl: '3600',
                            upsert: true
                          })
                        if (uploadErr || !data) {
                          console.error(uploadErr)
                          enqueueSnackbar('Failed to upload the video', { variant: 'error' })
                          return
                        }
                        const { publicURL, error: getUrlErr } = supabase.storage
                          .from('games')
                          .getPublicUrl(`discovery/${user.user.team.id}/${file.name}`)
                        if (getUrlErr || !publicURL) {
                          console.error(getUrlErr)
                          enqueueSnackbar("Failed to get the video's url", { variant: 'error' })
                          return
                        }
                        const { data: updatedDiscovery, errors } = await upsertDiscovery({
                          variables: {
                            param: {
                              teamId: user.user.team.id,
                              missionId: MISSION_ID,
                              submittedAt: new Date().toISOString(),
                              videoUrl: publicURL
                            }
                          }
                        })
                        if (errors || !updatedDiscovery) {
                          console.error(getUrlErr)
                          enqueueSnackbar('Failed to update your video url', { variant: 'error' })
                          return
                        }
                        enqueueSnackbar('Successfully uploaded your video', { variant: 'success' })

                        setLoading(false)
                      }}
                    >
                      Submit
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </Dropzone>
    </MissionLayout>
  )
}
