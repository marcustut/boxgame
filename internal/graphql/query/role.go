package query

import (
	"context"

	"github.com/marcustut/thebox/internal/graphql/model"
	"github.com/marcustut/thebox/internal/postgresql"
)

func GetManyRoles(ctx context.Context, db *postgresql.PrismaClient, params ...postgresql.UserRoleWhereParam) ([]model.Role, error) {
	// fetch the user
	fetchedUserRoles, err := db.UserRole.FindMany(params...).Exec(ctx)
	if err != nil {
		return nil, err
	}

	// parse roles to graphql type
	roles, err := model.MapToRoles(fetchedUserRoles)
	if err != nil {
		return nil, err
	}

	return roles, nil
}
