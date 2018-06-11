const router = require('express').Router()
const controller = require('./alert.controller')

router.get('/',(req,res) => {
  res.send('hi!')
})

module.exports = router
