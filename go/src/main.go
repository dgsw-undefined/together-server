package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"

	_ "github.com/go-sql-driver/mysql"
	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
)

type User struct {
	Name  string `json:"name"`
	Id    string `json:"id"`
	Pw    string `json:"pw"`
	Phone string `json:"phone"`
	Tec   string `json:"tec"`
	Inter string `json:"inter"`
	Git   string `json:"git"`
	Pos   string `json:"pos"`
	Field string `json:"field"`
	Mail  string `json:"mail"`
}

func connectDB() *sql.DB {
	db, err := sql.Open("mysql", "undefiend:rkxdlrkcl@tcp(localhost:3306)/undefined")
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("db Connected")
	return db
}
func createUser(c echo.Context) error {
	u := new(User)
	if err := c.Bind(u); err != nil {
		return err
	}
	return c.JSON(http.StatusOK, u)
}
func main() {
	db := connectDB()
	defer db.Close()
	e := echo.New()
	e.Use(middleware.LoggerWithConfig(middleware.LoggerConfig{
		Format: "method=${method}, uri=${uri}, status=${status}\n",
	}))
	e.GET("/", func(c echo.Context) error {
		return c.String(http.StatusOK, "Hello world")
	})
	e.POST("/user", createUser)
	e.Logger.Fatal(e.Start(":8081"))
}
