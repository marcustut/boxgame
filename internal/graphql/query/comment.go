package query

import (
	"context"
	"time"

	"github.com/brianvoe/gofakeit/v6"
	"github.com/marcustut/thebox/internal/graphql/model"
	"github.com/marcustut/thebox/internal/postgresql"
)

func GetUniqueComment(ctx context.Context, db *postgresql.PrismaClient, param postgresql.CommentEqualsUniqueWhereParam) (*model.Comment, error) {
	// fetch the comment
	fetchedComment, err := db.Comment.FindUnique(param).Exec(ctx)
	if err != nil {
		return nil, err
	}

	// parse comment to graphql type
	comment, err := model.MapToComment(fetchedComment)
	if err != nil {
		return nil, err
	}

	return comment, nil
}

func GetManyComment(ctx context.Context, db *postgresql.PrismaClient, page model.PaginationInput, params ...postgresql.CommentWhereParam) ([]*model.Comment, error) {
	// build query
	query := db.Comment.FindMany(params...)

	// apply pagination
	query = query.Take(page.Limit)
	query = query.Skip(page.Offset)

	// fetch the comments
	fetchedComments, err := query.Exec(ctx)
	if err != nil {
		return nil, err
	}

	// parse comments to graphql type
	comments, err := model.MapToComments(fetchedComments)
	if err != nil {
		return nil, err
	}

	return comments, nil
}

func CreateComment(ctx context.Context, db *postgresql.PrismaClient, param *model.NewComment) (*model.Comment, error) {
	createdComment, err := db.Comment.CreateOne(
		postgresql.Comment.ID.Set(gofakeit.UUID()),
		postgresql.Comment.Content.Set(param.Content),
		postgresql.Comment.UpdatedAt.Set(time.Now()),
		postgresql.Comment.Post.Link(postgresql.Post.ID.Equals(param.PostID)),
		postgresql.Comment.User.Link(postgresql.User.ID.Equals(param.UserID)),
	).Exec(ctx)
	if err != nil {
		return nil, err
	}

	comment, err := model.MapToComment(createdComment)
	if err != nil {
		return nil, err
	}

	return comment, nil
}
