package model

import (
	"time"

	"github.com/marcustut/thebox/internal/postgresql"
)

type Discovery struct {
	ID          string     `json:"id"`
	VideoURL    *string    `json:"videoUrl"`
	TeamID      string     `json:"team"`
	MissionID   string     `json:"mission"`
	SubmittedAt *time.Time `json:"submittedAt"`
	CreatedAt   time.Time  `json:"createdAt"`
	UpdatedAt   time.Time  `json:"updatedAt"`
}

func MapToDiscovery(dbDiscovery *postgresql.DiscoveryModel) (*Discovery, error) {
	var videoUrl *string
	var submittedAt *time.Time
	if res, ok := dbDiscovery.VideoURL(); ok {
		videoUrl = &res
	}
	if res, ok := dbDiscovery.SubmittedAt(); ok {
		submittedAt = &res
	}

	discovery := &Discovery{
		ID:          dbDiscovery.ID,
		VideoURL:    videoUrl,
		SubmittedAt: submittedAt,
		CreatedAt:   dbDiscovery.CreatedAt,
		UpdatedAt:   dbDiscovery.UpdatedAt,
		TeamID:      dbDiscovery.TeamID,
		MissionID:   dbDiscovery.MissionID,
	}

	return discovery, nil
}

func MapToDiscoveries(dbDiscoveries []postgresql.DiscoveryModel) ([]*Discovery, error) {
	var discoveries []*Discovery
	for _, dbDiscovery := range dbDiscoveries {
		discovery, err := MapToDiscovery(&dbDiscovery)
		if err != nil {
			return nil, err
		}
		discoveries = append(discoveries, discovery)
	}
	return discoveries, nil
}
