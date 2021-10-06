package query

import (
	"context"
	"time"

	"github.com/brianvoe/gofakeit/v6"
	"github.com/marcustut/thebox/internal/graphql/model"
	"github.com/marcustut/thebox/internal/postgresql"
)

func GetUniquePost(ctx context.Context, db *postgresql.PrismaClient, param postgresql.PostEqualsUniqueWhereParam) (*model.Post, error) {
	// fetch the post
	fetchedPost, err := db.Post.FindUnique(param).Exec(ctx)
	if err != nil {
		return nil, err
	}

	// parse post to graphql type
	post, err := model.MapToPost(fetchedPost)
	if err != nil {
		return nil, err
	}

	return post, nil
}

func GetManyPost(ctx context.Context, db *postgresql.PrismaClient, page model.PaginationInput, params ...postgresql.PostWhereParam) ([]*model.Post, error) {
	// build query
	query := db.Post.FindMany(params...)

	// apply pagination
	query = query.Take(page.First)
	if page.Offset != nil {
		query = query.Skip(*page.Offset)
	}

	// fetch the posts
	fetchedPost, err := query.Exec(ctx)
	if err != nil {
		return nil, err
	}

	// parse posts to graphql type
	posts, err := model.MapToPosts(fetchedPost)
	if err != nil {
		return nil, err
	}

	return posts, nil
}

func CreatePost(ctx context.Context, db *postgresql.PrismaClient, param *model.NewPost) (*model.Post, error) {
	createdPost, err := db.Post.CreateOne(
		postgresql.Post.ID.Set(gofakeit.UUID()),
		postgresql.Post.Content.Set(param.Content),
		postgresql.Post.UpdatedAt.Set(time.Now()),
		postgresql.Post.User.Link(postgresql.User.ID.Equals(param.UserID)),
		postgresql.Post.Images.Set(param.Images),
	).Exec(ctx)
	if err != nil {
		return nil, err
	}

	post, err := model.MapToPost(createdPost)
	if err != nil {
		return nil, err
	}

	return post, nil
}
