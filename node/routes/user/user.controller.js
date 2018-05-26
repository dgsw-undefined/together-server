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
  stmt = 'SELECT * FROM truster WHERE user_id = '+mysql.escape(req.decoded.name)
  pool.getConnection((err,connection) => {
    connection.query(stmt,(err,rows) => {
      if(err) protocol.error(res.err)
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

  const connect = new Promise(
    pool.getConnection(err, connection) => {
        if(err) reject(err)
        resolve(connection)
    }
  )


  const select = (connection) => {
    return new Promise((resolve,reject) => {
      stmt = 'SELECT idx FROM user WHERE id = '+req.decoded.name
      connection.query(stmt,(err, rows) => {
        var idx = null
        if(err || rows == 0) reject(err)
        if(rows != 0) idx = rows[0].idx
        resolve(idx,connection)
      })
    });
  }

  const insert = (user_id,connection) => {
    return new Promise((resolve,reject) => {
      stmt = 'INSERT INTO truster (user_id,truster_id) VALUES (?,?)'
      var params = [user_id,req.body.trust_id]

      connection.query(stmt,params,(err,rows) => {
        if(err) reject(err)
        resolve(connection)
      })
    });
  }

  const release = (connection) => {
    connection.release()
    return protocol.success(res)
  }

  const onError = (err) => {
    connection.release()
    protocol.error(res,err)
  }

  connect
  .then(select)
  .then(insert)
  .then(release)
  .catch(onError)
}

/*
  untrust
*/

exports.untrust = (req, res) => {
  stmt = 'DELETE FROM truster WHERE user_id = ? AND truster_id = ?'
  params = [mysql.escape(req.decoded.name),mysql.escape(req.body.trust_id)]
  pool.getConnection((err,connection) => {
    connection.query(stmt,params,(err,rows) => {
      if(err) protocol.error(err)
      protocol.success(res)
    })
  })
}
