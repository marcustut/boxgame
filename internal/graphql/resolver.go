package graphql

import (
	"github.com/marcustut/thebox/internal/postgresql"
)

// This file will not be regenerated automatically.
//
// It serves as dependency injection for your app, add any dependencies you require here.

type Resolver struct {
	db *postgresql.PrismaClient
}

func NewResolver() *Resolver {
	client := postgresql.NewClient()
	if err := client.Connect(); err != nil {
		panic(err)
	}

	r := &Resolver{
		db: client,
	}

	return r
}
