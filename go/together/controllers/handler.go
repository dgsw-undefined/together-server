package controllers

import (
	"net/http"
	"together/models"

	"github.com/labstack/echo"
)

type result struct {
	Code  int
	Desc  string
	Err   error
	Token string
	Data  interface{}
}
type User struct {
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
type reqUser struct {
	Id string `json:"id"`
	Pw string `json:"pw"`
}

func SignUp(c echo.Context) error {
	err, status, token := models.SignUp(c)
	result := result{}
	if status == 409 {
		result.Code = 109
		result.Desc = "아이디 이미 존재"
		result.Err = err
		result.Token = ""
		return c.JSON(http.StatusOK, result)
	}
	if status == 500 {
		result.Code = 105
		result.Desc = "서지녁에게 문의 할 것"
		result.Err = err
		result.Token = ""
		return c.JSON(http.StatusOK, result)
	}
	if status == 200 {
		result.Code = 100
		result.Desc = "가입 성공"
		result.Err = nil
		result.Token = token
		return c.JSON(http.StatusOK, result)
	}
	return c.JSON(http.StatusInternalServerError, result)
}
func SignIn(c echo.Context) error {
	result := result{}
	err, status, token, data := models.SignIn(c)
	if status == 404 {
		result.Code = 104
		result.Desc = "아이디 혹은 비밀먼호 오류"
		result.Err = err
		result.Token = token
		result.Data = data
		return c.JSON(http.StatusOK, result)
	}
	if status == 500 {
		result.Code = 105
		result.Desc = "너굴맨이 서버를 조져놨으니 서지녁을 찾으라구!"
		result.Err = err
		result.Token = token
		result.Data = data
		return c.JSON(http.StatusOK, result)
	}
	if status == 505 {
		result.Code = 110
		result.Desc = "너굴맨이 서버를 조져놨으니 서지녁을 찾으라구!"
		result.Err = err
		result.Token = token
		result.Data = data
		return c.JSON(http.StatusOK, result)
	}
	if status == 200 {
		result.Code = 100
		result.Desc = "성공"
		result.Err = err
		result.Token = token
		result.Data = data
		return c.JSON(http.StatusOK, result)
	}
	return c.JSON(http.StatusBadRequest, "bad request")
}
