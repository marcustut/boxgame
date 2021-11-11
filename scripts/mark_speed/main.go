package main

import (
	"context"
	"fmt"
	"log"
	"time"

	"github.com/joho/godotenv"
	"github.com/marcustut/thebox/internal/postgresql"
)

var ELIGIBLECARD postgresql.Powercard = postgresql.PowercardBLOCK
var TIME_LAYOUT string = "2006-01-02T15:04:05.000Z"
var SPEED_ENDTIME string = "2021-10-30T13:30:00.000Z"
var SPEED_TOP15 string = "2021-10-30T13:43:12.737Z"
var ENDTIME time.Time
var TOP15 time.Time
var KL_TIME_LOC *time.Location

func init() {
	err := godotenv.Load(".env")

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

	var err error

	// time location
	KL_TIME_LOC, err = time.LoadLocation("Asia/Kuala_Lumpur")
	if err != nil {
		panic(err)
	}

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

	// speed endtime
	ENDTIME, err = time.Parse(TIME_LAYOUT, SPEED_ENDTIME)
	if err != nil {
		panic(err)
	}
	ENDTIME = ENDTIME.In(KL_TIME_LOC)

	// speed top15
	TOP15, err = time.Parse(TIME_LAYOUT, SPEED_TOP15)
	if err != nil {
		panic(err)
	}
	TOP15 = TOP15.In(KL_TIME_LOC)

	// fetch all teams
	teams, err := client.Team.FindMany().Exec(ctx)
	if err != nil {
		panic(err)
	}

	addPoints(ctx, client, teams)
	addEligibleCard(ctx, client, teams)
}

func addPoints(ctx context.Context, client *postgresql.PrismaClient, teams []postgresql.TeamModel) {
	// for each team
	for _, team := range teams {
		// get the team name
		var tname string
		if res, ok := team.Name(); ok {
			tname = res
		}
		// fetch speed
		speed, err := client.Speed.FindUnique(postgresql.Speed.TeamID.Equals(team.ID)).Exec(ctx)
		if err != nil {
			log.Fatalf("unable to find speed record for team %s\n", tname)
		}

		// get the completion time
		var completedAt *time.Time
		if res, ok := speed.CompletedAt(); ok {
			t := res.In(KL_TIME_LOC)
			completedAt = &t
		}

		// skip if not completed
		if completedAt == nil {
			continue
		}

		// calculate points
		var points float64

		if completedAt.Before(ENDTIME) {
			points = 100
		} else {
			points = 70
		}

		// update team points
		updatedTeam, err := client.Team.FindUnique(postgresql.Team.ID.Equals(team.ID)).Update(postgresql.Team.Points.Increment(points)).Exec(ctx)
		if err != nil {
			panic(err)
		}

		fmt.Printf("team: %s, points: %v\n", tname, updatedTeam.Points)
	}
}

func addEligibleCard(ctx context.Context, client *postgresql.PrismaClient, teams []postgresql.TeamModel) {
	// for each team
	for _, team := range teams {
		// get the team name
		var tname string
		if res, ok := team.Name(); ok {
			tname = res
		}
		// fetch speed
		speed, err := client.Speed.FindUnique(postgresql.Speed.TeamID.Equals(team.ID)).Exec(ctx)
		if err != nil {
			log.Fatalf("unable to find speed record for team %s\n", tname)
		}

		// get the completion time
		var completedAt *time.Time
		if res, ok := speed.CompletedAt(); ok {
			t := res.In(KL_TIME_LOC)
			completedAt = &t
		}

		// skip if not completed
		if completedAt == nil {
			continue
		}

		if completedAt.Before(TOP15) {
			// add eligible card
			team.EligiblePowercards = append(team.EligiblePowercards, ELIGIBLECARD)

			// update team eligible cards
			_, err := client.Team.FindUnique(postgresql.Team.ID.Equals(team.ID)).Update(postgresql.Team.EligiblePowercards.Set(team.EligiblePowercards)).Exec(ctx)
			if err != nil {
				panic(err)
			}

			fmt.Printf("team: %s get powercard - %v\n", tname, ELIGIBLECARD)
		}
	}
}
