package graphql

import (
	"github.com/labstack/echo/v4"
	"github.com/marcustut/thebox/internal/postgresql"
)

// This file will not be regenerated automatically.
//
// It serves as dependency injection for your app, add any dependencies you require here.

type Resolver struct {
	db  *postgresql.PrismaClient
	app *echo.Echo
}

func NewResolver(app *echo.Echo) *Resolver {
	client := postgresql.NewClient()
	if err := client.Connect(); err != nil {
		panic(err)
	}

	r := &Resolver{
		db:  client,
		app: app,
	}

	return r
}
