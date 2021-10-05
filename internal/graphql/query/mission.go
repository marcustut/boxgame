package query

import (
	"context"

	"github.com/marcustut/thebox/internal/graphql/model"
	"github.com/marcustut/thebox/internal/postgresql"
)

func GetUniqueMission(ctx context.Context, db *postgresql.PrismaClient, param postgresql.MissionEqualsUniqueWhereParam) (*model.Mission, error) {
	// fetch the mission
	fetchedMission, err := db.Mission.FindUnique(param).Exec(ctx)
	if err != nil {
		return nil, err
	}

	// parse mission to graphql type
	mission, err := model.MapToMission(fetchedMission)
	if err != nil {
		return nil, err
	}

	return mission, nil
}

func GetManyMission(ctx context.Context, db *postgresql.PrismaClient, params ...postgresql.MissionWhereParam) ([]*model.Mission, error) {
	// fetch the missions
	fetchedMissions, err := db.Mission.FindMany(params...).Exec(ctx)
	if err != nil {
		return nil, err
	}

	// parse missions to graphql type
	missions, err := model.MapToMissions(fetchedMissions)
	if err != nil {
		return nil, err
	}

	return missions, nil
}
