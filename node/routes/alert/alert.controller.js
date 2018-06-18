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

const save_alert = (res,connection,user_id,sender,team_id,receiver,type,kind) => {
  stmt = 'INSERT INTO alert (user_id,type,sender,receiver,team_id,kind) values (?,?,?,?,?,?)'
  params = [user_id,type,sender,receiver,team_id,kind]

  connection.query(stmt,params,(err,rows) => {
    if(err) protocol.error(res,err)
    protocol.success(res)
  })
}

exports.create_team = (req, res) => {
    stmt = 'SELECT user_id FROM truster WHERE truster_id = '+parseInt(req.decoded.iss)
    pool.getConnection((err,connection) => {
      connection.query(stmt,(err,rows) => {
        if(err) protocol.error(res,err)
        for(var i in rows){
          save_alert(res,connection,null,parseInt(req.decoded.iss),req.body.team_id,rows[i].user_id,1,1)
        }
      })
    })
}
