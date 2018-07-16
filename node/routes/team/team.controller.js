//Protocol Format 연결
const protocol = require('../../util/protocolFormat').team;
//JWT 모듈 encoding : Hs256
const jwt = require('jsonwebtoken')
const moment = require('moment')
//Mysql 접속
const mysql_dbc = require('../../db/dbcon')();
const mysql = require('mysql')
const pool = mysql_dbc.init();

//alert 연결

const alert = require('../alert/alert.controller')

//query 명령어
var stmt = null;
//query 값
var params = null;
/*
  Get /team
*/

/**
 * Functions
 */

const overlap_check = (res,connection,team_id,user_id) => {

  stmt = "SELECT * FROM team_member WHERE team_id = ? AND user_id = ?"
  params = [team_id, user_id]

  connection.query(stmt,params,(err,rows) => {
    if(err) return protocol.error(res,err)
    if(rows != null) return true;
    return false;
  })

}

exports.list = (req, res) => {
  stmt = 'SELECT * FROM team WHERE id IN ('
  stmt += 'SELECT team_id FROM team_member WHERE user_id = '+req.params.user_id+')'
  pool.getConnection((err,connection) => {
    connection.query(stmt, (err, rows) => {
      if(err) protocol.error(res,err)
      if(rows == 0) protocol.notFound(res)
      protocol.success(res,rows)
    });
    connection.release();
  });
}

exports.super_team_list2 = (req,res) => {
  var send_data = {};
  var member_list = new Array;
  const waitFor = (ms) => new Promise(r => setTimeout(r, ms))

  stmt = 'SELECT * FROM team WHERE id IN ('
  stmt += 'SELECT team_id FROM team_member WHERE user_id = '+req.params.user_id+')'

  pool.getConnection((err,connection) => {
    if(err) protocol.error(res,err)
    connection.query(stmt, async (err, rows) => {
      if(err) protocol.error(res,err)
      send_data.team = rows
      stmt = 'SELECT *, (SELECT name FROM user WHERE idx = tm.user_id) as name FROM team_member as tm WHERE team_id = ? AND kickout_date IS NULL AND walkout_date IS NULL;'
      for(var i = 0; i < rows.length; i++) {
        params = [rows[i].id]
        connection.query(stmt,params, (err,rows2) => {
          if(err) protocol.error(res,err)
          member_list.push(rows2);
        })
      }
      await waitFor(50)
      send_data.team_member = member_list
      protocol.success(res,send_data)
    })
  })
}

// async function member_list(conneciton,rows) {
// stmt = 'SELECT *, (SELECT name FROM user WHERE idx = tm.user_id) as name FROM team_member as tm WHERE team_id = ? AND kickout_date IS NULL AND walkout_date IS NULL;'
//   var temp_list = new Array();
//   for(const team of rows){
//     connection.query(stmt,params,(err,rows) => {
//         if(err) protocol.error(res,err)
//         temp_list.push(rows)
//       })
//   }
//   return temp_list
// }

exports.super_team_list = (req,res) => {

  const getConnection = () => new Promise((resolve,reject) => {
    pool.getConnection((err,connection) => {
      if(err) reject(connection,err)
      console.log('1')
      resolve(connection)
    })
  })

  const team_list = (connection) => new Promise((resolve,reject) => {
    var send_data = {};
    stmt = 'SELECT * FROM team WHERE id IN (SELECT team_id FROM team_member WHERE user_id = ' + req.params.user_id + ')'
    connection.query(stmt, (err, rows) => {
      if(err) reject(connection, err)
      send_data.team = rows
      console.log('2')
      resolve({ send_data, rows })
    })
  })

  const team_member_list = (connection, send_data, rows) => new Promise((resolve,reject) => {
    var member_list = new Array();
    stmt = 'SELECT *, (SELECT name FROM user WHERE idx = tm.user_id) as name FROM team_member as tm WHERE team_id = ? AND kickout_date IS NULL AND walkout_date IS NULL;'
    new Promise((resolve, reject) => {
      for(var i = 0; i <= rows.length; i++) {
        if (i >= rows.length) {
          resolve(member_list);
        }
        params = [rows[i].id]
        connection.query(stmt,params,(err,rows) => {
          if(err) reject(connection, err)
          member_list.push(rows)

        })
      }
    }).then((res) => {
      console.log(member_list);
      // console.log(res);
    });

    // new Promise((resolve, reject) => {
    //   Object.keys(rows).forEach((key) => {
    //     params = [rows[key].id]
    //     new Promise((resolve, reject) => {
    //       connection.query(stmt,params,(err,rows) => {
    //         if(err) reject(connection, err)
    //         // member_list.push(rows)
    //         resolve(rows)
    //       });
    //     }).then((res) => {
    //       member_list.push(res);
    //     });
    //   });
    //   resolve();
    // }).then(() => {
    //   console.log('member_list ------------');
    //   console.log(member_list);
    // }).catch((err) => {
    //   console.log(err);
    // });

    console.log('3')
    resolve({ send_data, member_list })
  });

  const merge = (connection, send_data, member_list) => new Promise((resolve,reject) => {

    send_data.team_member = member_list
    console.log('4')
    protocol.success(res,send_data)
  })

  const onError = (connection,err) => {
    connection.release();
    protocol.error(res,err)
  }

  getConnection().then((connection) => {
    team_list(connection).then((res) => {
      team_member_list(connection, res.send_data, res.rows).then((res) => {
        merge(connection, res.send_data, res.member_list).then(() => {
          console.log('success');
        }).catch((err) => {
          console.log(err);
        });
      }).catch((err) => {
        console.log(err);
      });
    }).catch((err) => {
      console.log(err);
    });
  }).catch((err) => {
    console.log(err);
  });
  // Promise.all([getConnection,team_list,team_member_list,merge])
  // .then((res)=>console.log(res))
  // .catch((err)=>console.log(err));
  // getConnection.then(team_list())
  // .then(team_member_list())
  // .then(merge())
  // .catch(onError())
}



