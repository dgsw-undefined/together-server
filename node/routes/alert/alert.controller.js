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

/*
  team에서 유저 추방할때 보냄
*/

exports.team_member_kickout = (req,res) => {
  pool.getConnection((err,connection) => {
    save_alert(res,connection,null,parseInt(req.decoded.iss),req.body.kickout_id,req.body.team_id,1,7)
    connection.release();
  })
}

/*
  나갈 때 팀멤버들에게 전송
*/

exports.team_member_walkout = (req,res) => {
  stmt = 'SELECT user_id FROM team_member WHERE team_id = '+req.body.team_id+' AND team_id NOT IN '+parseInt(req.decoded.iss);
  pool.getConnection((err,connection) => {
    connection.query(stmt,(err,rows) => {
      if(err) protocol.error(res,err)
      for (var i in rows) {
        save_alert(res,connection,parseInt(req.decoded.iss),null,req.body.team_id,rows[i].user_id,1,5)
      }
    })
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
      connection.release();
    })
}

/*
  trust 하는 사람이 trust 할 때 알림 전송
*/

exports.trust_me = (req,res) => {
  pool.getConnection((err,connection) => {
    save_alert(res,connection,null,parseInt(req.decoded.iss),req.body.truster_id,null,1,4);
    connection.release();
  })
}
