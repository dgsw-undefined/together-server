package db

import (
	"database/sql"
	"fmt"

	_ "github.com/go-sql-driver/mysql"
)

func CreateCon() *sql.DB {
	db, err := sql.Open("", "")
	if err != nil {
		fmt.Println(err.Error())
	} else {
		fmt.Println("db is connected")
	}
	err = db.Ping()
	if err != nil {
		fmt.Println("db is not connected")
		fmt.Println(err.Error())
	}
	return db
}
