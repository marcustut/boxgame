package query

import (
	"context"

	"github.com/brianvoe/gofakeit/v6"
	"github.com/marcustut/thebox/internal/graphql/model"
	"github.com/marcustut/thebox/internal/postgresql"
)

func GetUniqueTeam(ctx context.Context, db *postgresql.PrismaClient, param postgresql.TeamEqualsUniqueWhereParam) (*model.Team, error) {
	// fetch the team
	fetchedTeam, err := db.Team.FindUnique(param).Exec(ctx)
	if err != nil {
		return nil, err
	}

	// parse team to graphql type
	team, err := model.MapToTeam(fetchedTeam)
	if err != nil {
		return nil, err
	}

	return team, nil
}

func GetManyTeam(ctx context.Context, db *postgresql.PrismaClient, params ...postgresql.TeamWhereParam) ([]*model.Team, error) {
	// fetch the team
	fetchedTeams, err := db.Team.FindMany(params...).Exec(ctx)
	if err != nil {
		return nil, err
	}

	// parse teams to graphql type
	teams, err := model.MapToTeams(fetchedTeams)
	if err != nil {
		return nil, err
	}

	return teams, nil
}

func CreateTeam(ctx context.Context, db *postgresql.PrismaClient, param *model.NewTeam) (*model.Team, error) {
	createdTeam, err := db.Team.CreateOne(
		postgresql.Team.ID.Set(gofakeit.UUID()),
		postgresql.Team.Name.Set(param.Name),
		postgresql.Team.Points.Set(0),
		postgresql.Team.AvatarURL.SetIfPresent(param.AvatarURL),
		postgresql.Team.Cluster.Link(postgresql.Cluster.ID.EqualsIfPresent(param.ClusterID)),
	).Exec(ctx)
	if err != nil {
		return nil, err
	}

	team, err := model.MapToTeam(createdTeam)
	if err != nil {
		return nil, err
	}

	return team, nil
}
