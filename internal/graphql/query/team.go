package query

import (
	"context"

	"github.com/marcustut/thebox/internal/graphql/model"
	"github.com/marcustut/thebox/internal/postgresql"
)

func GetUniqueTeam(ctx context.Context, db *postgresql.PrismaClient, param postgresql.TeamEqualsUniqueWhereParam) (*model.Team, error) {
	// connect db
	if err := db.Prisma.Connect(); err != nil {
		return nil, err
	}

	// disconnect from db
	defer func() {
		if err := db.Prisma.Disconnect(); err != nil {
			panic(err)
		}
	}()

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
