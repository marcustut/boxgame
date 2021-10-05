package model

import "github.com/marcustut/thebox/internal/postgresql"

type Address struct {
	ID         string  `json:"id" fake:"{uuid}"`
	City       string  `json:"city" fake:"{city}"`
	Line1      string  `json:"line1" fake:"{street}"`
	Line2      *string `json:"line2" fake:"skip"`
	State      string  `json:"state" fake:"{state}"`
	Country    string  `json:"country" fake:"{country}"`
	PostalCode string  `json:"postalCode" fake:"{zip}"`
}

func MapToAddress(dbAddress *postgresql.AddressModel) (*Address, error) {
	var line2 *string
	if res, ok := dbAddress.Line2(); ok {
		line2 = &res
	}

	address := &Address{
		ID:         dbAddress.ID,
		City:       dbAddress.City,
		Line1:      dbAddress.Line1,
		Line2:      line2,
		State:      dbAddress.State,
		Country:    dbAddress.Country,
		PostalCode: dbAddress.PostalCode,
	}

	return address, nil
}

func MapToAddresses(dbAddresses []postgresql.AddressModel) ([]*Address, error) {
	var addresses []*Address
	for _, dbAddress := range dbAddresses {
		address, err := MapToAddress(&dbAddress)
		if err != nil {
			return nil, err
		}
		addresses = append(addresses, address)
	}
	return addresses, nil
}
