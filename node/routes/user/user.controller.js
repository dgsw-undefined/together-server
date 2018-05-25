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
  stmt = "UPDATE user SET status = "+mysql.escape(req.body.status)
  pool.getConnection((err,connection) => {
    connection.query(stmt,(err,rows) => {
      if(err) protocol.error(res,err)
      if(rows == 0) protocol.notFound(res)
      protocol.success(res)
    });
    connection.release();
  })
}

/*
  truster_list
*/

exports.truster_list = (req,res) => {
  stmt = "SELECT * FROM truster WHERE user_id = "+mysql.escape(req.decoded.name)
  pool.getConnection((err,connection) => {
    connection.query(stmt,(err,rows) => {
      if(err) protocol.error(res.err)
      if(rows == 0) protocol.notFound(res)
      protocol.success(res,rows)
    });
    connection.release();
  })
}

/*
  trust
*/

exports.trust = (req, res) => {

}

/*
  untrust
*/

exports.untrust = (req, res) => {

}
