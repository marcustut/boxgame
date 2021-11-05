package query

import (
	"context"
	"time"

	"github.com/marcustut/thebox/internal/graphql/model"
	"github.com/marcustut/thebox/internal/postgresql"
)

func GetUniqueProfile(ctx context.Context, db *postgresql.PrismaClient, param postgresql.ProfileEqualsUniqueWhereParam) (*model.Profile, error) {
	// fetch the profile
	fetchedProfile, err := db.Profile.FindUnique(param).Exec(ctx)
	if err != nil {
		return nil, err
	}

	// parse profile to graphql type
	profile, err := model.MapToProfile(fetchedProfile)
	if err != nil {
		return nil, err
	}

	return profile, nil
}

func UpdateUniqueProfile(ctx context.Context, db *postgresql.PrismaClient, param postgresql.ProfileEqualsUniqueWhereParam, updateParam *model.UpdateProfileInput) (*model.Profile, error) {
	updatedProfile, err := db.Profile.FindUnique(param).Update(
		postgresql.Profile.UpdatedAt.Set(time.Now()),
		postgresql.Profile.Bio.SetIfPresent(updateParam.Bio),
		postgresql.Profile.NameEng.SetIfPresent(updateParam.NameEng),
		postgresql.Profile.NameChi.SetIfPresent(updateParam.NameChi),
		postgresql.Profile.AvatarURL.SetIfPresent(updateParam.AvatarURL),
	).Exec(ctx)
	if err != nil {
		return nil, err
	}

	// parse profile to graphql type
	profile, err := model.MapToProfile(updatedProfile)
	if err != nil {
		return nil, err
	}

	return profile, nil
}
