FROM golang:1.17.1-alpine3.14 AS builder

RUN apk --no-cache add \
    alpine-sdk \
    librdkafka-dev \
    pkgconf && \
    rm -rf /var/cache/apk/*

WORKDIR /build/

COPY . .

RUN go mod download

RUN CGO_ENABLED=0 go build \
    -o ./graphql \
    ./cmd/graphql

#-

FROM public.ecr.aws/lambda/provided:al2

WORKDIR /app
ENV PATH=/app/bin:$PATH

COPY --from=builder /build/graphql ./bin/graphql
COPY --from=builder /build/.env.prod ./.env

ENTRYPOINT [ "graphql" ]