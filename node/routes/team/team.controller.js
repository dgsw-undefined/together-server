//Protocol Format 연결
const protocol = require('../../util/protocolFormat')
//JWT 모듈 encoding : Hs256
const jwt = require('jsonwebtoken')
//Mysql 접속
const mysql_dbc = require('../../db/dbcon')();
const mysql = require('mysql')
const pool = mysql_dbc.init();
mysql_dbc.test_open(pool);
//query 명령어
var stmt = null;

/*
  Get /team
*/

exports.list = (req, res) => {
  var user_id = mysql.escape(req.params.id)
  stmt = 'SELECT * FROM team WHERE id IN ('
  stmt += 'SELECT team_id FROM team_member WHERE user_id = '+user_id+')'
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

  var team_id = null;

  //Team테이블에 팀 생성
  stmt = 'INSERT INTO team (name,subject,descrip,leader_id) values (?,?,?,?)'
  params = [req.body.name,req.body.subject,req.body.descrip,req.body.leader_id]
  pool.getConnection((err,connection) => {
    connection.query(stmt,params,(err,rows) => {
      if(err) return protocol.error(res,err)
    });

    //추가한 Team_id를 찾음

    stmt = 'SELECT id FROM team where leader_id = \''+req.body.leader_id+'\''+'GROUP BY id ORDER BY id DESC'
    connection.query(stmt,(err,rows) => {
      if(err) return protocol.error(res,err)

      //찾은 Team_id로 리더를 Team_member테이블에 삽입

      stmt = 'INSERT INTO team_member (team_id,user_id,area,inviter_id) values (?,?,?,?)'
      params = [rows[0].id,req.body.leader_id,req.body.area,req.body.leader_id]

      connection.query(stmt,params,(err,rows) => {
        if(err) return protocol.error(res,err)
        return protocol.success(res)
      })
    });

    connection.release();
  });
}
