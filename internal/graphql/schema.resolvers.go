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

func (r *commentResolver) User(ctx context.Context, obj *model.Comment) (*model.User, error) {
	return query.GetUniqueUser(ctx, r.db, postgresql.User.ID.Equals(obj.UserID))
}

func (r *commentResolver) Post(ctx context.Context, obj *model.Comment) (*model.Post, error) {
	return query.GetUniquePost(ctx, r.db, postgresql.Post.ID.Equals(obj.PostID))
}

func (r *commentResolver) Likes(ctx context.Context, obj *model.Comment) (int, error) {
	return query.GetUniqueCommentLikeCount(ctx, r.db, obj.ID)
}

func (r *invitationResolver) From(ctx context.Context, obj *model.Invitation) (*model.User, error) {
	return query.GetUniqueUser(ctx, r.db, postgresql.User.ID.EqualsIfPresent(obj.FromID))
}

func (r *invitationResolver) User(ctx context.Context, obj *model.Invitation) (*model.User, error) {
	return query.GetUniqueUser(ctx, r.db, postgresql.User.ID.Equals(obj.UserID))
}

func (r *invitationResolver) Team(ctx context.Context, obj *model.Invitation) (*model.Team, error) {
	return query.GetUniqueTeam(ctx, r.db, postgresql.Team.ID.Equals(obj.TeamID))
}

func (r *missionResolver) CompletedBy(ctx context.Context, obj *model.Mission) ([]*model.Team, error) {
	return query.GetManyTeam(ctx, r.db, postgresql.Team.TeamMission.Some(postgresql.TeamMission.MissionID.Equals(obj.ID)))
}

func (r *mutationResolver) CreateUser(ctx context.Context, param model.NewUser) (*model.User, error) {
	return query.CreateUserWithTxUnsafe(ctx, r.db, &param)
}

func (r *mutationResolver) CreatePost(ctx context.Context, param model.NewPost) (*model.Post, error) {
	return query.CreatePost(ctx, r.db, &param)
}

func (r *mutationResolver) CreateComment(ctx context.Context, param model.NewComment) (*model.Comment, error) {
	return query.CreateComment(ctx, r.db, &param)
}

func (r *mutationResolver) CreateInvitation(ctx context.Context, param model.NewInvitation) (*model.Invitation, error) {
	return query.CreateInvitation(ctx, r.db, &param)
}

func (r *mutationResolver) CreateTeam(ctx context.Context, param model.NewTeam) (*model.Team, error) {
	return query.CreateTeam(ctx, r.db, &param)
}

func (r *mutationResolver) UpdateUser(ctx context.Context, userID string, param model.UpdateUserInput) (*model.User, error) {
	return query.UpdateUniqueUser(ctx, r.db, postgresql.User.ID.Equals(userID), &param)
}

func (r *mutationResolver) LikePost(ctx context.Context, param model.PostLikeInput) (*bool, error) {
	return query.CreatePostLike(ctx, r.db, &param)
}

func (r *mutationResolver) UnlikePost(ctx context.Context, param model.PostLikeInput) (*bool, error) {
	return query.DeletePostLike(ctx, r.db, &param)
}

func (r *mutationResolver) LikeComment(ctx context.Context, param model.CommentLikeInput) (*bool, error) {
	return query.CreateCommentLike(ctx, r.db, &param)
}

func (r *mutationResolver) UnlikeComment(ctx context.Context, param model.CommentLikeInput) (*bool, error) {
	return query.DeleteCommentLike(ctx, r.db, &param)
}

func (r *postResolver) User(ctx context.Context, obj *model.Post) (*model.User, error) {
	return query.GetUniqueUser(ctx, r.db, postgresql.User.ID.Equals(obj.UserID))
}

func (r *postResolver) Likes(ctx context.Context, obj *model.Post) (int, error) {
	return query.GetUniquePostLikeCount(ctx, r.db, obj.ID)
}

func (r *postResolver) Liked(ctx context.Context, obj *model.Post, userID string) (bool, error) {
	return query.GetUniquePostLiked(ctx, r.db, obj.ID, userID)
}

