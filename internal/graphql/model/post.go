package model

import (
	"time"

	"github.com/marcustut/thebox/internal/postgresql"
)

type Post struct {
	ID         string    `json:"id" fake:"{uuid}"`
	Content    string    `json:"content" fake:"{sentence:15}"`
	Images     []string  `json:"images" fakesize:"1"`
	CreatedAt  time.Time `json:"createdAt" fake:"{date}"`
	UpdatedAt  time.Time `json:"updatedAt" fake:"{date}"`
	UserID     string    `json:"user" fake:"skip"`
	LikesCount int       `json:"likes" fake:"skip"`
	CommentIDs int       `json:"comments" fake:"skip"`
}

func MapToPost(dbPost *postgresql.PostModel) (*Post, error) {
	post := &Post{
		ID:        dbPost.ID,
		Content:   dbPost.Content,
		Images:    dbPost.Images,
		CreatedAt: dbPost.CreatedAt,
		UpdatedAt: dbPost.UpdatedAt,
		UserID:    dbPost.UserID,
	}
	return post, nil
}

func MapToPosts(dbPosts []postgresql.PostModel) ([]*Post, error) {
	var posts []*Post
	for _, dbPost := range dbPosts {
		post, err := MapToPost(&dbPost)
		if err != nil {
			return nil, err
		}
		posts = append(posts, post)
	}
	return posts, nil
}
