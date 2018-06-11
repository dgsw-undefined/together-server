//Protocol Format 연결
const protocol = require('../../util/protocolFormat').team;
//JWT 모듈 encoding : Hs256
const jwt = require('jsonwebtoken')
//Mysql 접속
const mysql_dbc = require('../../db/dbcon')();
const mysql = require('mysql')
const pool = mysql_dbc.init();
//query 명령어
var stmt = null;

//query 값

var params = null;
/*
  Get /team
*/

exports.list = (req, res) => {
  stmt = 'SELECT * FROM team WHERE id IN ('
  stmt += 'SELECT team_id FROM team_member WHERE user_id = '+parseInt(req.decoded.iss)+')'
  pool.getConnection((err,connection) => {
    connection.query(stmt, (err, rows) => {
      if(err) return protocol.error(res,err)
      if(rows == 0) return protocol.notFound(res)
      return protocol.success(res,rows)
      connection.release();
    });
  });
}

/*
  Post /team
*/

exports.create = (req, res) => {

  var user_id = req.decoded.iss;
  //todo DB구조 추가 했으니까 그거에 맞는 프로토콜, 코드 수정해야댐!

  //Team테이블에 팀 생성
  stmt = 'INSERT INTO team (name,docs,area,subject,leader_id,member_limit) values (?,?,?,?,?,?)'
  params = [req.body.name,req.body.docs,req.body.area,req.body.subject,user_id,req.body.limit]
  pool.getConnection((err,connection) => {
    connection.query(stmt,params,(err,rows) => {
      if(err) return protocol.error(res,err)
    });

    //추가한 Team_id를 찾음

    stmt = 'SELECT id FROM team WHERE leader_id = \''+user_id+'\' GROUP BY id ORDER BY id DESC'
    connection.query(stmt,(err,rows) => {
      if(err) return protocol.error(res,err)

      //찾은 Team_id로 리더를 Team_member테이블에 삽입

      stmt = 'INSERT INTO team_member (team_id,user_id,field,inviter_id,is_leader) values (?,?,?,?,?)'
      params = [rows[0].id,user_id,req.body.field,user_id,1]

      connection.query(stmt,params,(err,rows) => {
        if(err) return protocol.error(res,err)
        return protocol.success(res)
        })
      });
      connection.release();
    });
  }
  /*
    Post /team/join
  */


  exports.join = (req,res) => {
    var user_id = parseInt(req.decoded.iss)

    stmt = "INSERT INTO team_member (team_id,user_id,inviter_id) values (?,?,?,?)"
    params = [req.body.team_id,req.body.user_id,user_id]

    pool,getConnection((err,connection) => {
      connection.query(stmt,params,(err,rows) => {
        if(err) protocol.err(res)
        protocol.success(res)
      });

      connection.release();
    });
  }

  /*
    Post /team/kickout
  */

  exports.kickout = (req,res) => {
    var user_id = parseInt(req.decoded.iss)

    pool.getConnection((err,connection) => {

      stmt = 'SELECT is_leader FROM team_member WHERE team_id = ? AND user_id = ?'
      params = [req.body.team_id,user_id]

      connection.query(stmt,params,(err,rows) => {
        if(rows[0].is_leader != 1)
          protocol.err(res)

        stmt = 'UPDATE team_member SET kickout_date = ? WHERE user = ?'
        params = ['getdate()',req.body.user_id]
        connection.query(stmt,params,(err,rows) => {
          if(err) protocol.err(res)
          protocol.success(res)
        })
      })
      connection.release();
    })
  }
