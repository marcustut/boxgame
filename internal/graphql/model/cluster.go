package model

import "github.com/marcustut/thebox/internal/postgresql"

type Cluster struct {
	ID      string    `json:"id" fake:"{uuid}"`
	Name    string    `json:"name" fake:"{name}"`
	Color   string    `json:"color" fake:"{hexcolor}"`
	TeamIDs *[]string `json:"teams" fake:"skip"`
}

func MapToCluster(dbCluster *postgresql.ClusterModel) (*Cluster, error) {
	cluster := &Cluster{
		ID:    dbCluster.ID,
		Name:  dbCluster.Name,
		Color: dbCluster.Color,
	}
	return cluster, nil
}
