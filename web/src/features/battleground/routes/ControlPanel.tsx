import { useMutation } from '@apollo/client'
import { Icon } from '@iconify/react'
import { Formik, Form } from 'formik'
import { useSnackbar } from 'notistack'
import React, { useEffect, useState } from 'react'

import { Button } from '@/components/Elements'
import { LoadingPage } from '@/components/Misc'
import { CREATE_BATTLEGROUND_ROOM, GET_TEAMS_WITHOUT_MEMBERS, useQueryWithTypes } from '@/graphql'
import { CreateBattlegroundRoom, CreateBattlegroundRoomVariables } from '@/graphql/types/CreateBattlegroundRoom'
import { GetTeamsWithoutMembers, GetTeamsWithoutMembersVariables } from '@/graphql/types/GetTeamsWithoutMembers'

export const ControlPanel: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar()
  const [selectedTeams, setSelectedTeams] = useState<Record<string, boolean>>({})
  const [createBattlegroundRoom] = useMutation<CreateBattlegroundRoom, CreateBattlegroundRoomVariables>(
    CREATE_BATTLEGROUND_ROOM
  )
  const { data, error } = useQueryWithTypes<GetTeamsWithoutMembers, GetTeamsWithoutMembersVariables>(
    GET_TEAMS_WITHOUT_MEMBERS,
    { variables: { page: { limit: 50, offset: 0 } } }
  )

  useEffect(() => {
    if (!data) return
    setSelectedTeams(Object.fromEntries(data.teams.map(team => [team.id, false])))
  }, [data])

  return (
    <div className='container p-4 mx-auto'>
      <h2 className='font-bold text-2xl'>Battleground's Control Panel</h2>
      <p className='text-true-gray-400'>You can use the following place to create a room.</p>
      <Formik
        initialValues={{}}
        onSubmit={async () => {
          const teamIds = Object.entries(selectedTeams)
            .filter(e => e[1])
            .flatMap(v => v[0])

          if (teamIds.length < 3) {
            enqueueSnackbar('Must select more than 2 teams', { variant: 'warning' })
            return
          }

          try {
            const { data, errors } = await createBattlegroundRoom({ variables: { param: { teamIds } } })
            if (errors || !data || !data.createBattlegroundRoom) {
              console.error(errors)
              enqueueSnackbar(`Unable to create a room\n${JSON.stringify(errors, null, 2)}`, { variant: 'warning' })
              return
            }

            enqueueSnackbar('Room created successfully, redirecting to room...', { variant: 'success' })
            setTimeout(
              () => (window.location.href = `${window.location.pathname}/room/${data.createBattlegroundRoom!.code}`),
              1000
            )
          } catch (err) {
            console.error(err)
            enqueueSnackbar(`Unable to create a room\n${JSON.stringify(err, null, 2)}`, { variant: 'warning' })
            return
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form className='mt-8'>
            <div className='grid grid-cols-3 gap-3'>
              {data ? (
                data.teams.map(team => (
                  <button
                    type='button'
                    key={team.id}
                    className={`flex items-center rounded-lg px-4 py-3 ${
                      selectedTeams[team.id] ? 'bg-secondary' : 'bg-dark-300'
                    }`}
                    onClick={() => setSelectedTeams({ ...selectedTeams, [team.id]: !selectedTeams[team.id] })}
                  >
                    <img
                      src={
                        team.avatarUrl
                          ? team.avatarUrl
                          : `https://ui-avatars.com/api/?name=${encodeURIComponent(team.name!)}`
                      }
                      alt={`${team.name}'s avatar'`}
                      className='w-7 h-7 rounded-full object-cover mr-2'
                    />
                    {team.name}
                    <Icon
                      icon={`${selectedTeams[team.id] ? 'ion:checkbox-outline' : 'ion:android-checkbox-outline-blank'}`}
                      className='ml-auto'
                    />
                  </button>
                ))
              ) : error ? (
                <div>Error loading teams</div>
              ) : (
                <LoadingPage />
              )}
            </div>
            <p className='mt-4 text-right text-true-gray-300'>
              {Object.values(selectedTeams).filter(x => x).length} / {Object.keys(selectedTeams).length} selected
            </p>
            <Button
              type='submit'
              loading={isSubmitting}
              disabled={Object.values(selectedTeams).filter(x => x).length === 0 || isSubmitting}
              className='mt-4 mx-auto'
            >
              Create Room
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  )
}
