const mysql_dbc = require('../../db/dbcon')();
const mysql = require('mysql')
const pool = mysql_dbc.init();
const protocol = require('../../util/protocolFormat')
const jwt = require('jsonwebtoken')
// encoding : Hs256
mysql_dbc.test_open(pool);
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
  stmt = 'INSERT INTO team (name,subject,desc,leader_id) values ('
}
