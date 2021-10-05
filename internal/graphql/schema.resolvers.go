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

func (r *clusterResolver) Teams(ctx context.Context, obj *model.Cluster) ([]*model.Team, error) {
	return query.GetManyTeam(ctx, r.db, postgresql.Team.ClusterID.Equals(obj.ID))
}

func (r *missionResolver) CompletedBy(ctx context.Context, obj *model.Mission) ([]*model.Team, error) {
	return query.GetManyTeam(ctx, r.db, postgresql.Team.TeamMission.Some(postgresql.TeamMission.MissionID.Equals(obj.ID)))
}

func (r *mutationResolver) CreateUser(ctx context.Context, param *model.NewUser) (*model.User, error) {
	return query.CreateUserWithTxUnsafe(ctx, r.db, param)
}

func (r *profileResolver) Address(ctx context.Context, obj *model.Profile) (*model.Address, error) {
	if obj.AddressID == nil {
		return nil, fmt.Errorf("profile %s does not have an address", obj.ID)
	}
	return query.GetUniqueAddress(ctx, r.db, postgresql.Address.ID.Equals(*obj.AddressID))
}

func (r *queryResolver) User(ctx context.Context, userID string) (*model.User, error) {
	return query.GetUniqueUser(ctx, r.db, postgresql.User.ID.Equals(userID))
}

func (r *queryResolver) Team(ctx context.Context, teamID string) (*model.Team, error) {
	return query.GetUniqueTeam(ctx, r.db, postgresql.Team.ID.Equals(teamID))
}

func (r *queryResolver) Cluster(ctx context.Context, clusterID string) (*model.Cluster, error) {
	return query.GetUniqueCluster(ctx, r.db, postgresql.Cluster.ID.Equals(clusterID))
}

func (r *queryResolver) Mission(ctx context.Context, missionID string) (*model.Mission, error) {
	return query.GetUniqueMission(ctx, r.db, postgresql.Mission.ID.Equals(missionID))
}

func (r *teamResolver) Cluster(ctx context.Context, obj *model.Team) (*model.Cluster, error) {
	if obj.ClusterID == nil {
		return nil, fmt.Errorf("team %s does not have a cluster", obj.ID)
	}
	return query.GetUniqueCluster(ctx, r.db, postgresql.Cluster.ID.Equals(*obj.ClusterID))
}

func (r *teamResolver) Completed(ctx context.Context, obj *model.Team) ([]*model.Mission, error) {
	return query.GetManyMission(ctx, r.db, postgresql.Mission.TeamMission.Some(postgresql.TeamMission.TeamID.Equals(obj.ID)))
}

func (r *teamResolver) Members(ctx context.Context, obj *model.Team) ([]*model.User, error) {
	return query.GetManyUser(ctx, r.db, postgresql.User.TeamID.Equals(obj.ID))
}

func (r *userResolver) Profile(ctx context.Context, obj *model.User) (*model.Profile, error) {
	if obj.ProfileID == nil {
		return nil, fmt.Errorf("user %s does not have a profile", obj.ID)
	}
	return query.GetUniqueProfile(ctx, r.db, postgresql.Profile.ID.Equals(*obj.ProfileID))
}

func (r *userResolver) Team(ctx context.Context, obj *model.User) (*model.Team, error) {
	if obj.TeamID == nil {
		return nil, fmt.Errorf("user %s does not have a team", obj.ID)
	}
	return query.GetUniqueTeam(ctx, r.db, postgresql.Team.ID.Equals(*obj.TeamID))
}

func (r *userResolver) Roles(ctx context.Context, obj *model.User) ([]model.Role, error) {
	return query.GetManyRoles(ctx, r.db, postgresql.UserRole.UserID.Equals(obj.ID))
}

// Cluster returns generated.ClusterResolver implementation.
func (r *Resolver) Cluster() generated.ClusterResolver { return &clusterResolver{r} }

// Mission returns generated.MissionResolver implementation.
func (r *Resolver) Mission() generated.MissionResolver { return &missionResolver{r} }

// Mutation returns generated.MutationResolver implementation.
func (r *Resolver) Mutation() generated.MutationResolver { return &mutationResolver{r} }

// Profile returns generated.ProfileResolver implementation.
func (r *Resolver) Profile() generated.ProfileResolver { return &profileResolver{r} }

// Query returns generated.QueryResolver implementation.
func (r *Resolver) Query() generated.QueryResolver { return &queryResolver{r} }

// Team returns generated.TeamResolver implementation.
func (r *Resolver) Team() generated.TeamResolver { return &teamResolver{r} }

// User returns generated.UserResolver implementation.
func (r *Resolver) User() generated.UserResolver { return &userResolver{r} }

type clusterResolver struct{ *Resolver }
type missionResolver struct{ *Resolver }
type mutationResolver struct{ *Resolver }
type profileResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
type teamResolver struct{ *Resolver }
type userResolver struct{ *Resolver }

// !!! WARNING !!!
// The code below was going to be deleted when updating resolvers. It has been copied here so you have
// one last chance to move it out of harms way if you want. There are two reasons this happens:
//  - When renaming or deleting a resolver the old code will be put in here. You can safely delete
//    it when you're done.
//  - You have helper methods in this file. Move them out to keep these resolver files clean.
func (r *userResolver) Email(ctx context.Context, obj *model.User) (string, error) {
	panic(fmt.Errorf("not implemented"))
}
