package model

import (
	"time"

	"github.com/marcustut/thebox/internal/postgresql"
)

type Humanity struct {
	ID          string     `json:"id"`
	GatherLink  string     `json:"gatherLink"`
	Batch       int        `json:"batch"`
	Photo1      *string    `json:"photo1"`
	Photo2      *string    `json:"photo2"`
	Photo3      *string    `json:"photo3"`
	TeamID      string     `json:"team"`
	MissionID   string     `json:"mission"`
	CreatedAt   time.Time  `json:"createdAt"`
	UpdatedAt   time.Time  `json:"updatedAt"`
	SubmittedAt *time.Time `json:"submittedAt"`
}

func MapToHumanity(dbHumanity *postgresql.HumanityModel) (*Humanity, error) {
	var submittedAt *time.Time
	var photo1 *string
	var photo2 *string
	var photo3 *string
	if res, ok := dbHumanity.SubmittedAt(); ok {
		submittedAt = &res
	}
	if res, ok := dbHumanity.Photo1(); ok {
		photo1 = &res
	}
	if res, ok := dbHumanity.Photo2(); ok {
		photo2 = &res
	}
	if res, ok := dbHumanity.Photo3(); ok {
		photo3 = &res
	}

	humanity := &Humanity{
		ID:          dbHumanity.ID,
		GatherLink:  dbHumanity.GatherLink,
		Batch:       dbHumanity.Batch,
		Photo1:      photo1,
		Photo2:      photo2,
		Photo3:      photo3,
		CreatedAt:   dbHumanity.CreatedAt,
		UpdatedAt:   dbHumanity.UpdatedAt,
		SubmittedAt: submittedAt,
		TeamID:      dbHumanity.TeamID,
		MissionID:   dbHumanity.MissionID,
	}

	return humanity, nil
}

func MapToHumanities(dbHumanities []postgresql.HumanityModel) ([]*Humanity, error) {
	var humanities []*Humanity
	for _, dbHumanity := range dbHumanities {
		humanity, err := MapToHumanity(&dbHumanity)
		if err != nil {
			return nil, err
		}
		humanities = append(humanities, humanity)
	}
	return humanities, nil
}
