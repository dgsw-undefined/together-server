package models

import (
	"crypto/sha512"
	"database/sql"
	_ "database/sql"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"go-study/db"
	"os"
	"time"

	jwt "github.com/dgrijalva/jwt-go"
	"github.com/labstack/echo"
)

type (
	User struct {
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

func SendJwt() (string, error) {
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
		"undefiend",
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
	sha := sha512.New()
	sha.Write([]byte(u.Id))
	shaId := sha.Sum(nil)
	var sqlQ string = "SELECT COUNT(*) as count FROM user WHERE id=?"
	id := hex.EncodeToString(shaId)
	rows, err := conn.Query(sqlQ, id)
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
	sqlQ = "INSERT INTO user(name,id,pw,phone,tec,inter,git,pos,field,mail) VALUES(?,?,?,?,?,?,?,?,?,?)"
	result, err := conn.Exec(sqlQ, u.Name, id, pw, u.Phone, u.Tec, u.Inter, u.Git, u.Pos, u.Field, u.Mail)
	if err != nil {
		fmt.Println(err)
		return err, 500, ""
	}
	n, err := result.RowsAffected()
	if err != nil {
		fmt.Println(err)
		return err, 500, ""
	}
	if n == 1 {
		fmt.Println("1 row inserted.")
	}
	token, err := SendJwt()
	if err != nil {
		return err, 500, ""
	}
	return err, 200, token
}
func SignIn(id, pw string) (error, int, string, map[string]string) {
	conn := db.CreateCon()
	defer conn.Close()
	sha1 := sha512.New()
	sha1.Write([]byte(id))
	shaId := sha1.Sum(nil)
	sha2 := sha512.New()
	sha2.Write([]byte(pw))
	shaPw := sha2.Sum(nil)
	id = hex.EncodeToString(shaId)
	pw = hex.EncodeToString(shaPw)
	result := make(map[string]string)
	var name string
	var phone string
	var tec string
	var inter string
	var git string
	var pos string
	var field string
	var mail string
	var count int
	sqlQ := "SELECT COUNT(*) as count,name,phone,tec,inter,git,pos,field,mail FROM user WHERE id=? AND pw=?"
	err := conn.QueryRow(sqlQ, id, pw).Scan(&count, &name, &phone, &tec, &inter, &git, &pos, &field, &mail)
	if count == 0 {
		return nil, 404, "", nil
	}
	if err != nil {
		fmt.Println(err)
		return err, 500, "", nil
	}
	result["name"] = name
	result["phone"] = phone
	result["tec"] = tec
	result["inter"] = inter
	result["git"] = git
	result["pos"] = pos
	result["field"] = field
	result["mail"] = mail
	token, err := SendJwt()
	if err != nil {
		return err, 500, "", nil
	}
	return nil, 200, token, result
}
