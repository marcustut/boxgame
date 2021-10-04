package graphql

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"

	"github.com/marcustut/thebox/internal/graphql/generated"
	"github.com/marcustut/thebox/internal/graphql/model"
	"github.com/marcustut/thebox/internal/graphql/query"
	"github.com/marcustut/thebox/internal/postgresql"
)

func (r *queryResolver) Users(ctx context.Context) ([]*model.User, error) {
	return query.GetManyUser(ctx, r.db, postgresql.User.Not())
}

// Query returns generated.QueryResolver implementation.
func (r *Resolver) Query() generated.QueryResolver { return &queryResolver{r} }

type queryResolver struct{ *Resolver }
