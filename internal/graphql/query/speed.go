package query

import (
	"context"
	"time"

	"github.com/brianvoe/gofakeit/v6"
	"github.com/marcustut/thebox/internal/graphql/model"
	"github.com/marcustut/thebox/internal/postgresql"
)

func GetUniqueSpeed(ctx context.Context, db *postgresql.PrismaClient, param postgresql.SpeedEqualsUniqueWhereParam) (*model.Speed, error) {
	// fetch the speed
	fetchedSpeed, err := db.Speed.FindUnique(param).Exec(ctx)
	if err != nil {
		return nil, err
	}

	// parse speed to graphql type
	speed, err := model.MapToSpeed(fetchedSpeed)
	if err != nil {
		return nil, err
	}

	return speed, nil
}

func GetManySpeed(ctx context.Context, db *postgresql.PrismaClient, page model.PaginationInput, params ...postgresql.SpeedWhereParam) ([]*model.Speed, error) {
	// build query
	query := db.Speed.FindMany(params...)

	// apply pagination
	query = query.Take(page.Limit)
	query = query.Skip(page.Offset)

	// fetch the speeds
	fetchedSpeeds, err := query.Exec(ctx)
	if err != nil {
		return nil, err
	}

	// parse speeds to graphql type
	speeds, err := model.MapToSpeeds(fetchedSpeeds)
	if err != nil {
		return nil, err
	}

	return speeds, nil
}

func UpsertUniqueSpeed(ctx context.Context, db *postgresql.PrismaClient, param *model.UpsertSpeedInput) (*model.Speed, error) {
	upsertedSpeed, err := db.Speed.UpsertOne(
		postgresql.Speed.TeamID.Equals(param.TeamID),
	).Create(
		postgresql.Speed.ID.Set(gofakeit.UUID()),
		postgresql.Speed.UpdatedAt.Set(time.Now()),
		postgresql.Speed.Mission.Link(postgresql.Mission.ID.Equals(param.MissionID)),
		postgresql.Speed.Team.Link(postgresql.Team.ID.Equals(param.TeamID)),
		postgresql.Speed.CompletedAt.SetIfPresent(param.CompletedAt),
		postgresql.Speed.Answer.SetIfPresent(param.Answer),
	).Update(
		postgresql.Speed.UpdatedAt.Set(time.Now()),
		postgresql.Speed.CompletedAt.SetIfPresent(param.CompletedAt),
		postgresql.Speed.Answer.SetIfPresent(param.Answer),
	).Update().Exec(ctx)
	if err != nil {
		return nil, err
	}

	// parse speed to graphql type
	speed, err := model.MapToSpeed(upsertedSpeed)
	if err != nil {
		return nil, err
	}

	return speed, nil
}
