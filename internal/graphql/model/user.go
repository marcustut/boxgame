package model

import (
	"time"

	"github.com/marcustut/thebox/internal/postgresql"
)

type User struct {
	ID        string    `json:"id" fake:"{uuid}"`
	Username  string    `json:"username" fake:"{username}"`
	Email     string    `json:"email" fake:"{email}"`
	CreatedAt time.Time `json:"createdAt" fake:"{date}"`
	UpdatedAt time.Time `json:"updatedAt" fake:"{date}"`
	ProfileID string    `json:"profile" fake:"skip"`
	TeamID    *string   `json:"team" fake:"skip"`
	RoleIDs   *[]string `json:"roles" fake:"skip"`
}

func MapToUser(dbUser *postgresql.UserModel) (*User, error) {
	var teamID *string
	if res, ok := dbUser.TeamID(); ok {
		teamID = &res
	}
	user := &User{
		ID:        dbUser.ID,
		Username:  dbUser.Username,
		Email:     dbUser.Email,
		CreatedAt: dbUser.CreatedAt,
		UpdatedAt: dbUser.UpdatedAt,
		ProfileID: dbUser.ProfileID,
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
