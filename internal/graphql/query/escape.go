package query

import (
	"context"

	"github.com/brianvoe/gofakeit/v6"
	"github.com/marcustut/thebox/internal/graphql/model"
	"github.com/marcustut/thebox/internal/postgresql"
)

func GetUniqueEscape(ctx context.Context, db *postgresql.PrismaClient, param postgresql.EscapeEqualsUniqueWhereParam) (*model.Escape, error) {
	// fetch the escape
	fetchedEscape, err := db.Escape.FindUnique(param).Exec(ctx)
	if err != nil {
		return nil, err
	}

	// parse escape to graphql type
	escape, err := model.MapToEscape(fetchedEscape)
	if err != nil {
		return nil, err
	}

	return escape, nil
}

func UpsertUniqueEscape(ctx context.Context, db *postgresql.PrismaClient, param *model.UpsertEscapeInput) (*model.Escape, error) {
	upsertedEscape, err := db.Escape.UpsertOne(
		postgresql.Escape.TeamID.Equals(param.TeamID),
	).Create(
		postgresql.Escape.ID.Set(gofakeit.UUID()),
		postgresql.Escape.Team.Link(postgresql.Team.ID.Equals(param.TeamID)),
		postgresql.Escape.MissionOne.SetIfPresent(param.MissionOne),
		postgresql.Escape.MissionTwo.SetIfPresent(param.MissionTwo),
		postgresql.Escape.MissionThree.SetIfPresent(param.MissionThree),
	).Update(
		postgresql.Escape.MissionOne.SetIfPresent(param.MissionOne),
		postgresql.Escape.MissionTwo.SetIfPresent(param.MissionTwo),
		postgresql.Escape.MissionThree.SetIfPresent(param.MissionThree),
	).Exec(ctx)
	if err != nil {
		return nil, err
	}

	// parse escape to graphql type
	escape, err := model.MapToEscape(upsertedEscape)
	if err != nil {
		return nil, err
	}

	return escape, nil
}
