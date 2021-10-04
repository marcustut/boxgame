package model

import (
	"time"

	"github.com/marcustut/thebox/internal/postgresql"
)

type User struct {
	ID        string     `json:"id"`
	Username  string     `json:"username"`
	Name      string     `json:"name"`
	Contact   *string    `json:"contact"`
	Dob       *time.Time `json:"dob"`
	CreatedAt time.Time  `json:"createdAt"`
	UpdatedAt time.Time  `json:"updatedAt"`
	TeamID    *string    `json:"teamId"`
}

func MapToUser(dbUser *postgresql.UserModel) (*User, error) {
	var contact *string
	var dob *time.Time
	var teamID *string
	if res, ok := dbUser.Contact(); ok {
		contact = &res
	}
	if res, ok := dbUser.Dob(); ok {
		dob = &res
	}
	if res, ok := dbUser.TeamID(); ok {
		teamID = &res
	}

	user := &User{
		ID:        dbUser.ID,
		Username:  dbUser.Username,
		Name:      dbUser.Name,
		Contact:   contact,
		Dob:       dob,
		CreatedAt: dbUser.CreatedAt,
		UpdatedAt: dbUser.UpdatedAt,
		TeamID:    teamID,
	}

	return user, nil
}

func MapToUsers(dbUsers []postgresql.UserModel) ([]*User, error) {
	var users []*User
	for _, dbUser := range dbUsers {
		user, err := MapToUser(&dbUser)
		if err != nil {
			return nil, err
		}
		users = append(users, user)
	}
	return users, nil
}
