package main

import (
	"context"
	"log"

	"github.com/joho/godotenv"
	"github.com/marcustut/thebox/internal/postgresql"
)

var ELIGIBLECARD postgresql.Powercard = postgresql.PowercardONEMORECHANCE
var SCORE_MAP map[string]float64 = map[string]float64{
	"1c143db7-c2b2-4342-bbaa-91c0b0fb6d36": 180, // 我们想不到
	"8e5dc0d6-ee2b-42a7-a05f-18ab63d24dc5": 160, // 一班小学生
	"e726fbdd-4408-47cb-af69-4f4384d45205": 80,  // 格外惊喜
	"39d812ae-80f6-4b6b-8479-0966d32ac662": 120, // 守护者军团
	"0f26382f-abf4-41f7-9ae2-c2bc687dd069": 130, // 🦑鱿鱼456🐙⏺🔼⏹
	"7035d269-f375-4568-a141-e2fefd331a1b": 170, // 我是大赢家
	"f52f7980-c87a-49c8-9a2f-7928e7b8ae19": 230, // 假装有名字
	"3258c229-f8cf-485c-b1a9-241c91521201": 250, // 不醒人室
	"60f6073d-f9f8-4584-a135-23da6f72eac3": 20,  // 与你闯输赢
	"661eacee-d53b-4fb7-bd18-433084e6155e": 30,  // 惰们玩格子
	"4b4d4364-ff28-4914-afe6-ba525320d0f5": 80,  // 菠萝菠萝蜜🍍
	"3373c3fb-b99e-401f-908e-67ae43303782": 60,  // 有一点烧
	"6515a82b-aef6-48f9-8bdb-f9574277f58d": 150, // 懒得想名字
	"00551b89-9f22-42b5-94a2-9c326116c5ea": 170, // Level 99
	"da206d2e-12e2-4fcc-8878-00584a661a80": 260, // 哈哈哈哈哈
	"0884b173-62e6-4ce6-9ef5-7feef2ff00ff": 260, // 让你们回家
	"4560f603-5218-4db0-92f2-231113125bac": 90,  // 咸鱼花腩煲
	"3bd9304d-48ea-4398-891c-2c5e3528a508": 170, // Group 4 Steady La
	"1c543f53-54b7-48be-8b09-1f65abf15c97": 160, // 要就拿第一
	"e385a176-91c6-4f6f-98ce-d203026e6429": 180, // 💯分的我们
	"2faf8c96-6031-4975-a2c3-3c29d1695451": 130, // 我们爱中华
	"864a3330-0067-4ee8-bc4a-bc36bd61f009": 150, // 队友网很卡
	"9490e15d-30cd-4ba3-9b6e-1e89288de049": 40,  // 呵呵呵呵呵
	"660a461a-0c5a-455c-99ca-dace22ecb2e2": 40,  // Think out of the box
	"c8aa484a-4f23-476b-8588-ec5241479fa2": 180, // 麤龘骉鱻
	"0c7507ee-0b62-4370-b516-e831c088174b": 220, // 2345y
	"922d1051-338b-42fa-be23-7f8a9ff09bed": 220, // 格天再说
	"118f462d-1534-43aa-bd46-6f0e8e394a14": 100, // 单身狗协会
	"3323ce17-28c4-4016-a23e-92c220c7c9d0": 80,  // Shopee 11.11
	"8c13b76d-b10d-4c42-94db-14d4ad925707": 120, // 鱼肉米粉汤
	"89f098a1-aa81-4b3f-92fa-f41469f6aeb5": 140, // 最优秀的Sotong
	"8629bd6b-ec7c-45ea-b51f-6d1c9bf9f167": 180, // 名字真难取
}

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

	addPoints(ctx, client)
	addEligibleCard(ctx, client)
}

func addPoints(ctx context.Context, client *postgresql.PrismaClient) {
	// for each team
	for teamId, score := range SCORE_MAP {
		// update the score
		updatedTeam, err := client.Team.FindUnique(postgresql.Team.ID.Equals(teamId)).Update(postgresql.Team.Points.Increment(score)).Exec(ctx)
		if err != nil {
			panic(err)
		}

		// get the team name
		var tname string
		if res, ok := updatedTeam.Name(); ok {
			tname = res
		}

		// print it out
		log.Printf("team: %s, points: %v\n", tname, updatedTeam.Points)
	}
}

func addEligibleCard(ctx context.Context, client *postgresql.PrismaClient) {
	// fetch all teams
	teams, err := client.Team.FindMany().Exec(ctx)
	if err != nil {
		panic(err)
	}

	// for each team
	for _, team := range teams {
		// ignore team lesser than 200
		if SCORE_MAP[team.ID] < 200 {
			continue
		}

		// add eligble card
		team.EligiblePowercards = append(team.EligiblePowercards, ELIGIBLECARD)

		// update the card
		updatedTeam, err := client.Team.FindUnique(postgresql.Team.ID.Equals(team.ID)).Update(postgresql.Team.EligiblePowercards.Set(team.EligiblePowercards)).Exec(ctx)
		if err != nil {
			panic(err)
		}

		// get the team name
		var tname string
		if res, ok := updatedTeam.Name(); ok {
			tname = res
		}

		// print it out
		log.Printf("team: %s get powercard - %v\n", tname, ELIGIBLECARD)
	}
}
