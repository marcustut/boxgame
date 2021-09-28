.PHONY: pgcli prisma-studio graphql-run

# variables
PRISMA_SCHEMA_PATH="./internal/postgresql/schema.prisma"
BUILD_DIR="./build"

# load .env
ifneq (,$(wildcard ./.env))
    include .env
    export
endif

pgcli:
	pgcli $(DATABASE_URL)

prisma-migrate-dev:
	go run github.com/prisma/prisma-client-go migrate dev --name $(NAME) --schema $(PRISMA_SCHEMA_PATH)

prisma-generate:
	go run github.com/prisma/prisma-client-go generate --schema $(PRISMA_SCHEMA_PATH)

prisma-studio:
	go run github.com/prisma/prisma-client-go studio --schema $(PRISMA_SCHEMA_PATH)

gqlgen-generate:
	go get github.com/99designs/gqlgen/cmd@v0.14.0 && go run github.com/99designs/gqlgen generate

graphql-dev:
	air -c .air.graphql.toml

graphql-build:
	go build -o $(BUILD_DIR)/graphql ./cmd/graphql

graphql-run:
	$(BUILD_DIR)/graphql