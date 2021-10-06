package model

import (
	"time"

	"github.com/marcustut/thebox/internal/postgresql"
)

type Comment struct {
	ID         string    `json:"id" fake:"{uuid}"`
	Content    string    `json:"content" fake:"{sentence:5}"`
	CreatedAt  time.Time `json:"createdAt" fake:"{date}"`
	UpdatedAt  time.Time `json:"updatedAt" fake:"{date}"`
	UserID     string    `json:"user" fake:"skip"`
	PostID     string    `json:"post" fake:"skip"`
	LikesCount *int      `json:"likes" fake:"skip"`
}

func MapToComment(dbComment *postgresql.CommentModel) (*Comment, error) {
	comment := &Comment{
		ID:        dbComment.ID,
		Content:   dbComment.Content,
		CreatedAt: dbComment.CreatedAt,
		UpdatedAt: dbComment.UpdatedAt,
		UserID:    dbComment.UserID,
		PostID:    dbComment.PostID,
	}
	return comment, nil
}

func MapToComments(dbComments []postgresql.CommentModel) ([]*Comment, error) {
	var comments []*Comment
	for _, dbComment := range dbComments {
		comment, err := MapToComment(&dbComment)
		if err != nil {
			return nil, err
		}
		comments = append(comments, comment)
	}
	return comments, nil
}
