//JWT 모듈 encoding : Hs256
const jwt = require('jsonwebtoken')
//Protocol Format 연결
const protocol = require('../../util/protocolFormat').alert;
//Mysql 접속
const mysql_dbc = require('../../db/dbcon')();
const mysql = require('mysql')
const pool = mysql_dbc.init();
//query 명령어
var stmt = null
var params = null;
//alert DB들어가는 값
var user_id = null
var sender = null
var team_id = null

const save_alert = (res,user_id,sender,team_id,receiver,type) => {
  stmt = 'INSERT INTO alert (user_id,type,sender,receiver,team_id) values (?,?,?,?,?)'
  params = [user_id,type,sender,receiver,team_id]

  pool.getConnection((err,connection) => {
    connection.query(stmt,params,(err,rows) => {
      if(err) protocol.err(res)
      protocol.success(res)
    })
  })
}