/*
  Post /team
*/

exports.create = (req, res) => {

  var user_id = req.decoded.id;
  //todo DB구조 추가 했으니까 그거에 맞는 프로토콜, 코드 수정해야댐!

  stmt = 'SELECT * FROM team WHERE name LIKE '+req.body.name

  pool.getConnection((err,connection) => {

    connection.query(stmt,(err,rows) => {
      if(rows != null)
        protocol.overlap(res)
    })


    //Team테이블에 팀 생성
    stmt = 'INSERT INTO team (name,docs,area,subject,leader_id,member_limit) values (?,?,?,?,?,?)'
    params = [req.body.name,req.body.docs,req.body.area,req.body.subject,user_id,req.body.member_limit]

    connection.query(stmt,params,(err,rows) => {
      if (err) protocol.error(res,err)
    });
    //추가한 Team_id를 찾음

    stmt = 'SELECT id FROM team WHERE leader_id = \''+user_id+'\' GROUP BY id ORDER BY id DESC'
    connection.query(stmt,(err,rows) => {
      if(err) protocol.error(res,err)

      //찾은 Team_id로 리더를 Team_member테이블에 삽입

      stmt = 'INSERT INTO team_member (team_id,user_id,field,inviter_id,is_leader) values (?,?,?,?,?)'
      params = [rows[0].id,user_id,req.body.field,user_id,1]

      connection.query(stmt,params,(err,rows) => {
        if(err) protocol.error(res,err)
        protocol.success(res)
        })
      });

      connection.release();
    });
  }

  /*
    DELETE /team
  */

  exports.destroy = (req,res) => {
    stmt = 'UPDATE FROM team SET destroy_date = now()'

    pool.getConnection((err,connection) => {
      connection.query(stmt,(err,rows) => {
        if(err) protocol.error(res,err)
        protocol.success(res)
      })
      connection.release();
    })
  }

  /*
    Post /team/join
  */

  exports.join = (req,res) => {
    var user_id = parseInt(req.decoded.id)

    stmt = "INSERT INTO team_member (team_id,user_id,inviter_id) values (?,?,?,?)"
    params = [req.body.team_id,req.body.user_id,user_id]

    pool,getConnection((err,connection) => {


      connection.query(stmt,params,(err,rows) => {
        if(err) protocol.err(res)
        protocol.success(res)
      });
      connection.release();
    });
  }

  /*
    Post /team/kickout
  */

  exports.kickout = (req,res) => {
    var user_id = parseInt(req.decoded.id)

    pool.getConnection((err,connection) => {

      stmt = 'SELECT is_leader FROM team_member WHERE team_id = ? AND user_id = ?'
      params = [req.body.team_id,user_id]

      connection.query(stmt,params,(err,rows) => {
        if(rows[0].is_leader != 1)
          protocol.err(res)

        stmt = 'UPDATE team_member SET kickout_date = now() WHERE user = '+req.body.user_id
        connection.query(stmt,(err,rows) => {
          if(err) protocol.error(res)
          protocol.success(res)
        })
      })
      connection.release();
    })
  }

  /*
    Get /team/member
  */

  exports.member_list = (req, res) => {

    stmt = 'SELECT *, (SELECT name FROM user WHERE idx = tm.user_id) as name FROM team_member as tm WHERE team_id = ? AND kickout_date IS NULL AND walkout_date IS NULL;'
    params = [req.params.team_id]

    pool.getConnection((err,connection) => {

      connection.query(stmt,params,(err,rows) => {
        if(err) protocol.error(res,err);
        protocol.success(res,rows)
      })
      connection.release();
    })
  }
