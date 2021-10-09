// Code generated by github.com/99designs/gqlgen, DO NOT EDIT.

package model

import (
	"fmt"
	"io"
	"strconv"
	"time"
)

type CommentLikeInput struct {
	CommentID string `json:"commentId"`
	UserID    string `json:"userId"`
}

type NewAddress struct {
	City       string  `json:"city"`
	Line1      string  `json:"line1"`
	Line2      *string `json:"line2"`
	State      string  `json:"state"`
	Country    string  `json:"country"`
	PostalCode string  `json:"postalCode"`
}

type NewComment struct {
	Content string `json:"content"`
	PostID  string `json:"postId"`
	UserID  string `json:"userId"`
}

type NewPost struct {
	Content string   `json:"content"`
	Images  []string `json:"images"`
	UserID  string   `json:"userId"`
}

type NewProfile struct {
	Status        *PastoralStatus `json:"status"`
	Gender        Gender          `json:"gender"`
	Satellite     *Satellite      `json:"satellite"`
	NameEng       string          `json:"nameEng"`
	NameChi       *string         `json:"nameChi"`
	Contact       string          `json:"contact"`
	Dob           time.Time       `json:"dob"`
	TngReceiptURL *string         `json:"tngReceiptUrl"`
	AvatarURL     *string         `json:"avatarUrl"`
	Address       *NewAddress     `json:"address"`
}

type NewUser struct {
	ID       *string     `json:"id"`
	Username string      `json:"username"`
	Email    string      `json:"email"`
	Profile  *NewProfile `json:"profile"`
	Roles    []Role      `json:"roles"`
	TeamID   *string     `json:"teamId"`
}

type PaginationInput struct {
	First  int  `json:"first"`
	Offset *int `json:"offset"`
}

type PostLikeInput struct {
	PostID string `json:"postId"`
	UserID string `json:"userId"`
}

type Gender string

const (
	GenderMale   Gender = "MALE"
	GenderFemale Gender = "FEMALE"
)

var AllGender = []Gender{
	GenderMale,
	GenderFemale,
}

func (e Gender) IsValid() bool {
	switch e {
	case GenderMale, GenderFemale:
		return true
	}
	return false
}

func (e Gender) String() string {
	return string(e)
}

func (e *Gender) UnmarshalGQL(v interface{}) error {
	str, ok := v.(string)
	if !ok {
		return fmt.Errorf("enums must be strings")
	}

	*e = Gender(str)
	if !e.IsValid() {
		return fmt.Errorf("%s is not a valid Gender", str)
	}
	return nil
}

func (e Gender) MarshalGQL(w io.Writer) {
	fmt.Fprint(w, strconv.Quote(e.String()))
}

type PastoralStatus string

const (
	PastoralStatusPastor PastoralStatus = "PASTOR"
	PastoralStatusScgl   PastoralStatus = "SCGL"
	PastoralStatusCgl    PastoralStatus = "CGL"
	PastoralStatusPcgl   PastoralStatus = "PCGL"
	PastoralStatusAcgl   PastoralStatus = "ACGL"
	PastoralStatusOm     PastoralStatus = "OM"
	PastoralStatusNb     PastoralStatus = "NB"
	PastoralStatusNf     PastoralStatus = "NF"
)

var AllPastoralStatus = []PastoralStatus{
	PastoralStatusPastor,
	PastoralStatusScgl,
	PastoralStatusCgl,
	PastoralStatusPcgl,
	PastoralStatusAcgl,
	PastoralStatusOm,
	PastoralStatusNb,
	PastoralStatusNf,
}

func (e PastoralStatus) IsValid() bool {
	switch e {
	case PastoralStatusPastor, PastoralStatusScgl, PastoralStatusCgl, PastoralStatusPcgl, PastoralStatusAcgl, PastoralStatusOm, PastoralStatusNb, PastoralStatusNf:
		return true
	}
	return false
}

func (e PastoralStatus) String() string {
	return string(e)
}

func (e *PastoralStatus) UnmarshalGQL(v interface{}) error {
	str, ok := v.(string)
	if !ok {
		return fmt.Errorf("enums must be strings")
	}

	*e = PastoralStatus(str)
	if !e.IsValid() {
		return fmt.Errorf("%s is not a valid PastoralStatus", str)
	}
	return nil
}

func (e PastoralStatus) MarshalGQL(w io.Writer) {
	fmt.Fprint(w, strconv.Quote(e.String()))
}

type Role string

const (
	RolePlayer        Role = "PLAYER"
	RoleTeamleader    Role = "TEAMLEADER"
	RoleClusterleader Role = "CLUSTERLEADER"
	RoleCrew          Role = "CREW"
)

var AllRole = []Role{
	RolePlayer,
	RoleTeamleader,
	RoleClusterleader,
	RoleCrew,
}

func (e Role) IsValid() bool {
	switch e {
	case RolePlayer, RoleTeamleader, RoleClusterleader, RoleCrew:
		return true
	}
	return false
}

func (e Role) String() string {
	return string(e)
}

func (e *Role) UnmarshalGQL(v interface{}) error {
	str, ok := v.(string)
	if !ok {
		return fmt.Errorf("enums must be strings")
	}

	*e = Role(str)
	if !e.IsValid() {
		return fmt.Errorf("%s is not a valid Role", str)
	}
	return nil
}

func (e Role) MarshalGQL(w io.Writer) {
	fmt.Fprint(w, strconv.Quote(e.String()))
}

type Satellite string

const (
	SatelliteFgasetapak Satellite = "FGASETAPAK"
	SatelliteFgarawang  Satellite = "FGARAWANG"
	SatelliteFgapuchong Satellite = "FGAPUCHONG"
	SatelliteFgapj      Satellite = "FGAPJ"
	SatelliteFgausj     Satellite = "FGAUSJ"
)

var AllSatellite = []Satellite{
	SatelliteFgasetapak,
	SatelliteFgarawang,
	SatelliteFgapuchong,
	SatelliteFgapj,
	SatelliteFgausj,
}

func (e Satellite) IsValid() bool {
	switch e {
	case SatelliteFgasetapak, SatelliteFgarawang, SatelliteFgapuchong, SatelliteFgapj, SatelliteFgausj:
		return true
	}
	return false
}

func (e Satellite) String() string {
	return string(e)
}

func (e *Satellite) UnmarshalGQL(v interface{}) error {
	str, ok := v.(string)
	if !ok {
		return fmt.Errorf("enums must be strings")
	}

	*e = Satellite(str)
	if !e.IsValid() {
		return fmt.Errorf("%s is not a valid Satellite", str)
	}
	return nil
}

func (e Satellite) MarshalGQL(w io.Writer) {
	fmt.Fprint(w, strconv.Quote(e.String()))
}
