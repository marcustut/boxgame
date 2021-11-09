package query

import (
	"context"
	"time"

	"github.com/brianvoe/gofakeit/v6"
	"github.com/marcustut/thebox/internal/graphql/model"
	"github.com/marcustut/thebox/internal/postgresql"
)

func GetUniqueHumanity(ctx context.Context, db *postgresql.PrismaClient, param postgresql.HumanityEqualsUniqueWhereParam) (*model.Humanity, error) {
	// fetch the humanity
	fetchedHumanity, err := db.Humanity.FindUnique(param).Exec(ctx)
	if err != nil {
		return nil, err
	}

	// parse humanity to graphql type
	humanity, err := model.MapToHumanity(fetchedHumanity)
	if err != nil {
		return nil, err
	}

	return humanity, nil
}

func GetManyHumanity(ctx context.Context, db *postgresql.PrismaClient, page model.PaginationInput, params ...postgresql.HumanityWhereParam) ([]*model.Humanity, error) {
	// build query
	query := db.Humanity.FindMany(params...)

	// apply pagination
	query = query.Take(page.Limit)
	query = query.Skip(page.Offset)

	// fetch the humanities
	fetchedHumanities, err := query.Exec(ctx)
	if err != nil {
		return nil, err
	}

	// parse humanities to graphql type
	humanities, err := model.MapToHumanities(fetchedHumanities)
	if err != nil {
		return nil, err
	}

	return humanities, nil
}

func UpsertUniqueHumanity(ctx context.Context, db *postgresql.PrismaClient, param *model.UpsertHumanityInput) (*model.Humanity, error) {
	upsertedHumanity, err := db.Humanity.UpsertOne(
		postgresql.Humanity.TeamID.Equals(param.TeamID),
	).Create(
		postgresql.Humanity.ID.Set(gofakeit.UUID()),
		postgresql.Humanity.UpdatedAt.Set(time.Now()),
		postgresql.Humanity.Batch.Set(param.Batch),
		postgresql.Humanity.GatherLink.Set(param.GatherLink),
		postgresql.Humanity.Mission.Link(postgresql.Mission.ID.Equals(param.MissionID)),
		postgresql.Humanity.Team.Link(postgresql.Team.ID.Equals(param.TeamID)),
		postgresql.Humanity.SubmittedAt.SetIfPresent(param.SubmittedAt),
		postgresql.Humanity.Photo1.SetIfPresent(param.Photo1),
		postgresql.Humanity.Photo2.SetIfPresent(param.Photo2),
		postgresql.Humanity.Photo3.SetIfPresent(param.Photo3),
	).Update(
		postgresql.Humanity.UpdatedAt.Set(time.Now()),
		postgresql.Humanity.SubmittedAt.SetIfPresent(param.SubmittedAt),
		postgresql.Humanity.Photo1.SetIfPresent(param.Photo1),
		postgresql.Humanity.Photo2.SetIfPresent(param.Photo2),
		postgresql.Humanity.Photo3.SetIfPresent(param.Photo3),
	).Update().Exec(ctx)
	if err != nil {
		return nil, err
	}

	// parse humanity to graphql type
	humanity, err := model.MapToHumanity(upsertedHumanity)
	if err != nil {
		return nil, err
	}

	return humanity, nil
}
