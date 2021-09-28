.PHONY: 

PRISMA_SCHEMA_PATH="./internal/postgresql/schema.prisma"

prisma-migrate-dev:
	go run github.com/prisma/prisma-client-go generate migrate dev --name $(NAME) --schema $(PRISMA_SCHEMA_PATH)

prisma-generate:
	go run github.com/prisma/prisma-client-go generate --schema $(PRISMA_SCHEMA_PATH)