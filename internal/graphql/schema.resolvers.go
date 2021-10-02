package graphql

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"

	"github.com/marcustut/thebox/internal/graphql/generated"
	"github.com/marcustut/thebox/internal/graphql/model"
	"github.com/marcustut/thebox/internal/postgresql"
)

func (r *mutationResolver) CreateUser(ctx context.Context, input model.NewUser) (*model.User, error) {
	// connect db
	client := postgresql.NewClient()
	if err := client.Prisma.Connect(); err != nil {
		return nil, err
	}

	// disconnect from db
	// TODO: use chan to return err instead of panic
	defer func() {
		if err := client.Prisma.Disconnect(); err != nil {
			panic(err)
		}
	}()

	// use dynamic params
	var params []postgresql.UserSetParam

	if input.Contact != nil {
		params = append(params, postgresql.User.Contact.Set(*input.Contact))
	}
	if input.Dob != nil {
		params = append(params, postgresql.User.Dob.Set(*input.Dob))
	}
	if input.Role != nil {
		params = append(params, postgresql.User.Role.Set(postgresql.Role(*input.Role)))
	}
	if input.TeamID != nil {
		params = append(params, postgresql.User.TeamID.Set(*input.TeamID))
	}

	// create one user
	createdUser, err := client.User.CreateOne(
		postgresql.User.Username.Set(input.Username),
		postgresql.User.Email.Set(input.Email),
		postgresql.User.Password.Set(input.Email),
		postgresql.User.Name.Set(input.Name),
		params...,
	).Exec(ctx)
	if err != nil {
		return nil, err
	}

	// parse to the graphql type
	user := &model.User{
		ID:        createdUser.ID,
		Username:  createdUser.Username,
		Email:     createdUser.Email,
		Name:      createdUser.Name,
		Contact:   createdUser.InnerUser.Contact,
		Dob:       createdUser.InnerUser.Dob,
		Role:      string(createdUser.InnerUser.Role),
		CreatedAt: createdUser.CreatedAt,
		UpdatedAt: createdUser.UpdatedAt,
		TeamID:    createdUser.InnerUser.TeamID,
	}
	r.users = append(r.users, user)

	return user, nil
}

func (r *queryResolver) Users(ctx context.Context) ([]*model.User, error) {
	return r.users, nil
}

// Mutation returns generated.MutationResolver implementation.
func (r *Resolver) Mutation() generated.MutationResolver { return &mutationResolver{r} }

// Query returns generated.QueryResolver implementation.
func (r *Resolver) Query() generated.QueryResolver { return &queryResolver{r} }

type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
