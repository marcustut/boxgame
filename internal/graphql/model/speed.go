package model

import (
	"time"

	"github.com/marcustut/thebox/internal/postgresql"
)

type Speed struct {
	ID          string     `json:"id"`
	CompletedAt *time.Time `json:"completedAt"`
	Answer      *string    `json:"answer"`
	CreatedAt   time.Time  `json:"createdAt"`
	UpdatedAt   time.Time  `json:"updatedAt"`
	TeamID      string     `json:"team"`
	MissionID   string     `json:"mission"`
}

func MapToSpeed(dbSpeed *postgresql.SpeedModel) (*Speed, error) {
	var completedAt *time.Time
	var answer *string
	if res, ok := dbSpeed.CompletedAt(); ok {
		completedAt = &res
	}
	if res, ok := dbSpeed.Answer(); ok {
		answer = &res
	}

	speed := &Speed{
		ID:          dbSpeed.ID,
		CompletedAt: completedAt,
		Answer:      answer,
		CreatedAt:   dbSpeed.CreatedAt,
		UpdatedAt:   dbSpeed.UpdatedAt,
		TeamID:      dbSpeed.TeamID,
		MissionID:   dbSpeed.MissionID,
	}

	return speed, nil
}

func MapToSpeeds(dbSpeeds []postgresql.SpeedModel) ([]*Speed, error) {
	var speeds []*Speed
	for _, dbSpeed := range dbSpeeds {
		speed, err := MapToSpeed(&dbSpeed)
		if err != nil {
			return nil, err
		}
		speeds = append(speeds, speed)
	}
	return speeds, nil
}
