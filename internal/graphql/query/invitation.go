package query

import (
	"context"
	"time"

	"github.com/brianvoe/gofakeit/v6"
	"github.com/marcustut/thebox/internal/graphql/model"
	"github.com/marcustut/thebox/internal/postgresql"
)

func GetUniqueInvitation(ctx context.Context, db *postgresql.PrismaClient, param postgresql.InvitationEqualsUniqueWhereParam) (*model.Invitation, error) {
	// fetch the invitation
	fetchedInvitation, err := db.Invitation.FindUnique(param).Exec(ctx)
	if err != nil {
		return nil, err
	}

	// parse invitation to graphql type
	invitation, err := model.MapToInvitation(fetchedInvitation)
	if err != nil {
		return nil, err
	}

	return invitation, nil
}

func GetManyInvitation(ctx context.Context, db *postgresql.PrismaClient, page model.PaginationInput, params ...postgresql.InvitationWhereParam) ([]*model.Invitation, error) {
	// build query
	query := db.Invitation.FindMany(params...)

	// apply pagination
	query = query.Take(page.First)
	if page.Offset != nil {
		query = query.Skip(*page.Offset)
	}

	// fetch the invitations
	fetchedInvitation, err := query.Exec(ctx)
	if err != nil {
		return nil, err
	}

	// parse invitations to graphql type
	invitations, err := model.MapToInvitations(fetchedInvitation)
	if err != nil {
		return nil, err
	}

	return invitations, nil
}

func CreateInvitation(ctx context.Context, db *postgresql.PrismaClient, param *model.NewInvitation) (*model.Invitation, error) {
	createdInvitation, err := db.Invitation.CreateOne(
		postgresql.Invitation.ID.Set(gofakeit.UUID()),
		postgresql.Invitation.UpdatedAt.Set(time.Now()),
		postgresql.Invitation.Team.Link(postgresql.Team.ID.Equals(param.TeamID)),
		postgresql.Invitation.UserInvitationUserIDToUser.Link(postgresql.User.ID.Equals(param.To)),
		postgresql.Invitation.UserInvitationFromToUser.Link(postgresql.User.ID.Equals(param.From)),
	).Exec(ctx)
	if err != nil {
		return nil, err
	}

	invitation, err := model.MapToInvitation(createdInvitation)
	if err != nil {
		return nil, err
	}

	return invitation, nil
}
