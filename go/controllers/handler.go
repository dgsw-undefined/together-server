package controllers

import (
	"go-study/models"
	"net/http"

	"github.com/labstack/echo"
)

type result struct {
	Code  int
	Desc  string
	Err   error
	Token string
	Data  map[string]string
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
	return c.JSON(http.StatusOK, result)
}
func SignIn(c echo.Context) error {
	result := result{}
	u := new(reqUser)
	if err := c.Bind(u); err != nil {
		result.Code = 110
		result.Desc = "서버 측 에러 서지녁을 욕 할 것"
		result.Err = err
		result.Token = ""
		return c.JSON(http.StatusOK, result)
	}
	id := u.Id
	pw := u.Pw
	err, status, token, data := models.SignIn(id, pw)
	if status == 404 {
		result.Code = 104
		result.Desc = "아이디 혹은 비밀 번호가 틀림"
		result.Err = nil
		result.Token = ""
		result.Data = nil
		return c.JSON(http.StatusOK, result)
	}

	if status == 500 {
		result.Code = 105
		result.Desc = "서지녁에게 문의 할 것"
		result.Err = err
		result.Token = ""
		result.Data = nil
		return c.JSON(http.StatusOK, result)
	}
	if status == 200 {
		result.Code = 100
		result.Desc = "로그인 성공"
		result.Err = nil
		result.Token = token
		result.Data = data
		return c.JSON(http.StatusOK, result)
	}
	return c.JSON(http.StatusOK, "Bad Request")
}
