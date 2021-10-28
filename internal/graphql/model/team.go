package model

import "github.com/marcustut/thebox/internal/postgresql"

type Team struct {
	ID           string    `json:"id" fake:"{uuid}"`
	Name         *string   `json:"name" fake:"{name}"`
	AvatarUrl    *string   `json:"color" fake:"{hexcolor}"`
	Points       float64   `json:"points" fake:"{float64:10,100}"`
	ClusterID    *string   `json:"cluster" fake:"skip"`
	CompletedIDs *[]string `json:"completed" fake:"skip"`
	MemberIDs    *[]string `json:"members" fake:"skip"`
}

func MapToTeam(dbTeam *postgresql.TeamModel) (*Team, error) {
	var name *string
	var clusterID *string
	var avatarURL *string
	if res, ok := dbTeam.Name(); ok {
		name = &res
	}
	if res, ok := dbTeam.ClusterID(); ok {
		clusterID = &res
	}
	if res, ok := dbTeam.AvatarURL(); ok {
		avatarURL = &res
	}

	team := &Team{
		ID:        dbTeam.ID,
		Name:      name,
		AvatarUrl: avatarURL,
		Points:    dbTeam.Points,
		ClusterID: clusterID,
	}

	return team, nil
}

func MapToTeams(dbTeams []postgresql.TeamModel) ([]*Team, error) {
	var teams []*Team
	for _, dbTeam := range dbTeams {
		team, err := MapToTeam(&dbTeam)
		if err != nil {
			return nil, err
		}
		teams = append(teams, team)
	}
	return teams, nil
}
