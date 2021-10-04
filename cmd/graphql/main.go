package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	echoadapter "github.com/awslabs/aws-lambda-go-api-proxy/echo"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/marcustut/thebox/internal/graphql"
	"github.com/marcustut/thebox/internal/graphql/generated"
)

const defaultPort = "8080"

var echoApp *echo.Echo

func init() {
	echoApp = echo.New()

	echoApp.Use(middleware.Recover())
	echoApp.Use(middleware.Logger())
	echoApp.Use(middleware.Gzip())

	echoApp.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"http://localhost:3000", "https://thebox.fgacycyw.com", "https://thebox.marcustut.tech"},
		AllowHeaders: []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept},
		AllowMethods: []string{http.MethodGet, http.MethodPatch, http.MethodPost, http.MethodDelete},
	}))

	schema := generated.NewExecutableSchema(generated.Config{Resolvers: graphql.NewResolver()})
	server := handler.NewDefaultServer(schema)
	playground := playground.Handler("GraphQL playground", "/graphql")

	echoApp.GET("/health", func(c echo.Context) error {
		return c.JSON(http.StatusOK, "Healthy")
	})

	echoApp.POST("/graphql", func(c echo.Context) error {
		server.ServeHTTP(c.Response(), c.Request())
		return nil
	})

	echoApp.GET("/playground", func(c echo.Context) error {
		playground.ServeHTTP(c.Response(), c.Request())
		return nil
	})
}

func main() {
	isRunningAtLambda := strings.Contains(os.Getenv("AWS_EXECUTION_ENV"), "AWS_Lambda_")

	if isRunningAtLambda {
		lambda.Start(lambdaHandler)
	} else {
		port := os.Getenv("PORT")
		if port == "" {
			port = defaultPort
		}

		echoApp.Logger.Printf("connect to http://localhost:%s/ for GraphQL Playground\n", port)
		echoApp.Logger.Fatal(echoApp.Start(":" + port))
	}

}

func lambdaHandler(ctx context.Context, req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	echoAdapter := echoadapter.New(echoApp)

	resp, err := echoAdapter.Proxy(req)
	if err != nil {
		log.Println(err)
	}
	return resp, err
}