func (r *postResolver) Comments(ctx context.Context, obj *model.Post, page model.PaginationInput) ([]*model.Comment, error) {
	return query.GetManyComment(ctx, r.db, page, postgresql.Comment.PostID.Equals(obj.ID))
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

func (r *queryResolver) Users(ctx context.Context, page model.PaginationInput) ([]*model.User, error) {
	return query.GetManyUser(ctx, r.db, page)
}

func (r *queryResolver) UserCount(ctx context.Context) (int, error) {
	return query.GetTotalUserCount(ctx, r.db)
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

func (r *queryResolver) Missions(ctx context.Context, page model.PaginationInput) ([]*model.Mission, error) {
	return query.GetManyMission(ctx, r.db, page)
}

func (r *queryResolver) Post(ctx context.Context, postID string) (*model.Post, error) {
	return query.GetUniquePost(ctx, r.db, postgresql.Post.ID.Equals(postID))
}

func (r *queryResolver) Posts(ctx context.Context, page model.PaginationInput) ([]*model.Post, error) {
	return query.GetManyPost(ctx, r.db, page)
}

func (r *queryResolver) Invitations(ctx context.Context, userID string, page model.PaginationInput) ([]*model.Invitation, error) {
	return query.GetManyInvitation(ctx, r.db, page, postgresql.Invitation.UserID.Equals(userID))
}

func (r *teamResolver) Cluster(ctx context.Context, obj *model.Team) (*model.Cluster, error) {
	if obj.ClusterID == nil {
		// return nil, gqlerror.Errorf("team %s does not have a cluster", obj.ID)
		return nil, nil
	}
	return query.GetUniqueCluster(ctx, r.db, postgresql.Cluster.ID.Equals(*obj.ClusterID))
}

func (r *teamResolver) Completed(ctx context.Context, obj *model.Team, page model.PaginationInput) ([]*model.Mission, error) {
	return query.GetManyMission(ctx, r.db, page, postgresql.Mission.TeamMission.Some(postgresql.TeamMission.TeamID.Equals(obj.ID)))
}

func (r *teamResolver) Members(ctx context.Context, obj *model.Team) ([]*model.User, error) {
	return query.GetManyUser(ctx, r.db, model.PaginationInput{First: 100}, postgresql.User.TeamID.Equals(obj.ID))
}

func (r *userResolver) Profile(ctx context.Context, obj *model.User) (*model.Profile, error) {
	return query.GetUniqueProfile(ctx, r.db, postgresql.Profile.ID.Equals(obj.ProfileID))
}

func (r *userResolver) Team(ctx context.Context, obj *model.User) (*model.Team, error) {
	if obj.TeamID == nil {
		// return nil, gqlerror.Errorf("user %s does not have a team", obj.ID)
		return nil, nil
	}
	return query.GetUniqueTeam(ctx, r.db, postgresql.Team.ID.Equals(*obj.TeamID))
}

func (r *userResolver) Roles(ctx context.Context, obj *model.User) ([]model.Role, error) {
	return query.GetManyRoles(ctx, r.db, postgresql.UserRole.UserID.Equals(obj.ID))
}

// Cluster returns generated.ClusterResolver implementation.
func (r *Resolver) Cluster() generated.ClusterResolver { return &clusterResolver{r} }

// Comment returns generated.CommentResolver implementation.
func (r *Resolver) Comment() generated.CommentResolver { return &commentResolver{r} }

// Invitation returns generated.InvitationResolver implementation.
func (r *Resolver) Invitation() generated.InvitationResolver { return &invitationResolver{r} }

// Mission returns generated.MissionResolver implementation.
func (r *Resolver) Mission() generated.MissionResolver { return &missionResolver{r} }

// Mutation returns generated.MutationResolver implementation.
func (r *Resolver) Mutation() generated.MutationResolver { return &mutationResolver{r} }

// Post returns generated.PostResolver implementation.
func (r *Resolver) Post() generated.PostResolver { return &postResolver{r} }

// Profile returns generated.ProfileResolver implementation.
func (r *Resolver) Profile() generated.ProfileResolver { return &profileResolver{r} }

// Query returns generated.QueryResolver implementation.
func (r *Resolver) Query() generated.QueryResolver { return &queryResolver{r} }

// Team returns generated.TeamResolver implementation.
func (r *Resolver) Team() generated.TeamResolver { return &teamResolver{r} }

// User returns generated.UserResolver implementation.
func (r *Resolver) User() generated.UserResolver { return &userResolver{r} }

type clusterResolver struct{ *Resolver }
type commentResolver struct{ *Resolver }
type invitationResolver struct{ *Resolver }
type missionResolver struct{ *Resolver }
type mutationResolver struct{ *Resolver }
type postResolver struct{ *Resolver }
type profileResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
type teamResolver struct{ *Resolver }
type userResolver struct{ *Resolver }
