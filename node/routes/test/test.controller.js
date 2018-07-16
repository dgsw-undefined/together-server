
//Protocol Format 연결
const protocol = require('../../util/protocolFormat').team;
//JWT 모듈 encoding : Hs256
const jwt = require('jsonwebtoken')
const moment = require('moment')
//Mysql 접속
const mysql_dbc = require('../../db/dbcon')();
const mysql = require('mysql')
const pool = mysql_dbc.init();

//query 명령어
var stmt = null;
//query 값
var params = null;

exports.team_list = (req, res) => {
  stmt = 'SELECT * FROM team'
  pool.getConnection((err,connection) => {
    connection.query(stmt, (err, rows) => {
      if(err) return protocol.error(res,err)
      if(rows == 0) return protocol.notFound(res)
      return protocol.success(res,rows)
      connection.release();
    });
  });
}
