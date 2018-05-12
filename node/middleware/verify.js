const jwt = require('jsonwebtoken')

const verifyMiddleware = (req, res, next) => {

  const token = req.headers['authorization']

  if(!token){
    return res.status(401).json({
      Code : 0,
      Desc : 'not logged in'
    });
  }

  const verify = new Promise(
    (resolve,reject) => {
      jwt.verify(token,req.app.get('jwt-secret'),(err, decoded) => {
        if(err) reject(err)
        resolve(decoded)
      })
    }
  )

  const onError = (error) => {
    res.status(403).json({
      Code : 0,
      error : error.message
    })
  }

  verify.then((decoded) => {
    next()
  }).catch(onError)

}

module.exports = verifyMiddleware
