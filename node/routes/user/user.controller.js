//Protocol Format 연결
const protocol = require('../../util/protocolFormat')
//JWT 모듈 encoding : Hs256
const jwt = require('jsonwebtoken')
//Mysql 접속
const mysql_dbc = require('../../db/dbcon')();
const mysql = require('mysql')
const pool = mysql_dbc.init();

//path
const path = require('path')

//file 관련
const fs = require('fs')

//query 명령어
var stmt = null;

/*
  fetch /user/able
*/

exports.available = (req, res) => {
  stmt = 'UPDATE user SET status = ' + mysql.escape(req.body.status)
  pool.getConnection((err, connection) => {
    connection.query(stmt, (err, rows) => {
      if (err) return protocol.trust.error(res, err)
      if (rows == 0) return protocol.notFound(res)
      protocol.trust.success(res)
    });
    connection.release()
  })
}

/*
  GET /user/trusted/:user_id
*/

exports.trusting_list = (req, res) => {
  stmt = 'SELECT * FROM truster WHERE user_id = ' + req.params.user_id
  pool.getConnection((err, connection) => {
    connection.query(stmt, (err, rows) => {
      if (err) return protocol.trust.error(res, err)
      if (rows == 0) return protocol.trust.notFound(res)
      protocol.trust.success(res, rows)
    });
    connection.release()
  })
}

/*
  GET /user/trusting/:user_id
*/

exports.trusted_list = (req, res) => {
  stmt = 'SELECT * FROM truster WHERE truster_id = ' + req.params.user_id
  pool.getConnection((err, connection) => {
    connection.query(stmt, (err, rows) => {
      if (err) return protocol.trust.error(res, err)
      if (rows == 0) return protocol.trust.notFound(res)
      protocol.trust.success(res, rows)
    });
    connection.release()
  })
}

/*
  POST /user/trust
*/

exports.trust = (req, res) => {
  stmt = 'INSERT INTO truster (user_id,truster_id) VALUES (?,?)'
  var params = [parseInt(req.decoded.id), mysql.escape(req.body.trust_id)]

  pool.getConnection((err, connection) => {
    connection.query(stmt, params, (err, rows) => {
      if (err) return protocol.trust.error(res, err)
      console.log("decoded name : " + req.decoded.name + " req.body.trust_id : " + req.body.trust_id)
      protocol.trust.success(res)
    });
    connection.release()
  })
}

/*
  PUT /user/update
*/

exports.update = (req, res) => {

  var file_path = null
  //파일을 업로드 했으면

  if (req.file) {
    //이미지 확장자 확인
    var mime = ["image/png", "image/jpg", "image/jpeg", "image/svg"];
    if (mime.indexOf(req.file.mimetype) === -1) {
      fs.unlink(req.file.path, (err) => {
        if (err) return protocol.file.error(res, err)
      })
      protocol.file.invalid(res)
    }
    file_path = path.join("115.68.182.229/profile", req.file.filename)
  }

  stmt = 'UPDATE FROM user SET name = ? , pw = ? , email = ? , status = ? , interested = ? , github = ? , enroll_date = ? , field = ? , position = ?, phone = ?, profile = ?'
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
    req.body.phone,
    file_path
  ]
  pool.getConnection((err, connection) => {
    connection.query(stmt, params, (err, rows) => {
      if (err) return protocol.user.error(res, err)
      protocol.user.success(res)
    })
    connection.release();
  })
}

/*
  GET /user/:user
*/

exports.detail = (req, res) => {
  let send_data = new Object();
  let tec_list = [];
  const waitFor = (ms) => new Promise(r => setTimeout(r, ms))
  stmt = 'SELECT *,(SELECT COUNT(*) FROM truster WHERE user_id = ' + req.params.user_id + ') AS trusting, (SELECT COUNT(*) FROM truster WHERE truster_id = ' + req.params.user_id + ') AS trusted  FROM user WHERE idx = ' + req.params.user_id
  pool.getConnection((err, connection) => {
    if (err) return protocol.user.error(res, err)
    connection.query(stmt, async (err, rows) => {
      if (err) return protocol.user.error(res, err)
      send_data = rows;
    })

    if (send_data.length === 0) {
      console.log(send_data, send_data.length)
      protocol.user.notFound(res)
      connection.release();
      return
    }

    // await waitFor(50)

    stmt = 'SELECT tec_name FROM tec WHERE user_id = ' + req.params.user_id
    try {
      connection.query(stmt, (err, rows) => {
        for (let cnt in rows) {
          tec_list.push(rows[cnt].tec_name)
        }
        send_data[0].tec = tec_list
        console.log(send_data[0].tec)
        protocol.user.success(res, send_data)
      })
      connection.release();
    } catch (err) {
      console.log('ERROR WHILE SELECT', err)
    }
  })
}

/*
  POST /user/untrust
*/

exports.untrust = (req, res) => {
  stmt = 'DELETE FROM truster WHERE user_id = ? AND truster_id = ?'
  params = [parseInt(req.decoded.id), mysql.escape(req.body.trust_id)]
  pool.getConnection((err, connection) => {
    if (err) return protocol.error(err)
    connection.query(stmt, params, (err, rows) => {
      if (err) return protocol.trust.error(err)
      protocol.success(res)
    })
    connection.release();
  })
}

exports.userList = (req, res) => {
  var mode = req.params.mode;
  const waitFor = (ms) => new Promise(r => setTimeout(r, ms))
  const date_Asending = () => {
    stmt = 'SELECT *,(SELECT COUNT(*) FROM truster WHERE user_id = user.idx) AS trusting, (SELECT COUNT(*) FROM truster WHERE truster_id = user.idx) AS trusted FROM user order by enroll_date';
    pool.getConnection((err, connection) => {
      connection.query(stmt, async (err, rows) => {
        if (err) return protocol.list.error(res.err)
        for (let i in rows) {
          let sql = 'SELECT tec_name FROM tec where user_id=' + rows[i].idx;
          connection.query(sql, (err, row) => {
            if (err) return protocol.list.error(res.err)
            let temp = []
            for (let j in row) {
              temp.push(row[j].tec_name)
            }
            rows[i].tec = temp
          })
        }
        await waitFor(50)
        protocol.list.success(res, rows)
      });
      connection.release()
    })
  }
  const date_Desending = () => {
    stmt = 'SELECT * FROM user order by enroll_date DESC';
    pool.getConnection((err, connection) => {
      connection.query(stmt, (err, rows) => {
        if (err) return protocol.list.error(res.err)
        protocol.list.success(res, rows)
      });
      connection.release()
    })
  }
  const truster_Desending = () => {
    stmt = 'SELECT *,count(CASE WHEN user.idx=truster.truster_id THEN 1 END) as trustercount FROM user join truster on user.idx=truster.truster_id group by idx order by trustercount DESC';
    pool.getConnection((err, connection) => {
      connection.query(stmt, (err, rows) => {
        if (err) return protocol.list.error(res.err)
        protocol.list.success(res, rows)
      });
      connection.release()
    })
  }
  if (mode == 1) { //가입 날짜 오름차순
    date_Asending();
  } else if (mode == 2) { //가입 날짜 내림차순
    date_Desending();
  } else if (mode == 3) { //트러스터 수 내림차순
    truster_Desending()
  } else {
    protocol.list.badRequset(res)
  }
}
