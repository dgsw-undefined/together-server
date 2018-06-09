//Protocol Format 연결
const protocol = require('../../util/protocolFormat').trust
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
  stmt = 'UPDATE user SET status = '+mysql.escape(req.body.status)
  pool.getConnection((err,connection) => {
    connection.query(stmt,(err,rows) => {
      if(err) protocol.error(res,err)
      if(rows == 0) protocol.notFound(res)
      protocol.success(res)
    });
    connection.release()
  })
}

/*
  truster_list
*/

exports.truster_list = (req,res) => {
  stmt = 'SELECT * FROM truster WHERE user_id = '+parseInt(req.decoded.iss)
  pool.getConnection((err,connection) => {
    connection.query(stmt,(err,rows) => {
      if(err) protocol.error(res,err)
      if(rows == 0) protocol.notFound(res)
      protocol.success(res,rows)
    });
    connection.release()
  })
}

/*
  trust
*/

exports.trust = (req, res) => {
  stmt = 'INSERT INTO truster (user_id,truster_id) VALUES (?,?)'
  var params = [parseInt(req.decoded.iss),mysql.escape(req.body.trust_id)]

  pool.getConnection((err,connection) => {
    connection.query(stmt,params,(err,rows) => {
      if(err) protocol.error(res,err)
      protocol.success(res)
    })
  })
}

/*
  untrust
*/

exports.untrust = (req, res) => {
  stmt = 'DELETE FROM truster WHERE user_id = ? AND truster_id = ?'
  params = [parseInt(req.decoded.iss),mysql.escape(req.body.trust_id)]
  pool.getConnection((err,connection) => {
    connection.query(stmt,params,(err,rows) => {
      if(err) protocol.error(err)
      protocol.success(res)
    })
  })
}
