package models

import (
	"database/sql"
	_ "database/sql"
)

type (
	User struct {
		Idx   int    `json:"idx"`
		Id    string `json:"id"`
		Pw    string `json:"pw"`
		Name  string `json:"name"`
		Phone string `json:"phone"`
		Tec   string `json:"tec"`
		Inter string `json:"inter"`
		Git   string `json:"git"`
		Pos   string `json:"pos"`
		Field string `json:"field"`
		Mail  string `json:"mail"`
	}
	Users struct {
		Users []User `json:"Users"`
	}
)

var con *sql.DB
