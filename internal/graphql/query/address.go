package query

import (
	"context"

	"github.com/marcustut/thebox/internal/graphql/model"
	"github.com/marcustut/thebox/internal/postgresql"
)

func GetUniqueAddress(ctx context.Context, db *postgresql.PrismaClient, param postgresql.AddressEqualsUniqueWhereParam) (*model.Address, error) {
	// fetch the address
	fetchedAddress, err := db.Address.FindUnique(param).Exec(ctx)
	if err != nil {
		return nil, err
	}

	// parse address to graphql type
	address, err := model.MapToAddress(fetchedAddress)
	if err != nil {
		return nil, err
	}

	return address, nil
}
