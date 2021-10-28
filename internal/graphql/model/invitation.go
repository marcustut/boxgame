package model

import (
	"time"

	"github.com/marcustut/thebox/internal/postgresql"
)

type Invitation struct {
	ID        string    `json:"id"`
	FromID    *string   `json:"from"`
	UserID    string    `json:"user"`
	TeamID    string    `json:"team"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

func MapToInvitation(dbInvitation *postgresql.InvitationModel) (*Invitation, error) {
	var fromId *string
	if res, ok := dbInvitation.From(); ok {
		fromId = &res
	}

	invitation := &Invitation{
		ID:        dbInvitation.ID,
		FromID:    fromId,
		UserID:    dbInvitation.UserID,
		TeamID:    dbInvitation.TeamID,
		CreatedAt: dbInvitation.CreatedAt,
		UpdatedAt: dbInvitation.UpdatedAt,
	}

	return invitation, nil
}

func MapToInvitations(dbInvitations []postgresql.InvitationModel) ([]*Invitation, error) {
	var invitations []*Invitation
	for _, dbInvitation := range dbInvitations {
		invitation, err := MapToInvitation(&dbInvitation)
		if err != nil {
			return nil, err
		}
		invitations = append(invitations, invitation)
	}
	return invitations, nil
}
