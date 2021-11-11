package main

import (
	"context"
	"fmt"
	"log"

	"github.com/joho/godotenv"
	"github.com/marcustut/thebox/internal/postgresql"
)

var ELIGIBLECARD postgresql.Powercard = postgresql.PowercardREVERSE

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

	// fetch all teams
	teams, err := client.Team.FindMany().Exec(ctx)
	if err != nil {
		panic(err)
	}

	// for each team
	for _, team := range teams {
		addPoints(ctx, client, team)
		addEligibleCard(ctx, client, team)
	}
}

func addPoints(ctx context.Context, client *postgresql.PrismaClient, team postgresql.TeamModel) error {
	var tname string
	if res, ok := team.Name(); ok {
		tname = res
	}
	escape, err := client.Escape.FindUnique(postgresql.Escape.TeamID.Equals(team.ID)).Exec(ctx)
	if err != nil {
		log.Fatalf("unable to find escape record for team %s\n", tname)
	}

	// calculate points
	var points float64

	if escape.MissionOne {
		points += 20
	}
	if escape.MissionTwo {
		points += 20
	}
	points += escape.MissionThree

	// update team points
	updatedTeam, err := client.Team.FindUnique(postgresql.Team.ID.Equals(team.ID)).Update(postgresql.Team.Points.Increment(points)).Exec(ctx)
	if err != nil {
		return err
	}

	fmt.Printf("team: %s, points: %v\n", tname, updatedTeam.Points)

	return nil
}

func addEligibleCard(ctx context.Context, client *postgresql.PrismaClient, team postgresql.TeamModel) error {
	var tname string
	if res, ok := team.Name(); ok {
		tname = res
	}
	escape, err := client.Escape.FindUnique(postgresql.Escape.TeamID.Equals(team.ID)).Exec(ctx)
	if err != nil {
		log.Fatalf("unable to find escape record for team %s\n", tname)
	}

	// not eligible if not 60 marks
	if escape.MissionThree != 60 {
		return nil
	}

	// add eligible card
	team.EligiblePowercards = append(team.EligiblePowercards, ELIGIBLECARD)

	// update team
	_, err = client.Team.FindUnique(postgresql.Team.ID.Equals(team.ID)).Update(postgresql.Team.EligiblePowercards.Set(team.EligiblePowercards)).Exec(ctx)
	if err != nil {
		return err
	}

	fmt.Printf("team: %s get powercard - %v\n", tname, ELIGIBLECARD)

	return nil
}
