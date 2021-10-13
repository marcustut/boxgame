package model

import (
	"time"

	"github.com/marcustut/thebox/internal/postgresql"
)

type Profile struct {
	ID            string          `json:"id" fake:"{uuid}"`
	Status        *PastoralStatus `json:"status" fake:"{randomstring:[PASTOR,SCGL,CGL,PCGL,ACGL,OM,NB,NF]}"`
	Gender        Gender          `json:"gender" fake:"{randomstring:[MALE,FEMALE]}"`
	Satellite     *Satellite      `json:"satellite" fake:"{randomstring:[FGAPUCHONG,FGASETAPAK,FGARAWANG,FGAPJ,FGAUSJ]}"`
	NameEng       string          `json:"nameEng" fake:"{name}"`
	NameChi       *string         `json:"nameChi" fake:"{name}"`
	Contact       string          `json:"contact" fake:"{phone}"`
	Dob           time.Time       `json:"dob" fake:"{date}"`
	TngReceiptURL *string         `json:"tngReceiptUrl" fake:"{url}"`
	AvatarURL     *string         `json:"avatarUrl" fake:"{url}"`
	CreatedAt     time.Time       `json:"createdAt" fake:"{date}"`
	UpdatedAt     time.Time       `json:"updatedAt" fake:"{date}"`
	AddressID     *string         `json:"address" fake:"skip"`
	InvitedBy     *string         `json:"invitedBy" fake:"{firstname}"`
}

func MapToProfile(dbProfile *postgresql.ProfileModel) (*Profile, error) {
	var nameChi *string
	var tngReceiptUrl *string
	var avatarUrl *string
	var addressID *string
	var invitedBy *string
	var satellite *Satellite
	var status *PastoralStatus
	if res, ok := dbProfile.NameChi(); ok {
		nameChi = &res
	}
	if res, ok := dbProfile.TngReceiptURL(); ok {
		tngReceiptUrl = &res
	}
	if res, ok := dbProfile.AvatarURL(); ok {
		avatarUrl = &res
	}
	if res, ok := dbProfile.AddressID(); ok {
		addressID = &res
	}
	if res, ok := dbProfile.InvitedBy(); ok {
		invitedBy = &res
	}
	if res, ok := dbProfile.Status(); ok {
		status = (*PastoralStatus)(&res)
	}
	if res, ok := dbProfile.Satellite(); ok {
		satellite = (*Satellite)(&res)
	}
	profile := &Profile{
		ID:            dbProfile.ID,
		Status:        status,
		Gender:        Gender(dbProfile.Gender),
		Satellite:     satellite,
		NameEng:       dbProfile.NameEng,
		NameChi:       nameChi,
		Contact:       dbProfile.Contact,
		Dob:           dbProfile.Dob,
		TngReceiptURL: tngReceiptUrl,
		AvatarURL:     avatarUrl,
		CreatedAt:     dbProfile.CreatedAt,
		UpdatedAt:     dbProfile.UpdatedAt,
		AddressID:     addressID,
		InvitedBy:     invitedBy,
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
