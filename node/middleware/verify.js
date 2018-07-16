const jwt = require('jsonwebtoken')
const verifyMiddleware = (req, res, next) => {

const token = req.headers['authorization']

  // if(!token){
  //   // return res.send({
  //   //   Code : 0,
  //   //   Desc : 'not logged in'
  //   // });
  // }

  const verify = new Promise(
    (resolve,reject) => {
      if(token) {
        jwt.verify(token,req.app.get('jwt-secret'),(err, decoded) => {
          if(err) reject(err)
          console.log("decoded-------- : "+decode);
            resolve(decode)
        })
      }
      reject()
    }
  )

  const onError = (error) => {
    res.send({
      Code : 0,
      Desc : err.message
    })
  }

//decoded에 idx에 user의 idx값 저장됨

  verify.then((decoded) => {
    if(!decoded)
      req.decoded = decoded
    next()
  }).catch(next())
}

module.exports = verifyMiddleware
