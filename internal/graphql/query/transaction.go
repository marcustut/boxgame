package query

import (
	"context"
	"log"
	"time"

	"github.com/brianvoe/gofakeit/v6"
	"github.com/marcustut/thebox/internal/graphql/model"
	"github.com/marcustut/thebox/internal/postgresql"
	"github.com/prisma/prisma-client-go/runtime/transaction"
)

// This is unsafe because currently Go's prisma client does not support nested writes
// in other words, dependent writes cannot be performed within a transaction
// hence 2 transaction is used to create user but this is unsafe as atomicity is not
// guaranteed, as one transaction might be aborted and the other still remains intact.
func CreateUserWithTxUnsafe(ctx context.Context, db *postgresql.PrismaClient, param *model.NewUser) (*model.User, error) {
	var status *postgresql.PastoralStatus
	if param.Profile.Status != nil {
		status = (*postgresql.PastoralStatus)(param.Profile.Status)
	}
	var satellite *postgresql.Satellite
	if param.Profile.Satellite != nil {
		satellite = (*postgresql.Satellite)(param.Profile.Satellite)
	}

	var t1 []transaction.Param

	dbAddress := db.Address.CreateOne(
		postgresql.Address.ID.Set(gofakeit.UUID()),
		postgresql.Address.City.Set(param.Profile.Address.City),
		postgresql.Address.Line1.Set(param.Profile.Address.Line1),
		postgresql.Address.State.Set(param.Profile.Address.State),
		postgresql.Address.Country.Set(param.Profile.Address.Country),
		postgresql.Address.PostalCode.Set(param.Profile.Address.PostalCode),
		postgresql.Address.Line2.SetIfPresent(param.Profile.Address.Line2),
	).Tx()

	dbProfile := db.Profile.CreateOne(
		postgresql.Profile.ID.Set(gofakeit.UUID()),
		postgresql.Profile.Gender.Set(postgresql.Gender(param.Profile.Gender)),
		postgresql.Profile.NameEng.Set(param.Profile.NameEng),
		postgresql.Profile.Contact.Set(param.Profile.Contact),
		postgresql.Profile.Dob.Set(param.Profile.Dob),
		postgresql.Profile.UpdatedAt.Set(time.Now()),
		postgresql.Profile.NameChi.SetIfPresent(param.Profile.NameChi),
		postgresql.Profile.TngReceiptURL.SetIfPresent(param.Profile.TngReceiptURL),
		postgresql.Profile.AvatarURL.SetIfPresent(param.Profile.AvatarURL),
		postgresql.Profile.Satellite.SetIfPresent(satellite),
		postgresql.Profile.Status.SetIfPresent(status),
		postgresql.Profile.InvitedBy.SetIfPresent(param.Profile.InvitedBy),
	).Tx()

	t1 = append(t1, dbAddress, dbProfile)

	if err := db.Prisma.Transaction(t1...).Exec(ctx); err != nil {
		return nil, err
	}

	var t2 []transaction.Param

	updatedProfile := db.Profile.FindUnique(
		postgresql.Profile.ID.Equals(dbProfile.Result().ID),
	).Update(
		postgresql.Profile.AddressID.Set(dbAddress.Result().ID),
	).Tx()

	log.Println(dbProfile.Result().ID)

	var userId string
	if param.ID != nil {
		userId = *param.ID
	} else {
		userId = gofakeit.UUID()
	}

	dbUser := db.User.CreateOne(
		postgresql.User.ID.Set(userId),
		postgresql.User.Username.Set(param.Username),
		postgresql.User.UpdatedAt.Set(time.Now()),
		postgresql.User.Email.Set(param.Email),
		postgresql.User.Profile.Link(postgresql.Profile.ID.Equals(dbProfile.Result().ID)),
		postgresql.User.Team.Link(postgresql.Team.ID.EqualsIfPresent(param.TeamID)),
	).Tx()

	t2 = append(t2, updatedProfile, dbUser)

	if err := db.Prisma.Transaction(t2...).Exec(ctx); err != nil {
		return nil, err
	}

	for _, role := range param.Roles {
		db.UserRole.CreateOne(
			postgresql.UserRole.ID.Set(gofakeit.UUID()),
			postgresql.UserRole.Role.Set(postgresql.Role(role)),
			postgresql.UserRole.User.Link(postgresql.User.ID.Equals(dbUser.Result().ID)),
		).Exec(ctx)
	}

	user, err := model.MapToUser(dbUser.Result())
	if err != nil {
		return nil, err
	}

	return user, nil
}
