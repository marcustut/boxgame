package query

import (
	"context"

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
