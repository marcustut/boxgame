import { useMutation } from '@apollo/client'
import { useSnackbar } from 'notistack'
import React, { useState } from 'react'

import { AppLayout, Button, Input } from '@/components/Elements'
import { GET_HUMANITIES, UPDATE_TEAM, useQueryWithTypes } from '@/graphql'
import { GetHumanities, GetHumanitiesVariables, GetHumanities_humanities_team } from '@/graphql/types/GetHumanities'
import { UpdateTeam, UpdateTeamVariables } from '@/graphql/types/UpdateTeam'

type UpdatePointsFieldProps = {
  team: GetHumanities_humanities_team
}

const UpdatePointsField: React.FC<UpdatePointsFieldProps> = ({ team }) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [input, setInput] = useState<string>('')
  const { enqueueSnackbar } = useSnackbar()
  const [updateTeam] = useMutation<UpdateTeam, UpdateTeamVariables>(UPDATE_TEAM)

  return (
    <div className='mt-2 flex items-center'>
      <Input className='w-[200px]' placeholder='points to add...' onChange={event => setInput(event.target.value)} />
      <Button
        loading={loading}
        size='small'
        className='ml-2 px-4 h-full'
        onClick={async () => {
          // check if input is number
          if (!parseInt(input)) {
            enqueueSnackbar('Must be a valid number', { variant: 'error' })
            return
          }

          setLoading(true)

          // confirm whether to proceed
          if (!window.confirm(`Are you sure you want to add ${parseInt(input)} to ${team.name}?`)) {
            setLoading(false)
            return
          }

          try {
            const { data, errors } = await updateTeam({
              variables: { team_id: team.id, param: { points: team.points + parseInt(input) } }
            })
            if (errors || !data) {
              enqueueSnackbar('Failed to update points', { variant: 'error' })
              console.error(errors)
              setLoading(false)
              return
            }
          } catch (err) {
            enqueueSnackbar('Failed to update points', { variant: 'error' })
            console.error(err)
            setLoading(false)
            return
          }

          enqueueSnackbar('Successfully updated points', { variant: 'success' })
          setLoading(false)
        }}
      >
        Add
      </Button>
    </div>
  )
}

export const Marking: React.FC = () => {
  const { data, error } = useQueryWithTypes<GetHumanities, GetHumanitiesVariables>(GET_HUMANITIES, {
    variables: { page: { limit: 50, offset: 0 } }
  })

  if (error || !data) return <div>{JSON.stringify(error, null, 2)}</div>

  return (
    <AppLayout>
      <h2 className='text-2xl font-bold'>Mission 3 (善恶的金库)</h2>
      <div className='my-4'>
        {data.humanities
          .filter(h => h.team.points <= 200)
          .map(humanity => (
            <div key={humanity.id} className='flex flex-col bg-dark-300 p-4 mb-4'>
              <div className='flex'>
                <div className='flex flex-col'>
                  <img className='w-[1000px] h-full' src={humanity.photo1!} alt={`${humanity.team.name}'s' photo1`} />
                  <img className='w-[1000px] h-full' src={humanity.photo2!} alt={`${humanity.team.name}'s' photo2`} />
                  <img className='w-[1000px] h-full' src={humanity.photo3!} alt={`${humanity.team.name}'s' photo3`} />
                </div>
                <div className='flex flex-col w-full justify-center items-center'>
                  <p className='text-2xl font-bold mb-2'>{humanity.team.name}</p>
                  <p className='text-lg'>
                    Current Points: <strong>{humanity.team.points}</strong>
                  </p>
                  <UpdatePointsField team={humanity.team} />
                </div>
              </div>
            </div>
          ))}
      </div>
    </AppLayout>
  )
}
