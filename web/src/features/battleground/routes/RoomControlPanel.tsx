import { useMutation } from '@apollo/client'
import { useSnackbar } from 'notistack'
import React from 'react'
import { useEffectOnce } from 'react-use'

import { Button } from '@/components/Elements'
import { LoadingPage } from '@/components/Misc'
import { Leaderboard, RoomStatusToggler } from '@/features/battleground'
import { GET_BATTLEGROUND_ROOM, RoomStatus, UPDATE_BATTLEGROUND_ROOM, useQueryWithTypes } from '@/graphql'
import { GetBattlegroundRoom, GetBattlegroundRoomVariables } from '@/graphql/types/GetBattlegroundRoom'
import { UpdateBattlegroundRoom, UpdateBattlegroundRoomVariables } from '@/graphql/types/UpdateBattlegroundRoom'

type RoomControlPanelProps = {
  roomCode: string
}

export const RoomControlPanel: React.FC<RoomControlPanelProps> = ({ roomCode }) => {
  const { enqueueSnackbar } = useSnackbar()
  const [updateBattlegroundRoom] = useMutation<UpdateBattlegroundRoom, UpdateBattlegroundRoomVariables>(
    UPDATE_BATTLEGROUND_ROOM
  )
  const { data, error, refetch } = useQueryWithTypes<GetBattlegroundRoom, GetBattlegroundRoomVariables>(
    GET_BATTLEGROUND_ROOM,
    { variables: { code: roomCode } }
  )

  useEffectOnce(() => {
    if (roomCode.length !== 4) throw new Error('Room Code must be 4 digits')
  })

  if (error) return <div className='flex justify-center items-center h-[100vh]'>No Room with code {roomCode}</div>
  if (!data) return <LoadingPage />

  return (
    <div className='container p-4 mx-auto relative'>
      <div className='flex justify-between'>
        <div className='flex flex-col'>
          <h2 className='font-bold text-2xl'>Battleground Room {roomCode}</h2>
          <p className='text-true-gray-400'>This is where 守护者 can manage the battleground room</p>
        </div>
        <div className='flex flex-col'>
          <p
            className={`font-bold ${
              data.battlegroundRoom.status === RoomStatus.PREPARING
                ? 'text-yellow-400'
                : data.battlegroundRoom.status === RoomStatus.ONGOING
                ? 'text-green-400'
                : 'text-red-400'
            }`}
          >
            <span className='font-normal'>Room Status: </span>
            {data.battlegroundRoom.status}
          </p>
          <RoomStatusToggler
            roomCode={roomCode}
            currentStatus={data.battlegroundRoom.status}
            updateBattlegroundRoom={updateBattlegroundRoom}
            fetchBattlegroundRoom={refetch}
          />
        </div>
      </div>
      <div className='flex items-center'>
        <Leaderboard teamIds={data.battlegroundRoom.teamIds} utilities={{ m: 'mt-4', display: 'block', pos: '' }} />
        <div>Heyy</div>
      </div>
    </div>
  )
}
