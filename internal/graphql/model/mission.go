package model

import (
	"time"

	"github.com/marcustut/thebox/internal/postgresql"
)

type Mission struct {
	ID             string    `json:"id" fake:"{uuid}"`
	Title          string    `json:"title" fake:"{appname}"`
	Description    *string   `json:"description" fake:"{sentence:12}"`
	Points         float64   `json:"points" fake:"{float64:10,100}"`
	CreatedAt      time.Time `json:"createdAt" fake:"{date}"`
	UpdatedAt      time.Time `json:"updatedAt" fake:"{date}"`
	CompletedByIDs *[]string `json:"completedBy" fake:"skip"`
}

func MapToMission(dbMission *postgresql.MissionModel) (*Mission, error) {
	var description *string
	if res, ok := dbMission.Description(); ok {
		description = &res
	}

	mission := &Mission{
		ID:          dbMission.ID,
		Title:       dbMission.Title,
		Description: description,
		Points:      dbMission.Points,
		CreatedAt:   dbMission.CreatedAt,
		UpdatedAt:   dbMission.UpdatedAt,
	}

	return mission, nil
}

func MapToMissions(dbMissions []postgresql.MissionModel) ([]*Mission, error) {
	var missions []*Mission
	for _, dbMission := range dbMissions {
		mission, err := MapToMission(&dbMission)
		if err != nil {
			return nil, err
		}
		missions = append(missions, mission)
	}
	return missions, nil
}
