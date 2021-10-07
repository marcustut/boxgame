package main

import (
	"context"
	"fmt"
	"log"
	"math/rand"
	"os"
	"strings"

	"github.com/brianvoe/gofakeit/v6"
	"github.com/joho/godotenv"
	"github.com/marcustut/thebox/internal/graphql/model"
	"github.com/marcustut/thebox/internal/postgresql"
)

var ACTIONS map[string]bool = map[string]bool{
	"clean": true,
	"seed":  true,
	"both":  true,
}

func init() {
	if os.Getenv("APP_ENV") != "development" && os.Getenv("APP_ENV") != "production" {
		panic(fmt.Errorf("APP_ENV is not set or not one of `development` or `production`"))
	}

	var err error
	if os.Getenv("APP_ENV") == "development" {
		err = godotenv.Load(".env.local")
	} else if os.Getenv("APP_ENV") == "production" {
		err = godotenv.Load(".env.production")
	}

	if err != nil {
		panic(err)
	}
}

func main() {
	// get current context
	ctx := context.Background()
	// create db client
	client := postgresql.NewClient()
	// configure logger
	log.SetFlags(0)

	// connect db
	if err := client.Connect(); err != nil {
		panic(err)
	}

	// disconnect db
	defer func() {
		if err := client.Disconnect(); err != nil {
			panic(err)
		}
	}()

	if len(os.Args) < 2 {
		log.Fatal("use cli args `clean`, `seed` or `both` to perform seeding")
	} else if len(os.Args) > 2 {
		log.Fatal("only accept one of `clean`, `seed` or `both`")
	}

	arg := strings.ToLower(strings.TrimSpace(os.Args[1]))

	switch arg {
	case "clean":
		// clean previous records
		if err := clean(ctx, client); err != nil {
			panic(fmt.Errorf("error cleaning db: %s", err))
		}
	case "seed":
		// seed new data
		if err := seed(ctx, client); err != nil {
			panic(fmt.Errorf("error seeding db: %s", err))
		}
	case "both":
		// clean previous records
		if err := clean(ctx, client); err != nil {
			panic(fmt.Errorf("error cleaning db: %s", err))
		}
		// seed new data
		if err := seed(ctx, client); err != nil {
			panic(fmt.Errorf("error seeding db: %s", err))
		}
	default:
		log.Fatalf("`%s` is not a valid cli argument", arg)
	}
}

func clean(ctx context.Context, client *postgresql.PrismaClient) error {
	res, err := client.TeamMission.FindMany().Delete().Exec(ctx)
	if err != nil {
		return err
	}
	log.Printf("clean: deleted %d rows in TeamMission\n", res.Count)

	res, err = client.Team.FindMany().Delete().Exec(ctx)
	if err != nil {
		return err
	}
	log.Printf("clean: deleted %d rows in Team\n", res.Count)

	res, err = client.Cluster.FindMany().Delete().Exec(ctx)
	if err != nil {
		return err
	}
	log.Printf("clean: deleted %d rows in Cluster\n", res.Count)

	res, err = client.Mission.FindMany().Delete().Exec(ctx)
	if err != nil {
		return err
	}
	log.Printf("clean: deleted %d rows in Mission\n", res.Count)

	res, err = client.PostLike.FindMany().Delete().Exec(ctx)
	if err != nil {
		return err
	}
	log.Printf("clean: deleted %d rows in PostLike\n", res.Count)

	res, err = client.CommentLike.FindMany().Delete().Exec(ctx)
	if err != nil {
		return err
	}
	log.Printf("clean: deleted %d rows in CommentLike\n", res.Count)

	res, err = client.Comment.FindMany().Delete().Exec(ctx)
	if err != nil {
		return err
	}
	log.Printf("clean: deleted %d rows in Comment\n", res.Count)

	res, err = client.Post.FindMany().Delete().Exec(ctx)
	if err != nil {
		return err
	}
	log.Printf("clean: deleted %d rows in Post\n", res.Count)

	res, err = client.User.FindMany().Delete().Exec(ctx)
	if err != nil {
		return err
	}
	log.Printf("clean: deleted %d rows in User\n", res.Count)

	res, err = client.Profile.FindMany().Delete().Exec(ctx)
	if err != nil {
		return err
	}
	log.Printf("clean: deleted %d rows in Profile\n", res.Count)

	res, err = client.Address.FindMany().Delete().Exec(ctx)
	if err != nil {
		return err
	}
	log.Printf("clean: deleted %d rows in Address\n", res.Count)

	res, err = client.UserRole.FindMany().Delete().Exec(ctx)
	if err != nil {
		return err
	}
	log.Printf("clean: deleted %d rows in UserRole\n", res.Count)

	return nil
}

