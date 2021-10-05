package model

import (
	"time"

	"github.com/marcustut/thebox/internal/postgresql"
)

type Profile struct {
	ID            string         `json:"id" fake:"{uuid}"`
	Status        PastoralStatus `json:"status" fake:"{randomstring:[PASTOR,SCGL,CGL,PCGL,ACGL,OM,NB,NF]}"`
	Gender        Gender         `json:"gender" fake:"{randomstring:[MALE,FEMALE]}"`
	Name          string         `json:"name" fake:"{name}"`
	Contact       string         `json:"contact" fake:"{phone}"`
	Dob           time.Time      `json:"dob" fake:"{date}"`
	TngReceiptURL *string        `json:"tngReceiptUrl" fake:"{url}"`
	AvatarURL     *string        `json:"avatarUrl" fake:"{url}"`
	CreatedAt     time.Time      `json:"createdAt" fake:"{date}"`
	UpdatedAt     time.Time      `json:"updatedAt" fake:"{date}"`
	AddressID     *string        `json:"address" fake:"skip"`
}

func MapToProfile(dbProfile *postgresql.ProfileModel) (*Profile, error) {
	var tngReceiptUrl *string
	var avatarUrl *string
	var addressID *string
	if res, ok := dbProfile.TngReceiptURL(); ok {
		tngReceiptUrl = &res
	}
	if res, ok := dbProfile.AvatarURL(); ok {
		avatarUrl = &res
	}
	if res, ok := dbProfile.AddressID(); ok {
		addressID = &res
	}

	profile := &Profile{
		ID:            dbProfile.ID,
		Status:        PastoralStatus(dbProfile.Status),
		Gender:        Gender(dbProfile.Gender),
		Name:          dbProfile.Name,
		Contact:       dbProfile.Contact,
		Dob:           dbProfile.Dob,
		TngReceiptURL: tngReceiptUrl,
		AvatarURL:     avatarUrl,
		CreatedAt:     dbProfile.CreatedAt,
		UpdatedAt:     dbProfile.UpdatedAt,
		AddressID:     addressID,
	}
	return profile, nil
}

func MapToProfiles(dbProfiles []postgresql.ProfileModel) ([]*Profile, error) {
	var profiles []*Profile
	for _, dbProfile := range dbProfiles {
		profile, err := MapToProfile(&dbProfile)
		if err != nil {
			return nil, err
		}
		profiles = append(profiles, profile)
	}
	return profiles, nil
}
