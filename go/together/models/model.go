package models

import (
	"crypto/sha512"
	"database/sql"
	_ "database/sql"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"os"
	"time"
	"together/db"

	jwt "github.com/dgrijalva/jwt-go"
	"github.com/labstack/echo"
)

type (
	User struct {
		Idx   int      `json:"idx"`
		Name  string   `json:"name"`
		Id    string   `json:"id"`
		Pw    string   `json:"pw"`
		Phone string   `json:"phone"`
		Tec   []string `json:"tec"`
		Inter string   `json:"inter"`
		Git   string   `json:"git"`
		Pos   string   `json:"pos"`
		Field string   `json:"field"`
		Mail  string   `json:"mail"`
	}
	Users struct {
		Users []User `json:"user"`
	}
	Config struct {
		Secret string
	}
	JwtClaims struct {
		Name string `json:"name"`
		jwt.StandardClaims
	}
)

var con *sql.DB

var secret string

func SendJwt(id string) (string, error) {
	file, _ := os.Open("config.json")
	defer file.Close()
	decoder := json.NewDecoder(file)
	configuration := Config{}
	err := decoder.Decode(&configuration)
	if err != nil {
		fmt.Println("error:", err)
	}
	secret = configuration.Secret
	claims := JwtClaims{
		id,
		jwt.StandardClaims{
			Id:        "undefiend",
			ExpiresAt: time.Now().Add(24 * time.Hour).Unix(),
		},
	}
	rawToken := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	token, err := rawToken.SignedString([]byte(secret))
	if err != nil {
		return "", err
	}
	return token, nil
}

func SignUp(c echo.Context) (error, int, string) {
	conn := db.CreateCon()
	defer conn.Close()
	u := new(User)
	if err := c.Bind(u); err != nil {
		return err, 401, ""
	}

	var sqlQ string = "SELECT COUNT(*) as count FROM user WHERE id=?"
	rows, err := conn.Query(sqlQ, u.Id)
	defer rows.Close()
	for rows.Next() {
		var count int
		err := rows.Scan(&count)
		if err != nil {
			return err, 500, ""
		}
		if count > 0 {
			return nil, 409, ""
		}
	}
	if err != nil {
		fmt.Println(err)
		return err, 500, ""
	}
	sha2 := sha512.New()
	sha2.Write([]byte(u.Pw))
	shaPw := sha2.Sum(nil)
	pw := hex.EncodeToString(shaPw)
	sqlQ = "INSERT INTO user(name,id,pw,phone,interested,github,position,field,email) VALUES(?,?,?,?,?,?,?,?,?)"
	result, err := conn.Exec(sqlQ, u.Name, u.Id, pw, u.Phone, u.Inter, u.Git, u.Pos, u.Field, u.Mail)
	if err != nil {
		fmt.Println(err)
		return err, 500, ""
	}
	if u.Tec != nil {
		insertId, err := result.LastInsertId()
		if err != nil {
			return err, 500, ""
		}
		stmt, err := conn.Prepare("INSERT INTO tec(user_id,tec_name) VALUES(?,?)")
		if err != nil {
			return err, 500, ""
		}
		defer stmt.Close()
		for _, element := range u.Tec {
			_, err := stmt.Exec(insertId, element)
			if err != nil {
				return err, 500, ""
			}
		}
	}
	token, err := SendJwt(u.Id)
	if err != nil {
		return err, 500, ""
	}
	return err, 200, token
}
func SignIn(c echo.Context) (error, int, string, *User) {
	conn := db.CreateCon()
	defer conn.Close()
	u := new(User)
	if err := c.Bind(u); err != nil {
		return err, 500, "", u
	}
	sha2 := sha512.New()
	sha2.Write([]byte(u.Pw))
	shaPw := sha2.Sum(nil)
	pw := hex.EncodeToString(shaPw)
	var count, idx int
	var name, phone, inter, git, pos, field, mail string
	var tec []string
	sql := "SELECT COUNT(*) as count,idx,name,phone,interested,github,position,field,email FROM user WHERE id=? AND pw=?"
	fmt.Println(u.Id, pw)
	err := conn.QueryRow(sql, u.Id, pw).Scan(&count, &idx, &name, &phone, &inter, &git, &pos, &field, &mail)
	if err != nil {
		return err, 500, "", u
	}
	if count == 0 {
		return err, 404, "", u
	}
	u.Idx = idx
	u.Name = name
	u.Phone = phone
	u.Inter = inter
	u.Git = git
	u.Pos = pos
	u.Field = field
	u.Mail = mail
	sql = "SELECT tec_name FROM tec WHERE user_id=?"
	rows, err := conn.Query(sql, idx)
	defer rows.Close()
	var temp string
	fmt.Print("as1")
	for rows.Next() {
		err := rows.Scan(&temp)
		if err != nil {
			return err, 505, "", u
		}
		tec = append(tec, temp)
	}
	u.Tec = tec
	token, err := SendJwt(u.Id)
	if err != nil {
		return nil, 500, "", u
	}
	return nil, 200, token, u
}