func seed(ctx context.Context, client *postgresql.PrismaClient) error {
	roles := []postgresql.Role{postgresql.RolePLAYER, postgresql.RoleCREW, postgresql.RoleCLUSTERLEADER, postgresql.RoleTEAMLEADER}

	var clusters []string
	var teams []string
	var missions []string
	var addresses []string
	var profiles []string
	var users []string
	var posts []string
	var comments []string

	for i := 0; i < 3; i++ {
		var c model.Cluster
		gofakeit.Struct(&c)
		clusters = append(clusters, c.ID)
		res, err := client.Cluster.CreateOne(
			postgresql.Cluster.ID.Set(c.ID),
			postgresql.Cluster.Name.Set(c.Name),
			postgresql.Cluster.Color.Set(c.Color),
		).Exec(ctx)
		if err != nil {
			return err
		}
		log.Printf("seed: created Cluster %s\n", res.ID)
	}

	for i := 0; i < 50; i++ {
		var t model.Team
		gofakeit.Struct(&t)
		teams = append(teams, t.ID)
		res, err := client.Team.CreateOne(
			postgresql.Team.ID.Set(t.ID),
			postgresql.Team.Color.Set(t.Color),
			postgresql.Team.Name.Set(*t.Name),
			postgresql.Team.Points.Set(t.Points),
			postgresql.Team.ClusterID.Set(clusters[rand.Intn(len(clusters))]),
		).Exec(ctx)
		if err != nil {
			return err
		}
		log.Printf("seed: created Team %s\n", res.ID)
	}

	for i := 0; i < 10; i++ {
		var m model.Mission
		gofakeit.Struct(&m)
		missions = append(missions, m.ID)
		res, err := client.Mission.CreateOne(
			postgresql.Mission.ID.Set(m.ID),
			postgresql.Mission.Title.Set(m.Title),
			postgresql.Mission.Points.Set(m.Points),
			postgresql.Mission.UpdatedAt.Set(m.UpdatedAt),
			postgresql.Mission.Description.Set(*m.Description),
		).Exec(ctx)
		if err != nil {
			return err
		}
		log.Printf("seed: created Mission %s\n", res.ID)
	}

	for i := 0; i < 400; i++ {
		var a model.Address
		var p model.Profile
		gofakeit.Struct(&a)
		gofakeit.Struct(&p)
		addresses = append(addresses, a.ID)
		profiles = append(profiles, p.ID)
		res, err := client.Address.CreateOne(
			postgresql.Address.ID.Set(a.ID),
			postgresql.Address.City.Set(a.City),
			postgresql.Address.Line1.Set(a.Line1),
			postgresql.Address.State.Set(a.State),
			postgresql.Address.Country.Set(a.Country),
			postgresql.Address.PostalCode.Set(a.PostalCode),
		).Exec(ctx)
		if err != nil {
			return err
		}
		res2, err := client.Profile.CreateOne(
			postgresql.Profile.ID.Set(p.ID),
			postgresql.Profile.Status.Set(postgresql.PastoralStatus(p.Status)),
			postgresql.Profile.Gender.Set(postgresql.Gender(p.Gender)),
			postgresql.Profile.Name.Set(p.Name),
			postgresql.Profile.Contact.Set(p.Contact),
			postgresql.Profile.Dob.Set(p.Dob),
			postgresql.Profile.UpdatedAt.Set(p.UpdatedAt),
			postgresql.Profile.TngReceiptURL.Set(*p.TngReceiptURL),
			postgresql.Profile.AvatarURL.Set(*p.TngReceiptURL),
			postgresql.Profile.AddressID.Set(addresses[rand.Intn(len(addresses))]),
		).Exec(ctx)
		if err != nil {
			return err
		}
		log.Printf("seed: created Address %s\n", res.ID)
		log.Printf("seed: created Profile %s\n", res2.ID)
	}

	for i := 0; i < len(profiles); i++ {
		var u model.User
		gofakeit.Struct(&u)
		users = append(users, u.ID)
		res, err := client.User.CreateOne(
			postgresql.User.ID.Set(u.ID),
			postgresql.User.Username.Set(u.Username),
			postgresql.User.Email.Set(u.Email),
			postgresql.User.UpdatedAt.Set(u.UpdatedAt),
			postgresql.User.Profile.Link(postgresql.Profile.ID.Equals(profiles[i])),
			postgresql.User.Team.Link(postgresql.Team.ID.Equals(teams[rand.Intn(len(teams))])),
		).Exec(ctx)
		if err != nil {
			return err
		}
		log.Printf("seed: created User %s\n", res.ID)
	}

	for i := 0; i < len(users); i++ {
		uid := users[i]
		res, err := client.UserRole.CreateOne(
			postgresql.UserRole.ID.Set(gofakeit.UUID()),
			postgresql.UserRole.Role.Set(roles[rand.Intn(len(roles))]),
			postgresql.UserRole.User.Link(postgresql.User.ID.Equals(uid)),
		).Exec(ctx)
		if err != nil {
			return err
		}
		log.Printf("seed: created UserRole %s\n", res.ID)
	}

	for i := 0; i < len(teams)*len(missions); i++ {
		res, err := client.TeamMission.CreateOne(
			postgresql.TeamMission.Mission.Link(postgresql.Mission.ID.Equals(missions[rand.Intn(len(missions))])),
			postgresql.TeamMission.Team.Link(postgresql.Team.ID.Equals(teams[rand.Intn(len(teams))])),
		).Exec(ctx)
		if err != nil {
			continue
		}
		log.Printf("seed: created TeamMission %s,%s\n", res.TeamID, res.MissionID)
	}

	for i := 0; i < 100; i++ {
		var p model.Post
		gofakeit.Struct(&p)
		posts = append(posts, p.ID)
		gofakeit.Slice(p.Images)
		res, err := client.Post.CreateOne(
			postgresql.Post.ID.Set(p.ID),
			postgresql.Post.Content.Set(p.Content),
			postgresql.Post.UpdatedAt.Set(p.UpdatedAt),
			postgresql.Post.User.Link(postgresql.User.ID.Equals(users[rand.Intn(len(users))])),
			postgresql.Post.Images.Set(p.Images),
		).Exec(ctx)
		if err != nil {
			return err
		}
		log.Printf("seed: created Post %s\n", res.ID)
	}

	for i := 0; i < 200; i++ {
		var c model.Comment
		gofakeit.Struct(&c)
		comments = append(comments, c.ID)
		res, err := client.Comment.CreateOne(
			postgresql.Comment.ID.Set(c.ID),
			postgresql.Comment.Content.Set(c.Content),
			postgresql.Comment.UpdatedAt.Set(c.UpdatedAt),
			postgresql.Comment.Post.Link(postgresql.Post.ID.Equals(posts[rand.Intn(len(posts))])),
			postgresql.Comment.User.Link(postgresql.User.ID.Equals(users[rand.Intn(len(users))])),
		).Exec(ctx)
		if err != nil {
			return err
		}
		log.Printf("seed: created Comment %s\n", res.ID)
	}

	for i := 0; i < 200; i++ {
		res, err := client.PostLike.CreateOne(
			postgresql.PostLike.Post.Link(postgresql.Post.ID.Equals(posts[rand.Intn(len(posts))])),
			postgresql.PostLike.User.Link(postgresql.User.ID.Equals(users[rand.Intn(len(users))])),
		).Exec(ctx)
		if err != nil {
			continue
		}
		res2, err := client.CommentLike.CreateOne(
			postgresql.CommentLike.Comment.Link(postgresql.Comment.ID.Equals(comments[rand.Intn(len(comments))])),
			postgresql.CommentLike.User.Link(postgresql.User.ID.Equals(users[rand.Intn(len(users))])),
		).Exec(ctx)
		if err != nil {
			continue
		}
		log.Printf("seed: created PostLike %s,%s\n", res.PostID, res.UserID)
		log.Printf("seed: created CommentLike %s,%s\n", res2.CommentID, res2.UserID)
	}

	return nil
}
