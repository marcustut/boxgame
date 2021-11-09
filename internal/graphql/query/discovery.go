package query

import (
	"context"
	"time"

	"github.com/brianvoe/gofakeit/v6"
	"github.com/marcustut/thebox/internal/graphql/model"
	"github.com/marcustut/thebox/internal/postgresql"
)

func GetUniqueDiscovery(ctx context.Context, db *postgresql.PrismaClient, param postgresql.DiscoveryEqualsUniqueWhereParam) (*model.Discovery, error) {
	// fetch the discovery
	fetchedDiscovery, err := db.Discovery.FindUnique(param).Exec(ctx)
	if err != nil {
		return nil, err
	}

	// parse discovery to graphql type
	discovery, err := model.MapToDiscovery(fetchedDiscovery)
	if err != nil {
		return nil, err
	}

	return discovery, nil
}

func GetManyDiscovery(ctx context.Context, db *postgresql.PrismaClient, page model.PaginationInput, params ...postgresql.DiscoveryWhereParam) ([]*model.Discovery, error) {
	// build query
	query := db.Discovery.FindMany(params...)

	// apply pagination
	query = query.Take(page.Limit)
	query = query.Skip(page.Offset)

	// fetch the discoveries
	fetchedDiscoveries, err := query.Exec(ctx)
	if err != nil {
		return nil, err
	}

	// parse discoveries to graphql type
	discoveries, err := model.MapToDiscoveries(fetchedDiscoveries)
	if err != nil {
		return nil, err
	}

	return discoveries, nil
}

func UpsertUniqueDiscovery(ctx context.Context, db *postgresql.PrismaClient, param *model.UpsertDiscoveryInput) (*model.Discovery, error) {
	upsertedDiscovery, err := db.Discovery.UpsertOne(
		postgresql.Discovery.TeamID.Equals(param.TeamID),
	).Create(
		postgresql.Discovery.ID.Set(gofakeit.UUID()),
		postgresql.Discovery.UpdatedAt.Set(time.Now()),
		postgresql.Discovery.Mission.Link(postgresql.Mission.ID.Equals(param.MissionID)),
		postgresql.Discovery.Team.Link(postgresql.Team.ID.Equals(param.TeamID)),
		postgresql.Discovery.SubmittedAt.SetIfPresent(param.SubmittedAt),
		postgresql.Discovery.VideoURL.SetIfPresent(param.VideoURL),
	).Update(
		postgresql.Discovery.UpdatedAt.Set(time.Now()),
		postgresql.Discovery.SubmittedAt.SetIfPresent(param.SubmittedAt),
		postgresql.Discovery.VideoURL.SetIfPresent(param.VideoURL),
	).Update().Exec(ctx)
	if err != nil {
		return nil, err
	}

	// parse discovery to graphql type
	discovery, err := model.MapToDiscovery(upsertedDiscovery)
	if err != nil {
		return nil, err
	}

	return discovery, nil
}
