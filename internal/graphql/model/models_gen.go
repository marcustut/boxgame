// Code generated by github.com/99designs/gqlgen, DO NOT EDIT.

package model

import (
	"time"
)

type NewUser struct {
	Username string     `json:"username"`
	Email    string     `json:"email"`
	Password string     `json:"password"`
	Name     string     `json:"name"`
	Contact  *string    `json:"contact"`
	Dob      *time.Time `json:"dob"`
	Role     *string    `json:"role"`
	TeamID   *string    `json:"teamId"`
}

type User struct {
	ID        string     `json:"id"`
	Username  string     `json:"username"`
	Email     string     `json:"email"`
	Name      string     `json:"name"`
	Contact   *string    `json:"contact"`
	Dob       *time.Time `json:"dob"`
	Role      string     `json:"role"`
	CreatedAt time.Time  `json:"createdAt"`
	UpdatedAt time.Time  `json:"updatedAt"`
	TeamID    *string    `json:"teamId"`
}
