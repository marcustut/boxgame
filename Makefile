.PHONY: pgcli prisma-studio graphql-run

# variables
PRISMA_SCHEMA_PATH="./internal/postgresql/schema.prisma"
BUILD_DIR="./target"

# load .env
ifneq (,$(wildcard ./.env))
    include .env
    export
endif

# take away '?pgbouncer=true' from DATABASE_URL
DATABASE_URL := $(patsubst %?pgbouncer=true,%,$(DATABASE_URL))

clean:
	rm -rf ./target

pgcli:
	pgcli $(DATABASE_URL)

# prisma-migrate-dev:
# 	go run github.com/prisma/prisma-client-go migrate dev --name $(NAME) --schema $(PRISMA_SCHEMA_PATH)

prisma-migrate-deploy:
	go run github.com/prisma/prisma-client-go migrate deploy --schema $(PRISMA_SCHEMA_PATH)

prisma-db-push:
	go run github.com/prisma/prisma-client-go db push --schema $(PRISMA_SCHEMA_PATH)

prisma-db-pull:
	go run github.com/prisma/prisma-client-go db pull --schema $(PRISMA_SCHEMA_PATH)

prisma-generate:
	go run github.com/prisma/prisma-client-go generate --schema $(PRISMA_SCHEMA_PATH)

prisma-studio:
	prisma studio --schema $(PRISMA_SCHEMA_PATH)

gqlgen-generate:
	go get github.com/99designs/gqlgen/cmd@v0.14.0 && go run github.com/99designs/gqlgen generate

graphql-dev:
	air -c .air.graphql.toml

graphql-build:
	go build -o $(BUILD_DIR)/graphql ./cmd/graphql

graphql-run:
	$(BUILD_DIR)/graphql

graphql-deploy-dev: clean graphql-build
	sls deploy --verbose --region ap-southeast-1 

graphql-deploy-prod: clean graphql-build
	sls deploy --verbose --region ap-southeast-1 --stage production

docker-build-dev:
	docker build -t thebox-graphql-lambda -f build/graphql/dev.Dockerfile .

docker-build-prod:
	docker build -t thebox-graphql-lambda -f build/graphql/prod.Dockerfile .
