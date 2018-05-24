const router = require('express').Router()
const controller = require('./user.controller')

router.patch('/able', controller.available)
router.get('/trust',controller.truster_list)
router.post('/trust',controller.trust)
router.post('/untrust',controller.untrust)
  
module.exports = router
