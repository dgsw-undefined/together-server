var mysql = require('mysql');
var config = require('../db/dbinfo').local;

module.exports = () => {
  return {
    init : () => {
      return mysql.createPool({
        host : config.host,
        port : config.port,
        user : config.user,
        password : config.password,
        database : config.database,
        connectionLimit : config.connectionLimit
      });
    },

    test_open : (con) => {
      con.getConnection((err) => {
        if (err)
          console.log("Mysql Error : "+err);
        else
          console.log("Mysql is Connected");
      });
    }
  }
}
