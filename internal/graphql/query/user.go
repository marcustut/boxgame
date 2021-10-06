package query

import (
	"context"

	"github.com/marcustut/thebox/internal/graphql/model"
	"github.com/marcustut/thebox/internal/postgresql"
)

func GetUniqueUser(ctx context.Context, db *postgresql.PrismaClient, param postgresql.UserEqualsUniqueWhereParam) (*model.User, error) {
	// fetch the user
	fetchedUser, err := db.User.FindUnique(param).Exec(ctx)
	if err != nil {
		return nil, err
	}

	// parse user to graphql type
	user, err := model.MapToUser(fetchedUser)
	if err != nil {
		return nil, err
	}

	return user, nil
}

func GetManyUser(ctx context.Context, db *postgresql.PrismaClient, params ...postgresql.UserWhereParam) ([]*model.User, error) {
	// fetch the user
	fetchedUsers, err := db.User.FindMany(params...).Exec(ctx)
	if err != nil {
		return nil, err
	}

	// parse users to graphql type
	users, err := model.MapToUsers(fetchedUsers)
	if err != nil {
		return nil, err
	}

	return users, nil
}

func GetTotalUserCount(ctx context.Context, db *postgresql.PrismaClient) (int, error) {
	var res []countResult
	err := db.Prisma.QueryRaw(`
		SELECT
			COUNT(*) 
		FROM 
			"User"
	`).Exec(ctx, &res)
	if err != nil {
		return 0, err
	}
	return res[0].Count, nil
}
