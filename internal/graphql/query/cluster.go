package query

import (
	"context"

	"github.com/marcustut/thebox/internal/graphql/model"
	"github.com/marcustut/thebox/internal/postgresql"
)

func GetUniqueCluster(ctx context.Context, db *postgresql.PrismaClient, param postgresql.ClusterEqualsUniqueWhereParam) (*model.Cluster, error) {
	// fetch the cluster
	fetchedCluster, err := db.Cluster.FindUnique(param).Exec(ctx)
	if err != nil {
		return nil, err
	}

	// parse cluster to graphql type
	cluster, err := model.MapToCluster(fetchedCluster)
	if err != nil {
		return nil, err
	}

	return cluster, nil
}
