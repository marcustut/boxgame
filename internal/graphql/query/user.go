package query

import (
	"context"

	"github.com/marcustut/thebox/internal/graphql/model"
	"github.com/marcustut/thebox/internal/postgresql"
)

func GetUniqueUser(ctx context.Context, db *postgresql.PrismaClient, param postgresql.UserEqualsUniqueWhereParam) (*model.User, error) {
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
