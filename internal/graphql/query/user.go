package query

import (
	"context"
	"time"

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

func GetManyUser(ctx context.Context, db *postgresql.PrismaClient, page model.PaginationInput, params ...postgresql.UserWhereParam) ([]*model.User, error) {
	// build query
	query := db.User.FindMany(params...)

	// apply pagination
	query = query.Take(page.Limit)
	query = query.Skip(page.Offset)

	// fetch the users
	fetchedUsers, err := query.Exec(ctx)
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

func UpdateUniqueUser(ctx context.Context, db *postgresql.PrismaClient, param postgresql.UserEqualsUniqueWhereParam, updateParam *model.UpdateUserInput) (*model.User, error) {
	updatedUser, err := db.User.FindUnique(param).Update(
		postgresql.User.UpdatedAt.Set(time.Now()),
		postgresql.User.TeamID.SetIfPresent(updateParam.TeamID),
	).Exec(ctx)
	if err != nil {
		return nil, err
	}

	// parse user to graphql type
	user, err := model.MapToUser(updatedUser)
	if err != nil {
		return nil, err
	}

	return user, nil
}
