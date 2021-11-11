import { ApolloCache, ApolloQueryResult, DefaultContext, FetchResult, MutationFunctionOptions } from '@apollo/client'
import { useSnackbar } from 'notistack'
import React from 'react'

import { Button } from '@/components/Elements'
import { RoomStatus } from '@/graphql'
import { GetBattlegroundRoom, GetBattlegroundRoomVariables } from '@/graphql/types/GetBattlegroundRoom'
import { UpdateBattlegroundRoom, UpdateBattlegroundRoomVariables } from '@/graphql/types/UpdateBattlegroundRoom'

type RoomStatusTogglerProps = {
  roomCode: string
  currentStatus: RoomStatus
  updateBattlegroundRoom: (
    options?: MutationFunctionOptions<
      UpdateBattlegroundRoom,
      UpdateBattlegroundRoomVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult<UpdateBattlegroundRoom>>
  fetchBattlegroundRoom: (
    variables?: Partial<GetBattlegroundRoomVariables> | undefined
  ) => Promise<ApolloQueryResult<GetBattlegroundRoom>>
}

export const RoomStatusToggler: React.FC<RoomStatusTogglerProps> = ({
  roomCode,
  currentStatus,
  updateBattlegroundRoom,
  fetchBattlegroundRoom
}) => {
  const { enqueueSnackbar } = useSnackbar()
  return (
    <Button
      color={currentStatus === RoomStatus.ONGOING ? 'secondary' : 'primary'}
      className={`py-1 font-medium`}
      onClick={async () => {
        if (!currentStatus) return
        let toUpdate: RoomStatus = currentStatus
        if (currentStatus === RoomStatus.PREPARING) toUpdate = RoomStatus.ONGOING
        else if (currentStatus === RoomStatus.ONGOING) toUpdate = RoomStatus.ENDED
        else if (currentStatus === RoomStatus.ENDED) toUpdate = RoomStatus.PREPARING

        try {
          const { data, errors } = await updateBattlegroundRoom({
            variables: { code: roomCode, param: { status: toUpdate } }
          })
          if (errors || !data) {
            console.error(errors)
            enqueueSnackbar(`Unable to update room status\n${JSON.stringify(errors, null, 2)}`, {
              variant: 'error'
            })
            return
          }
          fetchBattlegroundRoom()
        } catch (err) {
          console.error(err)
          enqueueSnackbar(`Unable to update room status\n${JSON.stringify(err, null, 2)}`, {
            variant: 'error'
          })
          return
        }
      }}
    >
      {currentStatus === RoomStatus.PREPARING ? 'Start' : currentStatus === RoomStatus.ONGOING ? 'End' : 'Restart'}
    </Button>
  )
}
