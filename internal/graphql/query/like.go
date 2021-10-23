package query

import (
	"context"

	"github.com/marcustut/thebox/internal/graphql/model"
	"github.com/marcustut/thebox/internal/postgresql"
)

type countResult struct {
	Count int `json:"count"`
}

func GetUniqueCommentLiked(ctx context.Context, db *postgresql.PrismaClient, commentID string, userID string) (bool, error) {
	var res []countResult
	err := db.Prisma.QueryRaw(`
		SELECT 
			COUNT(*) 
		FROM 
			"CommentLike" 
		WHERE 
			"commentId" = $1 AND 
			"userId" = $2;	
	`, commentID, userID).Exec(ctx, &res)
	if err != nil {
		return false, err
	}
	return res[0].Count != 0, nil
}

func GetUniqueCommentLikeCount(ctx context.Context, db *postgresql.PrismaClient, param string) (int, error) {
	var res []countResult
	err := db.Prisma.QueryRaw(`
		SELECT
			COUNT(*) 
		FROM 
			"CommentLike" CL INNER JOIN "Comment" C ON CL."commentId" = C.id
		WHERE
			C.ID = $1;
	`, param).Exec(ctx, &res)
	if err != nil {
		return 0, err
	}
	return res[0].Count, nil
}

func CreateCommentLike(ctx context.Context, db *postgresql.PrismaClient, param *model.CommentLikeInput) (*bool, error) {
	var success bool
	createdCommentLike, err := db.CommentLike.CreateOne(
		postgresql.CommentLike.Comment.Link(postgresql.Comment.ID.Equals(param.CommentID)),
		postgresql.CommentLike.User.Link(postgresql.User.ID.Equals(param.UserID)),
	).Exec(ctx)
	if err != nil {
		return &success, err
	}
	if createdCommentLike != nil {
		success = true
	}
	return &success, nil
}

func DeleteCommentLike(ctx context.Context, db *postgresql.PrismaClient, param *model.CommentLikeInput) (*bool, error) {
	var success bool
	deletedCommentLike, err := db.CommentLike.FindUnique(
		postgresql.CommentLike.CommentIDUserID(
			postgresql.CommentLike.CommentID.Equals(param.CommentID),
			postgresql.CommentLike.UserID.Equals(param.UserID),
		),
	).Delete().Exec(ctx)
	if err != nil {
		return &success, err
	}
	if deletedCommentLike != nil {
		success = true
	}
	return &success, nil
}

func GetUniquePostLiked(ctx context.Context, db *postgresql.PrismaClient, postID string, userID string) (bool, error) {
	var res []countResult
	err := db.Prisma.QueryRaw(`
		SELECT 
			COUNT(*) 
		FROM 
			"PostLike" 
		WHERE 
			"postId" = $1 AND 
			"userId" = $2;	
	`, postID, userID).Exec(ctx, &res)
	if err != nil {
		return false, err
	}
	return res[0].Count != 0, nil
}

func GetUniquePostLikeCount(ctx context.Context, db *postgresql.PrismaClient, param string) (int, error) {
	var res []countResult
	err := db.Prisma.QueryRaw(`
		SELECT
			COUNT(*) 
		FROM 
			"PostLike" PL INNER JOIN "Post" P ON PL."postId" = P.id
		WHERE
			P.ID = $1;
	`, param).Exec(ctx, &res)
	if err != nil {
		return 0, err
	}
	return res[0].Count, nil
}

func CreatePostLike(ctx context.Context, db *postgresql.PrismaClient, param *model.PostLikeInput) (*bool, error) {
	var success bool
	createdPostLike, err := db.PostLike.CreateOne(
		postgresql.PostLike.Post.Link(postgresql.Post.ID.Equals(param.PostID)),
		postgresql.PostLike.User.Link(postgresql.User.ID.Equals(param.UserID)),
	).Exec(ctx)
	if err != nil {
		return &success, err
	}
	if createdPostLike != nil {
		success = true
	}
	return &success, nil
}

func DeletePostLike(ctx context.Context, db *postgresql.PrismaClient, param *model.PostLikeInput) (*bool, error) {
	var success bool
	deletedPostLike, err := db.PostLike.FindUnique(
		postgresql.PostLike.PostIDUserID(
			postgresql.PostLike.PostID.Equals(param.PostID),
			postgresql.PostLike.UserID.Equals(param.UserID),
		),
	).Delete().Exec(ctx)
	if err != nil {
		return &success, err
	}
	if deletedPostLike != nil {
		success = true
	}
	return &success, nil
}
