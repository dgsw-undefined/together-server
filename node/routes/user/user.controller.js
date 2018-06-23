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
  stmt = 'INSERT INTO truster (user_id,truster_id) VALUES (?,?)'
  var params = [req.decoded.name,req.body.trust_id]

  pool.getConnection((err, connection) => {
    connection.query(stmt,params,(err, rows) => {
      if(err) protocol.error(res,err)
      console.log("decoded name : "+req.decoded.name+" req.body.trust_id : "+req.body.trust_id)
      protocol.success(res)
    });
    connection.release()
  })
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

exports.userList=(req,res)=>{
  let mode=req.params.mode;
  const date_Asending=()=>{
    stmt='SELECT name,enroll_date FROM user order by enroll_date';
    pool.getConnection((err,connection) => {
      connection.query(stmt,(err,rows) => {
        if(err) protocol.list.error(res.err)
        protocol.list.success(res,rows)
      });
      connection.release()
    })
  }
  const date_Desending=()=>{
    stmt='SELECT name,enroll_date FROM user order by enroll_date DESC';
    pool.getConnection((err,connection) => {
      connection.query(stmt,(err,rows) => {
        if(err) protocol.list.error(res.err)
        protocol.list.success(res,rows)
      });
      connection.release()
    })
  }
  const truster_Desending=()=>{
    stmt='SELECT *,count(CASE WHEN user.idx=truster.truster_id THEN 1 END) as trustercount FROM user join truster on user.idx=truster.truster_id group by idx order by trustercount DESC';
    pool.getConnection((err,connection) => {
      connection.query(stmt,(err,rows) => {
        if(err) protocol.list.error(res.err)
        protocol.list.success(res,rows)
      });
      connection.release()
    })
  }
  if(mode==1){//가입 날짜 오름차순
    date_Asending();
  }else if(mode==2){//가입 날짜 내림차순
    date_Desending();
  }else if(mode==3){//트러스터 수 내림차순
    truster_Desending()
  }else{
    protocol.list.badRequset()
  }
}
