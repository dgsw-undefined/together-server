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
  stmt = "UPDATE user SET status = ((SELECT status FROM user WHERE id = "+req.decoded.name+")+1)%2 WHERE id = "+req.decoded.name
  connection.query(stmt,(err,rows) => {
    if(err) protocol.error(res,err)
    if(rows == 0) protocol.notFound(res)
    protocol.success(res)
  });
}
