package query

import (
	"context"
	"time"

	"github.com/brianvoe/gofakeit/v6"
	"github.com/marcustut/thebox/internal/graphql/model"
	"github.com/marcustut/thebox/internal/postgresql"
)

func GetUniqueBattlegroundRoom(ctx context.Context, db *postgresql.PrismaClient, param postgresql.BattlegroundRoomEqualsUniqueWhereParam) (*model.BattlegroundRoom, error) {
	// fetch the battlegroundRoom
	fetchedBattlegrounRoom, err := db.BattlegroundRoom.FindUnique(param).Exec(ctx)
	if err != nil {
		return nil, err
	}

	// parse battlegroundRoom to graphql type
	battlegroundRoom, err := model.MapToBattlegroundRoom(fetchedBattlegrounRoom)
	if err != nil {
		return nil, err
	}

	return battlegroundRoom, nil
}

func GetManyBattlegrounRoom(ctx context.Context, db *postgresql.PrismaClient, page model.PaginationInput, params ...postgresql.BattlegroundRoomWhereParam) ([]*model.BattlegroundRoom, error) {
	// build query
	query := db.BattlegroundRoom.FindMany(params...)

	// apply pagination
	query = query.Take(page.Limit)
	query = query.Skip(page.Offset)

	// fetch the battlegroundRooms
	fetchedBattlegroundRooms, err := query.Exec(ctx)
	if err != nil {
		return nil, err
	}

	// parse battlegroundRooms to graphql type
	battlegroundRooms, err := model.MapToBattlegroundRooms(fetchedBattlegroundRooms)
	if err != nil {
		return nil, err
	}

	return battlegroundRooms, nil
}

func CreateBattlegroundRoom(ctx context.Context, db *postgresql.PrismaClient, param *model.NewBattlegroundRoom) (*model.BattlegroundRoom, error) {
	createdBattlegroundRoom, err := db.BattlegroundRoom.CreateOne(
		postgresql.BattlegroundRoom.Code.Set(gofakeit.Regex("[0-9]{4}")),
		postgresql.BattlegroundRoom.UpdatedAt.Set(time.Now()),
		postgresql.BattlegroundRoom.TeamIDs.Set(param.TeamIds),
	).Exec(ctx)
	if err != nil {
		return nil, err
	}

	// parse battlegroundRoom to graphql type
	battlegroundRoom, err := model.MapToBattlegroundRoom(createdBattlegroundRoom)
	if err != nil {
		return nil, err
	}

	return battlegroundRoom, nil
}

func UpdateUniqueBattlegroundRoom(ctx context.Context, db *postgresql.PrismaClient, param postgresql.BattlegroundRoomEqualsUniqueWhereParam, updateParam *model.UpdateBattlegroundRoomInput) (*model.BattlegroundRoom, error) {
	params := []postgresql.BattlegroundRoomSetParam{
		postgresql.BattlegroundRoom.UpdatedAt.Set(time.Now()),
		postgresql.BattlegroundRoom.Status.SetIfPresent((*postgresql.RoomStatus)(updateParam.Status)),
	}

	if updateParam.TeamIds != nil {
		params = append(params, postgresql.BattlegroundRoom.TeamIDs.Set(updateParam.TeamIds))
	}

	updatedBattlegroundRoom, err := db.BattlegroundRoom.FindUnique(param).Update(
		params...,
	).Exec(ctx)
	if err != nil {
		return nil, err
	}

	// parse battlegroundRoom to graphql type
	battlegroundRoom, err := model.MapToBattlegroundRoom(updatedBattlegroundRoom)
	if err != nil {
		return nil, err
	}

	return battlegroundRoom, nil
}
