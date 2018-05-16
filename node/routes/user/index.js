const router = require('express').Router()
const controller = require('./user.controller')

router.fetch('/able', controller.available)

module.exports = router
