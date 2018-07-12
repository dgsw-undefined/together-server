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
  fetch /user/able
*/

exports.available = (req,res) => {
  stmt = 'UPDATE user SET status = '+mysql.escape(req.body.status)
  pool.getConnection((err,connection) => {
    connection.query(stmt,(err,rows) => {
      if(err) protocol.trust.error(res,err)
      if(rows == 0) protocol.notFound(res)
      protocol.trust.success(res)
    });
    connection.release()
  })
}

/*
  GET /user/trust
*/

exports.truster_list = (req,res) => {
  stmt = 'SELECT * FROM truster WHERE user_id = '+parseInt(req.decoded.id)
  pool.getConnection((err,connection) => {
    connection.query(stmt,(err,rows) => {
      if(err) protocol.trust.error(res,err)
      if(rows == 0) protocol.notFound(res)
      protocol.trust.success(res,rows)
    });
    connection.release()
  })
}

/*
  POST /user/trust
*/

exports.trust = (req, res) => {
  stmt = 'INSERT INTO truster (user_id,truster_id) VALUES (?,?)'
  var params = [parseInt(req.decoded.id),mysql.escape(req.body.trust_id)]

  pool.getConnection((err, connection) => {
    connection.query(stmt,params,(err, rows) => {
      if(err) protocol.trust.error(res,err)
      console.log("decoded name : "+req.decoded.name+" req.body.trust_id : "+req.body.trust_id)
      protocol.trust.success(res)
    });
    connection.release()
  })
}

/*
  PUT /user/update
*/

exports.update = (req,res) => {
  stmt = 'UPDATE FROM user SET name = ? , pw = ? , email = ? , status = ? , interested = ? , github = ? , enroll_date = ? , field = ? , position = ?, phone = ?'
  params = [
    req.body.name,
    req.body.pw,
    req.body.email,
    req.body.status,
    req.body.interested,
    req.body.github,
    req.body.enroll_date,
    req.body.field,
    req.body.position,
    req.body.phone
  ]
  pool.getConnection((err,connection) => {
    connection.query(stmt,params,(err,rows) => {
      if(err) protocol.user.error(res,err)
      protocol.user.success(res)
    })
    connection.release();
  })

}

/*
  GET /user/detail
*/

exports.detail = (req,res) => {
  stmt = 'SELECT * FROM user WHERE idx = '+req.body.user_id
  pool.getConnection((err,connection) => {
    if(err) protocol.user.error(res,err)
    connection.query(stmt,(err,rows) => {
      if(err) protocol.user.error(res,err)
      protocol.user.success(res,rows)
    })
    connection.release();
  })
}

/*
  POST /user/untrust
*/

exports.untrust = (req, res) => {
  stmt = 'DELETE FROM truster WHERE user_id = ? AND truster_id = ?'
  params = [parseInt(req.decoded.id),mysql.escape(req.body.trust_id)]
  pool.getConnection((err,connection) => {
    if(err) protocol.error(err)
    connection.query(stmt,params,(err,rows) => {
      if(err) protocol.trust.error(err)
      protocol.success(res)
    })
    connection.release();
  })
}

exports.userList=(req,res)=>{
  var mode=req.params.mode;
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
