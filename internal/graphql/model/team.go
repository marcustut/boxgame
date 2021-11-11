package model

import "github.com/marcustut/thebox/internal/postgresql"

type Team struct {
	ID                 string      `json:"id" fake:"{uuid}"`
	Name               *string     `json:"name" fake:"{name}"`
	AvatarUrl          *string     `json:"color" fake:"{url}"`
	Points             float64     `json:"points" fake:"{float64:10,100}"`
	Powercard          *Powercard  `json:"powercard" fake:"skip"`
	EligiblePowercards []Powercard `json:"eligiblePowercards" fake:"skip"`
	ClusterID          *string     `json:"cluster" fake:"skip"`
	CompletedIDs       *[]string   `json:"completed" fake:"skip"`
	MemberIDs          *[]string   `json:"members" fake:"skip"`
}

func MapToPowercards(dbPowercards []postgresql.Powercard) []Powercard {
	var powercards []Powercard
	for _, dbPowercard := range dbPowercards {
		powercards = append(powercards, Powercard(dbPowercard))
	}
	return powercards
}

func MapToTeam(dbTeam *postgresql.TeamModel) (*Team, error) {
	var name *string
	var clusterID *string
	var avatarURL *string
	var powercard *Powercard
	if res, ok := dbTeam.Name(); ok {
		name = &res
	}
	if res, ok := dbTeam.ClusterID(); ok {
		clusterID = &res
	}
	if res, ok := dbTeam.AvatarURL(); ok {
		avatarURL = &res
	}
	if res, ok := dbTeam.Powercard(); ok {
		powercard = (*Powercard)(&res)
	}

	team := &Team{
		ID:                 dbTeam.ID,
		Name:               name,
		AvatarUrl:          avatarURL,
		Points:             dbTeam.Points,
		Powercard:          powercard,
		EligiblePowercards: MapToPowercards(dbTeam.EligiblePowercards),
		ClusterID:          clusterID,
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
