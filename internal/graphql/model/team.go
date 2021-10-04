package model

import "github.com/marcustut/thebox/internal/postgresql"

type Team struct {
	ID           string     `json:"id"`
	Name         *string    `json:"name"`
	Color        string     `json:"color"`
	Points       float64    `json:"points"`
	ClusterID    *string    `json:"cluster"`
	CompletedIDs *[]*string `json:"completed"`
	MembersIDs   *[]*string `json:"members"`
}

func MapToTeam(dbTeam *postgresql.TeamModel) (*Team, error) {
	var name *string
	var clusterID *string
	if res, ok := dbTeam.Name(); ok {
		name = &res
	}
	if res, ok := dbTeam.ClusterID(); ok {
		clusterID = &res
	}

	team := &Team{
		ID:        dbTeam.ID,
		Name:      name,
		Color:     dbTeam.Color,
		Points:    dbTeam.Points,
		ClusterID: clusterID,
	}

	return team, nil
}
