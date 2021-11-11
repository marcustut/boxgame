package model

import (
	"time"

	"github.com/marcustut/thebox/internal/postgresql"
)

type BattlegroundRoom struct {
	Code      string     `json:"code"`
	TeamIds   []string   `json:"teamIds"`
	CreatedAt time.Time  `json:"createdAt"`
	UpdatedAt time.Time  `json:"updatedAt"`
	Status    RoomStatus `json:"status"`
}

func MapToBattlegroundRoom(dbBattlegroundRoom *postgresql.BattlegroundRoomModel) (*BattlegroundRoom, error) {
	battlegroundRoom := &BattlegroundRoom{
		Code:      dbBattlegroundRoom.Code,
		TeamIds:   dbBattlegroundRoom.TeamIDs,
		CreatedAt: dbBattlegroundRoom.CreatedAt,
		UpdatedAt: dbBattlegroundRoom.UpdatedAt,
		Status:    RoomStatus(dbBattlegroundRoom.Status),
	}

	return battlegroundRoom, nil
}

func MapToBattlegroundRooms(dbBattlegroundRooms []postgresql.BattlegroundRoomModel) ([]*BattlegroundRoom, error) {
	var battlegroundRooms []*BattlegroundRoom
	for _, dbBattlegroundRoom := range dbBattlegroundRooms {
		battlegroundRoom, err := MapToBattlegroundRoom(&dbBattlegroundRoom)
		if err != nil {
			return nil, err
		}
		battlegroundRooms = append(battlegroundRooms, battlegroundRoom)
	}
	return battlegroundRooms, nil
}
