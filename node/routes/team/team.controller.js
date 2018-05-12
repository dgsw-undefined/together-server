const mysql_dbc = require('../../db/dbcon')();
const mysql = require('mysql')
const pool = mysql_dbc.init();
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
      if(err){ res.status(500).json({
        "Code" : 0,
        "Desc" : err.message,
        "stmt" : stmt
      })}

       res.send({
        "Code" : 1,
        "Desc" : "success",
        "Data" : rows
      });
      connection.release();
    });
  });
}


/*
  Post /team
*/

exports.create = (req, res) => {

}
