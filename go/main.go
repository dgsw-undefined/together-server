package main

import (
	"net/http"
	"together/controllers"

	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
)

func mainJWT(c echo.Context) error {
	return c.String(http.StatusOK, "jwt!!")
}
func main() {
	e := echo.New()
	e.Use(middleware.Recover())
	e.Use(middleware.LoggerWithConfig(middleware.LoggerConfig{
		Format: "method=${method}, uri=${uri}, status=${status}\n",
	}))
	user := e.Group("/user")
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"*"},
		AllowMethods: []string{echo.GET, echo.PUT, echo.POST, echo.DELETE},
	}))
	e.GET("/", func(c echo.Context) error {
		return c.JSON(http.StatusOK, "Hello world")
	})
	user.POST("/signup", controllers.SignUp)
	user.POST("/signin", controllers.SignIn)
	e.Logger.Fatal(e.Start(":8081"))
}
