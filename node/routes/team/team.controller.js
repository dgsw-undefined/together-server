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

//todo Team Create 해야돼!!
exports.create = (req, res) => {
  stmt = 'INSERT INTO team (name,subject,desc,leader_id) values (?,?,?,?)'
  params = [req.body.name,req.body.subject,req.body.desc,req.body.leader_id]
  pool.getConnection((err,connection) => {
    connection.query(stmt,params,(err,rows) => {
      if(err) return protocol.error(err)
    });
  });
}
