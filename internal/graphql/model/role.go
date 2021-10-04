package model

import (
	"fmt"

	"github.com/marcustut/thebox/internal/postgresql"
)

func MapToRole(dbUserRole *postgresql.UserRoleModel) (*Role, error) {
	role := Role(dbUserRole.Role)

	if !role.IsValid() {
		return nil, fmt.Errorf("unable to convert %s from db to graphql type role", dbUserRole.Role)
	}

	return &role, nil
}

func MapToRoles(dbUserRoles []postgresql.UserRoleModel) ([]Role, error) {
	var roles []Role
	for _, dbUserRole := range dbUserRoles {
		role, err := MapToRole(&dbUserRole)
		if err != nil {
			return nil, err
		}
		roles = append(roles, *role)
	}
	return roles, nil
}
