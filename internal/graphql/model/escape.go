package model

import "github.com/marcustut/thebox/internal/postgresql"

type Escape struct {
	ID           string  `json:"id"`
	MissionOne   bool    `json:"missionOne"`
	MissionTwo   bool    `json:"missionTwo"`
	MissionThree float64 `json:"missionThree"`
	TeamID       string  `json:"team"`
}

func MapToEscape(dbEscape *postgresql.EscapeModel) (*Escape, error) {
	escape := &Escape{
		ID:           dbEscape.ID,
		MissionOne:   dbEscape.MissionOne,
		MissionTwo:   dbEscape.MissionTwo,
		MissionThree: dbEscape.MissionThree,
		TeamID:       dbEscape.TeamID,
	}

	return escape, nil
}

func MapToEscapes(dbEscapes []postgresql.EscapeModel) ([]*Escape, error) {
	var escapes []*Escape
	for _, dbEscape := range dbEscapes {
		escape, err := MapToEscape(&dbEscape)
		if err != nil {
			return nil, err
		}
		escapes = append(escapes, escape)
	}
	return escapes, nil
}
