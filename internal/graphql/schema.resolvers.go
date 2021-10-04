package graphql

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"fmt"

	"github.com/marcustut/thebox/internal/graphql/generated"
	"github.com/marcustut/thebox/internal/graphql/model"
	"github.com/marcustut/thebox/internal/graphql/query"
	"github.com/marcustut/thebox/internal/postgresql"
)

func (r *queryResolver) Users(ctx context.Context) ([]*model.User, error) {
	return query.GetManyUser(ctx, r.db, postgresql.User.Not())
}

func (r *teamResolver) Cluster(ctx context.Context, obj *model.Team) (*model.Cluster, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *teamResolver) Completed(ctx context.Context, obj *model.Team) ([]*model.Mission, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *teamResolver) Members(ctx context.Context, obj *model.Team) ([]*model.User, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *userResolver) Team(ctx context.Context, obj *model.User) (*model.Team, error) {
	if obj.TeamID == nil {
		return nil, fmt.Errorf("user %s has does not have a team", obj.ID)
	}
	return query.GetUniqueTeam(ctx, r.db, postgresql.Team.ID.Equals(*obj.TeamID))
}

func (r *userResolver) Roles(ctx context.Context, obj *model.User) ([]model.Role, error) {
	return query.GetManyRoles(ctx, r.db, postgresql.UserRole.ID.Contains(obj.ID))
}

// Query returns generated.QueryResolver implementation.
func (r *Resolver) Query() generated.QueryResolver { return &queryResolver{r} }

// Team returns generated.TeamResolver implementation.
func (r *Resolver) Team() generated.TeamResolver { return &teamResolver{r} }

// User returns generated.UserResolver implementation.
func (r *Resolver) User() generated.UserResolver { return &userResolver{r} }

type queryResolver struct{ *Resolver }
type teamResolver struct{ *Resolver }
type userResolver struct{ *Resolver }
