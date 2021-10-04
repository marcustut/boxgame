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
	r := &Resolver{
		db: postgresql.NewClient(),
	}

	return r
}
