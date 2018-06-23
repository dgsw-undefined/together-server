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

const save_alert = (res,connection,user_id,sender,receiver,team_id,type,kind) => {
  stmt = 'INSERT INTO alert (user_id,type,sender,receiver,team_id,kind) values (?,?,?,?,?,?)'
  params = [user_id,type,sender,receiver,team_id,kind]

  connection.query(stmt,params,(err,rows) => {
    if(err) protocol.error(res,err)
    protocol.success(res)
  })
}

/*
  팀장이 apply를 안 받으면 알림
*/



/*
  팀장이 team apply를 받아주면 알림
*/



exports.team_accept = (req,res) => {
  pool.getConnection((err,connection) => {
      save_alert(res,connection,null,parseInt(req.decoded.id),req.body.user_id,req.body.team_id,1,2)
      stmt = 'SELECT user_id FROM team_member WHERE team_id = ? AND user_id NOT IN (?,?)'
      params = [parseInt(req.decoded.id),req.body.user_id]
      connection.query(stmt,params,(err,rows) => {
        if(rows == null)
          protocol.notFound(res)
        for(var i in rows){
          save_alert(res,connection,user_id,parseInt(req.decoded.id),req.body.user_id,req.body.team_id,1,9)
        }
      })
      connection.release()
  })
}

exports.team_break = (req,res) => {
  pool.getConnection((err,connection) => {
    stmt = 'SELECT user_id FROM team_member WHERE team_id = '+req.body.team_id+' AND user_id != '+parseInt(req.decoded.id);
    connection.query(stmt,(err,rows) => {
      for(var i in rows){
          save_alert(res,connection,null,parseInt(req.decoded.id),req.body.team_id,rows[i].user_id,1,8)
      }
    })
    connection.release();
  })
}

exports.team_apply = (req,res) => {
  pool.getConnection((err,connection) => {
    stmt = 'SELECT leader_id FROM team_member WHERE team_id = '+req.body.team_id
    connection.query(stmt,(err,rows) => {
      save_alert(res,connection,null,parseInt(req.decoded.id),rows[i].leader_id,req.body.team_id,2,10)
    })
    connection.release();
  })
}

exports.team_invite = (req,res) => {
  pool.getConnection((err,connection) => {
      save_alert(res,connection,null,parseInt(req.decoded.id),req.body.user_id,req.body.team_id,2,9)
  })
}

/*
  team에서 유저 추방할때 보냄
*/

exports.team_member_kickout = (req,res) => {
  pool.getConnection((err,connection) => {
    save_alert(res,connection,null,parseInt(req.decoded.id),req.body.kickout_id,req.body.team_id,1,7)
    stmt = 'SELECT user_id FROM team_member WHERE team_id = '+req.body.team_id+' AND user_id != '+parseInt(req.decoded.id)
    connection.query(stmt,(err,rows) => {
      for(var i in rows){
        save_alert(res,connection,null,parseInt(req.decoded.id),rows[i].user_id,req.body.team_id,1,6)
      }
    })
    connection.release();
  })
}

/*
  나갈 때 팀멤버들에게 전송
*/

exports.team_member_walkout = (req,res) => {
  stmt = 'SELECT user_id FROM team_member WHERE team_id = '+req.body.team_id+' AND user_id != '+parseInt(req.decoded.id);
  pool.getConnection((err,connection) => {
    connection.query(stmt,(err,rows) => {
      if(err) protocol.error(res,err)
      for (var i in rows) {
        save_alert(res,connection,parseInt(req.decoded.id),rows[i].user_id,req.body.team_id,1,5)
      }
    })
  })
}

exports.create_team = (req, res) => {
    stmt = 'SELECT user_id FROM truster WHERE truster_id = '+parseInt(req.decoded.id)
    pool.getConnection((err,connection) => {
      connection.query(stmt,(err,rows) => {
        if(err) protocol.error(res,err)
        for(var i in rows){
          save_alert(res,connection,null,parseInt(req.decoded.id),rows[i].user_id,req.body.team_id,1,1)
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
    save_alert(res,connection,null,parseInt(req.decoded.id),req.body.truster_id,null,1,4);
    connection.release();
  })
}
