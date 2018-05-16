//Protocol Format 연결
const protocol = require('../../util/protocolFormat')
//JWT 모듈 encoding : Hs256
const jwt = require('jsonwebtoken')
//Mysql 접속
const mysql_dbc = require('../../db/dbcon')();
const mysql = require('mysql')
const pool = mysql_dbc.init();
//query 명령어
var stmt = null;

/*
  fetch /able
*/

exports.available = (req,res) => {

}
